import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, Users, DollarSign, Utensils, ArrowLeft, Printer } from 'lucide-react';
import { BACKEND_URL } from '../constants';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`);
        if (!response.ok) throw new Error('Booking not found');
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Booking Not Found</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => navigate('/programs')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Programs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-600">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-2">Booking Reference: #{booking.bookingId}</p>
        </div>

        {/* Program Summary */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-2xl font-bold mb-4">{booking.programId.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              <span>{booking.programId.startDate}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              <span>{booking.guests.length} guests</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              <span>${booking.totalPrice}</span>
            </div>
            <div className="flex items-center">
              <Utensils className="w-5 h-5 mr-2 text-blue-600" />
              <span>Meals included</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Booking Details</h3>
          <div className="space-y-6">
            {booking.guests.map((guest, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Guest {index + 1}: {guest.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Email: {guest.email}</p>
                    <p className="text-gray-600">Phone: {guest.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Meal Preferences:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {Object.entries(guest.mealPreferences).map(([meal, preference]) => (
                        <li key={meal}>
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}: {preference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {guest.dietaryRestrictions.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Dietary Restrictions:</p>
                    <div className="flex flex-wrap gap-2">
                      {guest.dietaryRestrictions.map(restriction => (
                        <span 
                          key={restriction}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="mb-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">Important Information</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>A confirmation email has been sent to all registered guests</li>
            <li>Please arrive 15 minutes before the scheduled program time</li>
            <li>Don't forget to bring appropriate clothing and equipment</li>
            <li>For any changes to your booking, please contact us at least 48 hours in advance</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => navigate('/programs')}
            className="flex items-center px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;