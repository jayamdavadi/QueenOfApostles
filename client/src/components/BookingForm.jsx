import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Utensils, BedDouble, Calendar, DollarSign } from 'lucide-react';
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

const DIETARY_RESTRICTIONS = [
  'Peanut Allergy',
  'Tree Nut Allergy',
  'Shellfish Allergy',
  'Egg Allergy',
  'Soy Allergy',
  'Lactose Intolerant',
  'Celiac Disease',
  'Kosher',
  'Halal'
];

const BookingForm = ({ program }) => {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [step, setStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(program.price);
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState({
    numberOfGuests: 1,
    guests: [{
      name: '',
      email: '',
      phone: '',
      mealPreferences: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      dietaryRestrictions: []
    }]
  });

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      booking.guests.forEach((guest, index) => {
        if (!guest.name.trim()) {
          newErrors[`guest${index}Name`] = 'Name is required';
        }
        if (!guest.email.trim()) {
          newErrors[`guest${index}Email`] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
          newErrors[`guest${index}Email`] = 'Invalid email format';
        }
        if (!guest.phone.trim()) {
          newErrors[`guest${index}Phone`] = 'Phone is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(guest.phone)) {
          newErrors[`guest${index}Phone`] = 'Invalid phone format';
        }
      });
    }

    if (currentStep === 2) {
      booking.guests.forEach((guest, index) => {
        if (!guest.mealPreferences.breakfast) {
          newErrors[`guest${index}Breakfast`] = 'Breakfast preference is required';
        }
        if (!guest.mealPreferences.lunch) {
          newErrors[`guest${index}Lunch`] = 'Lunch preference is required';
        }
        if (!guest.mealPreferences.dinner) {
          newErrors[`guest${index}Dinner`] = 'Dinner preference is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addGuest = () => {
    if (booking.guests.length < 6) {
      setBooking(prev => ({
        ...prev,
        numberOfGuests: prev.numberOfGuests + 1,
        guests: [...prev.guests, {
          name: '',
          email: '',
          phone: '',
          mealPreferences: {
            breakfast: '',
            lunch: '',
            dinner: ''
          },
          dietaryRestrictions: []
        }]
      }));
      updateTotalPrice(booking.numberOfGuests + 1);
    }
  };

  const removeGuest = (index) => {
    if (booking.guests.length > 1) {
      setBooking(prev => ({
        ...prev,
        numberOfGuests: prev.numberOfGuests - 1,
        guests: prev.guests.filter((_, i) => i !== index)
      }));
      updateTotalPrice(booking.numberOfGuests - 1);
    }
  };

  const updateGuestInfo = (index, field, value) => {
    setBooking(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === index ? { ...guest, [field]: value } : guest
      )
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [`guest${index}${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
    }));
  };

  const updateMealPreference = (guestIndex, mealTime, preference) => {
    setBooking(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === guestIndex ? {
          ...guest,
          mealPreferences: {
            ...guest.mealPreferences,
            [mealTime.toLowerCase()]: preference
          }
        } : guest
      )
    }));
    // Clear error when preference is selected
    setErrors(prev => ({
      ...prev,
      [`guest${guestIndex}${mealTime}`]: ''
    }));
  };

  const toggleDietaryRestriction = (guestIndex, restriction) => {
    setBooking(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === guestIndex ? {
          ...guest,
          dietaryRestrictions: guest.dietaryRestrictions.includes(restriction)
            ? guest.dietaryRestrictions.filter(r => r !== restriction)
            : [...guest.dietaryRestrictions, restriction]
        } : guest
      )
    }));
  };

  const updateTotalPrice = (guestCount) => {
    const basePrice = program.price;
    setTotalPrice(basePrice * guestCount);
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) {
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          programId: program._id,
          booking
        }),
      });
      
      if (response.ok) {
        const data = await response.json();

        navigate(`/booking-confirmation/${data.booking._id}`);
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Booking failed. Please try again.' });
      }
    } catch (error) {
      console.error('Booking failed:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Program Summary - unchanged */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-2xl font-bold mb-4">{program.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <span>{program.startDate}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              <span>{program.capacity} spots</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              <span>${program.price}/person</span>
            </div>
            <div className="flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-blue-600" />
              <span>Meals included</span>
            </div>
          </div>
        </div>

        {/* Booking Steps - unchanged */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${step >= stepNumber ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                  {stepNumber}
                </div>
                <span className="ml-2 text-sm">
                  {stepNumber === 1 ? 'Guest Info' : stepNumber === 2 ? 'Meal Preferences' : 'Review'}
                </span>
                {stepNumber < 3 && <div className="w-24 h-0.5 mx-4 bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Guest Information</h3>
                <button
                  type="button"
                  onClick={addGuest}
                  disabled={booking.guests.length >= 6}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Add Guest
                </button>
              </div>

              {booking.guests.map((guest, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Guest {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={guest.name}
                        onChange={(e) => updateGuestInfo(index, 'name', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md ${errors[`guest${index}Name`] ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors[`guest${index}Name`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`guest${index}Name`]}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={guest.email}
                        onChange={(e) => updateGuestInfo(index, 'email', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md ${errors[`guest${index}Email`] ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors[`guest${index}Email`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`guest${index}Email`]}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={guest.phone}
                        onChange={(e) => updateGuestInfo(index, 'phone', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md ${errors[`guest${index}Phone`] ? 'border-red-500' : ''}`}
                        required
                      />
                      {errors[`guest${index}Phone`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`guest${index}Phone`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Dietary Restrictions</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {DIETARY_RESTRICTIONS.map(restriction => (
                        <label key={restriction} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={guest.dietaryRestrictions.includes(restriction)}
                            onChange={() => toggleDietaryRestriction(index, restriction)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{restriction}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Meal Preferences</h3>
              
              {booking.guests.map((guest, guestIndex) => (
                <div key={guestIndex} className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Meal Preferences for {guest.name}</h4>
                  
                  {Object.entries(MEAL_TIMES).map(([key, mealTime]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {mealTime}
                      </label>
                      <select
                        value={guest.mealPreferences[mealTime.toLowerCase()]}
                        onChange={(e) => updateMealPreference(guestIndex, mealTime, e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors[`guest${guestIndex}${mealTime}`] ? 'border-red-500' : ''
                        }`}
                        required
                      >
                        <option value="">Select preference</option>
                        {Object.values(MEAL_PREFERENCES).map(preference => (
                          <option key={preference} value={preference}>
                            {preference}
                          </option>
                        ))}
                      </select>
                      {errors[`guest${guestIndex}${mealTime}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`guest${guestIndex}${mealTime}`]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Selected Dietary Restrictions</h5>
                    {guest.dietaryRestrictions.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {guest.dietaryRestrictions.map(restriction => (
                          <li key={restriction} className="text-sm text-gray-600">
                            {restriction}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No dietary restrictions selected</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Review Booking</h3>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Booking Summary</h4>
                <div className="space-y-4">
                  <p>Total Guests: {booking.numberOfGuests}</p>
                  <p className="text-xl font-bold">Total Price: ${totalPrice}</p>
                  
                  {booking.guests.map((guest, index) => (
                    <div key={index} className="border-t pt-4">
                      <h5 className="font-medium">Guest {index + 1}: {guest.name}</h5>
                      <p>Email: {guest.email}</p>
                      <p>Phone: {guest.phone}</p>
                      <div className="mt-2">
                        <p className="font-medium">Meal Preferences:</p>
                        <ul className="list-disc list-inside">
                          {Object.entries(guest.mealPreferences).map(([meal, preference]) => (
                            <li key={meal}>
                              {meal.charAt(0).toUpperCase() + meal.slice(1)}: {preference}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <p className="font-medium">Dietary Restrictions:</p>
                        {guest.dietaryRestrictions.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {guest.dietaryRestrictions.map(restriction => (
                              <li key={restriction} className="text-sm">
                                {restriction}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">None</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;