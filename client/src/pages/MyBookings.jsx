import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, ChevronDown, ChevronUp, Edit2, X, Check, Home, MapPin, Clock } from 'lucide-react';
import { BACKEND_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const MEAL_PREFERENCES = {
  VEGETARIAN: 'Vegetarian',
  VEGAN: 'Vegan',
  NON_VEGETARIAN: 'Non-Vegetarian',
  GLUTEN_FREE: 'Gluten-Free',
  DAIRY_FREE: 'Dairy-Free'
};

const MEAL_TIMES = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner'
};

const MyBookings = () => {
  const { token } = useAuth();

  const [programBookings, setProgramBookings] = useState([]);
  const [roomBookings, setRoomBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({ status: '', message: '' });
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      // Fetch program bookings
      const programResponse = await fetch(`${BACKEND_URL}/api/bookings/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Fetch room bookings
      const roomResponse = await fetch(`${BACKEND_URL}/api/rooms/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!programResponse.ok) throw new Error('Failed to fetch program bookings');
      if (!roomResponse.ok) throw new Error('Failed to fetch room bookings');
      
      const programData = await programResponse.json();
      const roomData = await roomResponse.json();
      
      setProgramBookings(programData);
      setRoomBookings(roomData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMealPreference = async (bookingId, guestId, updatedPreferences, isRoomBooking = false) => {
    try {
      setUpdateStatus({ status: 'loading', message: 'Updating preferences...' });
      
      const endpoint = isRoomBooking 
        ? `${BACKEND_URL}/api/rooms/bookings/${bookingId}/guest/${guestId}/preferences`
        : `${BACKEND_URL}/api/bookings/${bookingId}/guest/${guestId}/preferences`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mealPreferences: updatedPreferences }),
      });

      if (!response.ok) throw new Error('Failed to update meal preferences');

      // Update local state
      if (isRoomBooking) {
        setRoomBookings(roomBookings.map(booking => {
          if (booking._id === bookingId) {
            return {
              ...booking,
              guests: booking.guests.map(guest => 
                guest._id === guestId ? { ...guest, mealPreferences: updatedPreferences } : guest
              )
            };
          }
          return booking;
        }));
      } else {
        setProgramBookings(programBookings.map(booking => {
          if (booking._id === bookingId) {
            return {
              ...booking,
              guests: booking.guests.map(guest => 
                guest._id === guestId ? { ...guest, mealPreferences: updatedPreferences } : guest
              )
            };
          }
          return booking;
        }));
      }

      setUpdateStatus({ status: 'success', message: 'Preferences updated successfully!' });
      setTimeout(() => setUpdateStatus({ status: '', message: '' }), 3000);
      setEditingGuest(null);
    } catch (err) {
      setUpdateStatus({ status: 'error', message: err.message });
    }
  };

  const EditableGuestMealPreferences = ({ guest, bookingId, isRoomBooking }) => {
    const [preferences, setPreferences] = useState(guest.mealPreferences);

    return (
      <div className="space-y-4 border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Edit Meal Preferences</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingGuest(null)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleUpdateMealPreference(bookingId, guest._id, preferences, isRoomBooking)}
              className="p-1 text-green-600 hover:text-green-700"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {Object.entries(MEAL_TIMES).map(([key, mealTime]) => (
          <div key={key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {mealTime}
            </label>
            <select
              value={preferences[mealTime.toLowerCase()]}
              onChange={(e) => setPreferences({
                ...preferences,
                [mealTime.toLowerCase()]: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-md"
            >
              {Object.values(MEAL_PREFERENCES).map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  // Function to determine if a booking is in the past or future
  const isBookingPast = (checkOutDate) => {
    const now = new Date();
    return new Date(checkOutDate) < now;
  };

  // Function to format date to display in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter bookings based on active tab
  const filteredProgramBookings = programBookings.filter(booking => {
    const isPast = isBookingPast(booking.programId.endDate || booking.programId.startDate);
    return (activeTab === 'past' && isPast) || (activeTab === 'upcoming' && !isPast);
  });

  const filteredRoomBookings = roomBookings.filter(booking => {
    const isPast = isBookingPast(booking.checkOut);
    return (activeTab === 'past' && isPast) || (activeTab === 'upcoming' && !isPast);
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        
        {updateStatus.message && (
          <div className={`mb-4 p-4 rounded-md ${
            updateStatus.status === 'success' ? 'bg-green-50 text-green-700' :
            updateStatus.status === 'error' ? 'bg-red-50 text-red-700' :
            'bg-blue-50 text-blue-700'
          }`}>
            {updateStatus.message}
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'upcoming'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Bookings
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'past'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Bookings
          </button>
        </div>

        {filteredProgramBookings.length === 0 && filteredRoomBookings.length === 0 ? (
          <p className="text-center text-gray-500">No {activeTab} bookings found.</p>
        ) : (
          <div className="space-y-6">
            {/* Program Bookings Section */}
            {filteredProgramBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Program Bookings
                </h2>
                <div className="space-y-4">
                  {filteredProgramBookings.map(booking => (
                    <div key={booking._id} className="border rounded-lg">
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedBooking(expandedBooking === `program-${booking._id}` ? null : `program-${booking._id}`)}
                      >
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">{booking.programId.title}</h2>
                          {expandedBooking === `program-${booking._id}` ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(booking.programId.startDate)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {booking.guests.length} guests
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            ${booking.totalPrice}
                          </div>
                        </div>
                      </div>

                      {expandedBooking === `program-${booking._id}` && (
                        <div className="border-t p-4">
                          <h3 className="font-medium mb-4">Guest Details</h3>
                          {booking.guests.map(guest => (
                            <div key={guest._id} className="mb-4 last:mb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{guest.name}</p>
                                  <p className="text-sm text-gray-600">{guest.email}</p>
                                </div>
                                <button
                                  onClick={() => setEditingGuest(editingGuest === guest._id ? null : guest._id)}
                                  className="p-1 text-blue-600 hover:text-blue-700"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                              </div>

                              {editingGuest === guest._id ? (
                                <EditableGuestMealPreferences guest={guest} bookingId={booking._id} isRoomBooking={false} />
                              ) : (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Meal Preferences:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {Object.entries(guest.mealPreferences).map(([meal, preference]) => (
                                      <li key={meal}>
                                        {meal.charAt(0).toUpperCase() + meal.slice(1)}: {preference}
                                      </li>
                                    ))}
                                  </ul>
                                  {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Dietary Restrictions:</p>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {guest.dietaryRestrictions.map(restriction => (
                                          <span 
                                            key={restriction}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                                          >
                                            {restriction}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Room Bookings Section */}
            {filteredRoomBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Room Bookings
                </h2>
                <div className="space-y-4">
                  {filteredRoomBookings.map(booking => (
                    <div key={booking._id} className="border rounded-lg">
                      <div 
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedBooking(expandedBooking === `room-${booking._id}` ? null : `room-${booking._id}`)}
                      >
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">
                            Room Booking
                            {booking.status && <span className="ml-2 text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{booking.status}</span>}
                          </h2>
                          {expandedBooking === `room-${booking._id}` ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {booking.numberOfGuests} guests
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            ${booking.totalPrice}
                          </div>
                        </div>
                      </div>

                      {expandedBooking === `room-${booking._id}` && (
                        <div className="border-t p-4">
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Booking Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">Check-in:</p>
                                <p className="text-sm text-gray-600">{formatDate(booking.checkIn)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Check-out:</p>
                                <p className="text-sm text-gray-600">{formatDate(booking.checkOut)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Status:</p>
                                <p className="text-sm text-gray-600">{booking.status || 'Confirmed'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Number of Rooms:</p>
                                <p className="text-sm text-gray-600">{booking.rooms.length}</p>
                              </div>
                            </div>
                          </div>

                          <h3 className="font-medium mb-4">Guest Details</h3>
                          {booking.guests.map(guest => (
                            <div key={guest._id} className="mb-4 last:mb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{guest.name}</p>
                                  <p className="text-sm text-gray-600">{guest.email}</p>
                                  {guest.phone && <p className="text-sm text-gray-600">{guest.phone}</p>}
                                </div>
                                <button
                                  onClick={() => setEditingGuest(editingGuest === guest._id ? null : guest._id)}
                                  className="p-1 text-blue-600 hover:text-blue-700"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                              </div>

                              {editingGuest === guest._id ? (
                                <EditableGuestMealPreferences guest={guest} bookingId={booking._id} isRoomBooking={true} />
                              ) : (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Meal Preferences:</p>
                                  <ul className="list-disc list-inside text-sm text-gray-600">
                                    {Object.entries(guest.mealPreferences).map(([meal, preference]) => (
                                      <li key={meal}>
                                        {meal.charAt(0).toUpperCase() + meal.slice(1)}: {preference}
                                      </li>
                                    ))}
                                  </ul>
                                  
                                  {guest.specialRequests && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Special Requests:</p>
                                      <p className="text-sm text-gray-600">{guest.specialRequests}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
