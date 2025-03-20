import React, { useState, useEffect } from 'react';
import { Calendar, Users, Utensils, CreditCard, ChevronRight, ChevronLeft, Plus, Trash2, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../constants';

const ROOM_TYPES = [
  { id: 'Single', label: 'Single Room', capacity: 1, description: 'Perfect for solo travelers' },
  { id: 'Double', label: 'Double Room', capacity: 2, description: 'Ideal for couples' },
  { id: 'Family', label: 'Family Room', capacity: 4, description: 'Spacious room for families' },
  { id: 'Suite', label: 'Suite', capacity: 2, description: 'Luxury suite with separate living area' },
  { id: 'Deluxe', label: 'Deluxe Room', capacity: 2, description: 'Premium room with extra amenities' }
];

const MEAL_PRICE = 25;
const MEAL_OPTIONS = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Gluten-Free', 'Dairy-Free'];

const RoomBookingForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  
  const [formData, setFormData] = useState({
    // Step 1: Basic Requirements
    checkIn: '',
    checkOut: '',
    totalGuests: 1,
    
    // Step 2: Room Selection
    selectedRooms: [],
    
    // Step 3: Guest Information & Meal Plans
    guests: [{
      name: '',
      email: '',
      phone: '',
      roomId: '',
      specialRequests: '',
      mealPlans: {
        breakfast: false,
        lunch: false,
        dinner: false
      },
      mealPreferences: {
        breakfast: '',
        lunch: '',
        dinner: ''
      }
    }]
  });

  // Calculate number of days for the stay
  const calculateDays = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    return Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  };

  // Check room availability when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      checkAvailability();
    }
  }, [formData.checkIn, formData.checkOut]);

  // Update guest count when guests array changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalGuests: prev.guests.length
    }));
  }, [formData.guests.length]);

  // Fetch available rooms
  const checkAvailability = async () => {
    if (!formData.checkIn || !formData.checkOut) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/rooms?${new URLSearchParams({
        checkIn: formData.checkIn,
        checkOut: formData.checkOut
      })}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch available rooms');
      }
      
      const rooms = await response.json();
      setAvailableRooms(rooms);
      
      if (rooms.length === 0) {
        setError('No rooms available for selected dates');
      }
    } catch (err) {
      setError(err.message || 'Failed to check room availability');
    } finally {
      setLoading(false);
    }
  };

  // Handle basic input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new guest
  const addGuest = () => {
    setFormData(prev => ({
      ...prev,
      guests: [...prev.guests, {
        name: '',
        email: '',
        phone: '',
        roomId: '',
        specialRequests: '',
        mealPlans: {
          breakfast: false,
          lunch: false,
          dinner: false
        },
        mealPreferences: {
          breakfast: '',
          lunch: '',
          dinner: ''
        }
      }]
    }));
  };

  // Remove a guest
  const removeGuest = (index) => {
    if (formData.guests.length > 1) {
      setFormData(prev => ({
        ...prev,
        guests: prev.guests.filter((_, i) => i !== index)
      }));
    }
  };

  // Update guest information
  const handleGuestChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === index ? { ...guest, [field]: value } : guest
      )
    }));
  };

  // Update guest meal plan (checkbox)
  const handleMealPlanChange = (guestIndex, meal) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === guestIndex ? {
          ...guest,
          mealPlans: {
            ...guest.mealPlans,
            [meal]: !guest.mealPlans[meal]
          }
        } : guest
      )
    }));
  };

  // Update guest meal preference (dropdown)
  const handleMealPreferenceChange = (guestIndex, meal, preference) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === guestIndex ? {
          ...guest,
          mealPreferences: {
            ...guest.mealPreferences,
            [meal]: preference
          }
        } : guest
      )
    }));
  };

  // Toggle room selection
  const toggleRoomSelection = (room) => {
    setFormData(prev => {
      const isSelected = prev.selectedRooms.some(r => r._id === room._id);
      
      if (isSelected) {
        // Remove room and clear any guest assignments to this room
        return {
          ...prev,
          selectedRooms: prev.selectedRooms.filter(r => r._id !== room._id),
          guests: prev.guests.map(guest => 
            guest.roomId === room._id ? { ...guest, roomId: '' } : guest
          )
        };
      } else {
        // Add room
        return {
          ...prev,
          selectedRooms: [...prev.selectedRooms, room]
        };
      }
    });
  };

  // Assign a room to a guest
  const assignRoomToGuest = (guestIndex, roomId) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === guestIndex ? { ...guest, roomId } : guest
      )
    }));
  };

  // Calculate total price
  const calculateTotal = () => {
    const days = calculateDays();
    
    // Room costs
    const roomTotal = formData.selectedRooms.reduce((sum, room) => 
      sum + (room.pricePerNight * days), 0);
    
    // Meal costs
    let mealTotal = 0;
    formData.guests.forEach(guest => {
      const mealCount = Object.values(guest.mealPlans).filter(Boolean).length;
      mealTotal += mealCount * MEAL_PRICE * days;
    });
    
    return {
      roomTotal,
      mealTotal,
      total: roomTotal + mealTotal,
      days
    };
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that all guests have rooms assigned
    const unassignedGuests = formData.guests.filter(guest => !guest.roomId);
    if (unassignedGuests.length > 0) {
      setError(`${unassignedGuests.length} guest(s) don't have rooms assigned`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to complete your booking');
      }

      const bookingData = {
        rooms: formData.selectedRooms.map(room => room._id),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        numberOfGuests: formData.totalGuests,
        guests: formData.guests.map(guest => ({
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          specialRequests: guest.specialRequests,
          roomId: guest.roomId,
          mealPlans: guest.mealPlans,
          mealPreferences: guest.mealPreferences
        })),
        totalPrice: calculateTotal().total
      };

      const response = await fetch(`${BACKEND_URL}/api/rooms/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create booking');
      }

      const booking = await response.json();
      
      // Redirect to confirmation page
      navigate('/room-booking-confirmation', { 
        state: { 
          booking,
          total: calculateTotal().total
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to complete booking');
    } finally {
      setLoading(false);
    }
  };

  // Render different steps of the form
  const renderStepContent = () => {
    switch (step) {
      case 1: // Dates and Basic Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
              <div className="flex items-center mt-1">
                <input
                  type="number"
                  name="totalGuests"
                  value={formData.totalGuests}
                  readOnly
                  className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button 
                  type="button"
                  onClick={addGuest}
                  className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Guest
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                You'll provide details for each guest in a later step
              </p>
            </div>


            <h2 className="text-xl font-semibold">Select Dates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Room Selection
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Select Rooms</h2>
            <p className="text-gray-600">
              Stay duration: <span className="font-medium">{calculateDays()} night{calculateDays() !== 1 ? 's' : ''}</span>
            </p>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : availableRooms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No rooms available for selected dates</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRooms.map(room => (
                    <div 
                      key={room._id}
                      className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow
                        ${formData.selectedRooms.some(r => r._id === room._id) ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      {room.images && room.images[0] && (
                        <img 
                          src={room.images[0].url} 
                          alt={room.images[0].caption || `Room ${room.roomNumber}`}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{room.type} Room {room.roomNumber}</h3>
                            <p className="text-sm text-gray-600">Floor {room.floor}</p>
                          </div>
                          <p className="font-bold text-blue-600">${room.pricePerNight}/night</p>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</p>
                          <p>{room.squareFootage} sq ft • {room.view} view</p>
                          <p className="mt-1">
                            {room.beds.map(bed => `${bed.count} ${bed.type}`).join(', ')}
                          </p>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-1">
                          {room.amenities.tv.available && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              TV
                            </span>
                          )}
                          {room.amenities.wifi && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              WiFi
                            </span>
                          )}
                          {room.bathroom.hasBathtub && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              Bathtub
                            </span>
                          )}
                          {room.amenities.balcony && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              Balcony
                            </span>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => toggleRoomSelection(room)}
                          className={`mt-4 w-full py-2 px-4 rounded-md ${
                            formData.selectedRooms.some(r => r._id === room._id)
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {formData.selectedRooms.some(r => r._id === room._id)
                            ? 'Remove Room'
                            : 'Select Room'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800">Selected Rooms: {formData.selectedRooms.length}</h3>
                  {formData.selectedRooms.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {formData.selectedRooms.map(room => (
                        <li key={room._id} className="text-sm">
                          {room.type} Room {room.roomNumber} - ${room.pricePerNight}/night
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-blue-600">
                      Please select at least one room to continue
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        );

      case 3: // Guest Information and Room Assignment
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Guest Information</h2>
            
            {formData.guests.map((guest, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {index === 0 ? 'Primary Guest' : `Guest ${index + 1}`}
                  </h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeGuest(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => handleGuestChange(index, 'email', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => handleGuestChange(index, 'phone', e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assign Room</label>
                    <select
                      value={guest.roomId}
                      onChange={(e) => assignRoomToGuest(index, e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a room</option>
                      {formData.selectedRooms.map(room => (
                        <option 
                          key={room._id} 
                          value={room._id}
                          // disabled={formData.guests.some(g => g.roomId === room._id && g !== guest)}
                        >
                          {room.type} Room {room.roomNumber}
                          {formData.guests.some(g => g.roomId === room._id && g !== guest) ? ' (Assigned)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                    <textarea
                      value={guest.specialRequests}
                      onChange={(e) => handleGuestChange(index, 'specialRequests', e.target.value)}
                      rows="2"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addGuest}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another Guest
              </button>
            </div>
          </div>
        );

      case 4: // Meal Plans
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Meal Plans</h2>
            <p className="text-gray-600">
              Each meal costs ${MEAL_PRICE} per person per day
            </p>
            
            {formData.guests.map((guest, guestIndex) => (
              <div key={guestIndex} className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium">
                  Meal Plans for <span className='font-bold'>{guest.name || `Guest ${guestIndex + 1}`}</span>
                </h3>
                
                <div className="space-y-4">
                  {['breakfast', 'lunch', 'dinner'].map(meal => (
                    <div key={meal} className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${guestIndex}-${meal}`}
                          checked={guest.mealPlans[meal]}
                          onChange={() => handleMealPlanChange(guestIndex, meal)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${guestIndex}-${meal}`} className="ml-2 block text-sm font-medium text-gray-700">
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </label>
                      </div>
                      
                      {guest.mealPlans[meal] && (
                        <div className="ml-6">
                          <label className="block text-sm font-medium text-gray-700">
                            Dietary Preference
                          </label>
                          <select
                            value={guest.mealPreferences[meal]}
                            onChange={(e) => handleMealPreferenceChange(guestIndex, meal, e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required={guest.mealPlans[meal]}
                          >
                            <option value="">Select preference</option>
                            {MEAL_OPTIONS.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 5: // Review and Payment
        const totals = calculateTotal();
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Payment</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Stay Details</h3>
                <p>Check-in: {new Date(formData.checkIn).toLocaleDateString()}</p>
                <p>Check-out: {new Date(formData.checkOut).toLocaleDateString()}</p>
                <p>Duration: {totals.days} night{totals.days !== 1 ? 's' : ''}</p>
                <p>Total Guests: {formData.totalGuests}</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Room Charges</h3>
                {formData.selectedRooms.map(room => {
                  const assignedGuest = formData.guests.find(g => g.roomId === room._id);
                  return (
                    <div key={room._id} className="flex justify-between text-sm mb-2">
                      <span>
                        {room.type} Room {room.roomNumber}
                        {assignedGuest && ` (${assignedGuest.name})`}
                      </span>
                      <span>${room.pricePerNight} × {totals.days} = ${room.pricePerNight * totals.days}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-medium mt-2">
                  <span>Subtotal (Rooms)</span>
                  <span>${totals.roomTotal}</span>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Meal Plan Charges</h3>
                {formData.guests.map((guest, index) => {
                  const mealCount = Object.values(guest.mealPlans).filter(Boolean).length;
                  if (mealCount === 0) return null;
                  
                  return (
                    <div key={index} className="mb-3">
                      <p className="text-sm font-medium">{guest.name || `Guest ${index + 1}`}</p>
                      {Object.entries(guest.mealPlans).map(([meal, selected]) => 
                        selected && (
                          <div key={meal} className="flex justify-between text-sm ml-4">
                            <span>
                              {meal.charAt(0).toUpperCase() + meal.slice(1)}
                              {guest.mealPreferences[meal] && ` (${guest.mealPreferences[meal]})`}
                            </span>
                            <span>${MEAL_PRICE} × {totals.days} = ${MEAL_PRICE * totals.days}</span>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-between font-medium mt-2">
                  <span>Subtotal (Meals)</span>
                  <span>${totals.mealTotal}</span>
                </div>
              </div>
              
              <div className="text-lg font-bold flex justify-between pt-2">
                <span>Total</span>
                <span>${totals.total}</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment form would go here */}
            {/* <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Payment Information</h3>
              <p className="text-gray-600 mb-4">
                Your card will be charged ${totals.total} upon confirmation
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiration</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name on Card</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Billing Zip Code</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div> */}
          </div>
        );

      default:
        return null;
    }
  };

  // Validate if user can proceed to next step
  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.checkIn && formData.checkOut;
      case 2:
        return formData.selectedRooms.length > 0;
      case 3:
        return formData.guests.every(guest => 
          guest.name && guest.email && guest.phone && guest.roomId
        );
      case 4:
        return formData.guests.every(guest => 
          Object.entries(guest.mealPlans).every(([meal, selected]) => 
            !selected || guest.mealPreferences[meal]
          )
        );
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= stepNumber ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                {stepNumber}
              </div>
              <span className="ml-2 text-sm hidden md:inline">
                {stepNumber === 1 ? 'Dates' :
                 stepNumber === 2 ? 'Rooms' :
                 stepNumber === 3 ? 'Guests' :
                 stepNumber === 4 ? 'Meals' : 'Review'}
              </span>
              {stepNumber < 5 && <div className="w-12 h-0.5 mx-4 bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        {renderStepContent()}
        
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
          )}
          
          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Complete Booking
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RoomBookingForm;


// import React, { useState, useEffect } from 'react';
// import { Users, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { BACKEND_URL } from '../constants';

// const ROOM_TYPES = [
//   { id: 'single', label: 'Single Room', capacity: 1, description: 'Perfect for solo travelers' },
//   { id: 'double', label: 'Double Room', capacity: 2, description: 'Ideal for couples' },
//   { id: 'family', label: 'Family Room', capacity: 4, description: 'Spacious room for families' },
//   { id: 'suite', label: 'Suite', capacity: 2, description: 'Luxury suite with separate living area' },
//   { id: 'deluxe', label: 'Deluxe Room', capacity: 2, description: 'Premium room with extra amenities' }
// ];

// const MEAL_PRICE = 25;

// const RoomBookingForm = () => {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Step 1: Basic Requirements
//     numberOfGuests: 1,
//     checkIn: '',
//     checkOut: '',
//     roomType: '',
    
//     // Step 2: Room Selection
//     selectedRooms: [],
    
//     // Step 3: Meal Plans
//     mealPlans: {
//       breakfast: false,
//       lunch: false,
//       dinner: false
//     },
    
//     // Step 4: Guest Information
//     guests: [{
//       name: '',
//       email: '',
//       phone: '',
//       specialRequests: ''
//     }]
//   });
  
//   const [availableRooms, setAvailableRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Check room availability when basic requirements change
//   useEffect(() => {
//     if (formData.checkIn && formData.checkOut && formData.roomType) {
//       checkAvailability();
//     }
//   }, [formData.checkIn, formData.checkOut, formData.roomType]);

//   const checkAvailability = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/rooms?${new URLSearchParams({
//         checkIn: formData.checkIn,
//         checkOut: formData.checkOut,
//         type: formData.roomType,
//         capacity: formData.numberOfGuests.toString()
//       })}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch available rooms');
//       }
      
//       const rooms = await response.json();
//       setAvailableRooms(rooms);
      
//       if (rooms.length === 0) {
//         setError('No rooms available for selected dates and preferences');
//       }
//     } catch (err) {
//       setError(err.message || 'Failed to check room availability');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleMealPlanChange = (meal) => {
//     setFormData(prev => ({
//       ...prev,
//       mealPlans: {
//         ...prev.mealPlans,
//         [meal]: !prev.mealPlans[meal]
//       }
//     }));
//   };

//   const handleGuestInfoChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       guests: prev.guests.map((guest, i) => 
//         i === index ? { ...guest, [field]: value } : guest
//       )
//     }));
//   };

//   const calculateTotal = () => {
//     const roomTotal = formData.selectedRooms.reduce((sum, room) => 
//       sum + room.pricePerNight, 0);
    
//     const numberOfDays = Math.ceil(
//       (new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)
//     );
    
//     const mealTotal = Object.values(formData.mealPlans).filter(Boolean).length 
//       * MEAL_PRICE 
//       * formData.numberOfGuests 
//       * numberOfDays;
    
//     return {
//       roomTotal: roomTotal * numberOfDays,
//       mealTotal,
//       total: (roomTotal * numberOfDays) + mealTotal
//     };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Please log in to complete your booking');
//       }

//       const bookingData = {
//         rooms: formData.selectedRooms.map(room => room._id),
//         checkIn: formData.checkIn,
//         checkOut: formData.checkOut,
//         numberOfGuests: formData.numberOfGuests,
//         mealPlans: formData.mealPlans,
//         guests: formData.guests,
//         totalPrice: calculateTotal().total
//       };

//       const response = await fetch(`${BACKEND_URL}/api/rooms/book`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(bookingData)
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Failed to create booking');
//       }

//       const booking = await response.json();
      
//       // Redirect to confirmation page
//       // navigate('/booking/confirmation', { 
//       //   state: { 
//       //     booking,
//       //     total: calculateTotal().total
//       //   }
//       // });
//     } catch (err) {
//       setError(err.message || 'Failed to complete booking');
//       setStep(1); // Return to first step if rooms are no longer available
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStepContent = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold">Basic Requirements</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
//                 <input
//                   type="date"
//                   name="checkIn"
//                   value={formData.checkIn}
//                   onChange={handleInputChange}
//                   min={new Date().toISOString().split('T')[0]}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
//                 <input
//                   type="date"
//                   name="checkOut"
//                   value={formData.checkOut}
//                   onChange={handleInputChange}
//                   min={formData.checkIn}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
//               <input
//                 type="number"
//                 name="numberOfGuests"
//                 value={formData.numberOfGuests}
//                 onChange={handleInputChange}
//                 min="1"
//                 max="6"
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {ROOM_TYPES.map(type => (
//                   <label
//                     key={type.id}
//                     className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none
//                       ${formData.roomType === type.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
//                   >
//                     <input
//                       type="radio"
//                       name="roomType"
//                       value={type.id}
//                       checked={formData.roomType === type.id}
//                       onChange={handleInputChange}
//                       className="sr-only"
//                     />
//                     <div className="flex flex-col">
//                       <span className="block text-sm font-medium text-gray-900">
//                         {type.label}
//                       </span>
//                       <span className="mt-1 flex items-center text-sm text-gray-500">
//                         {type.description}
//                       </span>
//                       <span className="mt-1 flex items-center text-sm text-gray-500">
//                         <Users className="w-4 h-4 mr-1" />
//                         Up to {type.capacity} guests
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold">Available Rooms</h2>
            
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               </div>
//             ) : error ? (
//               <div className="text-red-600 text-center py-4">{error}</div>
//             ) : (
//               <div className="grid grid-cols-1 gap-4">
//                 {availableRooms.map(room => (
//                   <label
//                     key={room._id}
//                     className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none
//                       ${formData.selectedRooms.includes(room) ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={formData.selectedRooms.includes(room)}
//                       onChange={() => {
//                         setFormData(prev => ({
//                           ...prev,
//                           selectedRooms: prev.selectedRooms.includes(room)
//                             ? prev.selectedRooms.filter(r => r._id !== room._id)
//                             : [...prev.selectedRooms, room]
//                         }));
//                       }}
//                       className="sr-only"
//                     />
//                     <div className="flex flex-col">
//                       <span className="block text-sm font-medium text-gray-900">
//                         Room {room.roomNumber}
//                       </span>
//                       <span className="mt-1 text-sm text-gray-500">
//                         ${room.pricePerNight} per night
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold">Meal Plans</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {['breakfast', 'lunch', 'dinner'].map(meal => (
//                 <label
//                   key={meal}
//                   className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none
//                     ${formData.mealPlans[meal] ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={formData.mealPlans[meal]}
//                     onChange={() => handleMealPlanChange(meal)}
//                     className="sr-only"
//                   />
//                   <div className="flex flex-col">
//                     <span className="block text-sm font-medium text-gray-900">
//                       {meal.charAt(0).toUpperCase() + meal.slice(1)}
//                     </span>
//                     <span className="mt-1 text-sm text-gray-500">
//                       ${MEAL_PRICE} per person
//                     </span>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold">Guest Information</h2>
            
//             {formData.guests.map((guest, index) => (
//               <div key={index} className="border rounded-lg p-4 space-y-4">
//                 <h3 className="font-medium">
//                   {index === 0 ? 'Primary Guest' : `Guest ${index + 1}`}
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Name</label>
//                     <input
//                       type="text"
//                       value={guest.name}
//                       onChange={(e) => handleGuestInfoChange(index, 'name', e.target.value)}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Email</label>
//                     <input
//                       type="email"
//                       value={guest.email}
//                       onChange={(e) => handleGuestInfoChange(index, 'email', e.target.value)}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Phone</label>
//                     <input
//                       type="tel"
//                       value={guest.phone}
//                       onChange={(e) => handleGuestInfoChange(index, 'phone', e.target.value)}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Special Requests</label>
//                     <textarea
//                       value={guest.specialRequests}
//                       onChange={(e) => handleGuestInfoChange(index, 'specialRequests', e.target.value)}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                       rows="2"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         );

//       case 5:
//         const totals = calculateTotal();
//         return (
//           <div className="space-y-6">
//             <h2 className="text-xl font-semibold">Review & Payment</h2>
            
//             <div className="bg-gray-50 rounded-lg p-6 space-y-4">
//               <div className="border-b pb-4">
//                 <h3 className="font-medium mb-2">Room Charges</h3>
//                 {formData.selectedRooms.map(room => (
//                   <div key={room._id} className="flex justify-between text-sm">
//                     <span>Room {room.roomNumber}</span>
//                     <span>${room.pricePerNight} per night</span>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="border-b pb-4">
//                 <h3 className="font-medium mb-2">Meal Plan Charges</h3>
//                 {Object.entries(formData.mealPlans).map(([meal, selected]) => 
//                   selected && (
//                     <div key={meal} className="flex justify-between text-sm">
//                       <span>{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
//                       <span>${MEAL_PRICE} per person per day</span>
//                     </div>
//                   )
//                 )}
//               </div>
              
//               <div className="text-lg font-bold flex justify-between">
//                 <span>Total</span>
//                 <span>${totals.total}</span>
//               </div>
//             </div>
            
//             {/* Payment form would go here */}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="mb-8">
//         <div className="flex justify-between items-center">
//           {[1, 2, 3, 4, 5].map((stepNumber) => (
//             <div
//               key={stepNumber}
//               className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}
//             >
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
//                 ${step >= stepNumber ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
//                 {stepNumber}
//               </div>
//               <span className="ml-2 text-sm hidden md:inline">
//                 {stepNumber === 1 ? 'Requirements' :
//                  stepNumber === 2 ? 'Rooms' :
//                  stepNumber === 3 ? 'Meals' :
//                  stepNumber === 4 ? 'Guests' : 'Review'}
//               </span>
//               {stepNumber < 5 && <div className="w-12 h-0.5 mx-4 bg-gray-300" />}
//             </div>
//           ))}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
//         {renderStepContent()}
        
//         <div className="mt-8 flex justify-between">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={() => setStep(step - 1)}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//             >
//               <ChevronLeft className="w-5 h-5 mr-2" />
//               Previous
//             </button>
//           )}
          
//           {step < 5 ? (
//             <button
//               type="button"
//               onClick={() => setStep(step + 1)}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//             >
//               Next
//               <ChevronRight className="w-5 h-5 ml-2" />
//             </button>
//           ) : (
//             <button
//               type="submit"
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
//             >
//               <CreditCard className="w-5 h-5 mr-2" />
//               Complete Booking
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RoomBookingForm;