import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CheckCircle, Calendar, Users, Home, Coffee } from 'lucide-react';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const { booking, total } = location.state || {};

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Booking Information Not Found</h1>
            <p className="mt-2 text-gray-600">Please return to the booking page to complete your reservation.</p>
            <Link
              to="/programs"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-50 p-6 border-b border-green-100">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
            </div>
            <p className="mt-2 text-gray-600">
              Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Stay Dates</h3>
                  <p className="text-sm text-gray-600">
                    Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Guests</h3>
                  <p className="text-sm text-gray-600">
                    {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'guest' : 'guests'}
                  </p>
                  <ul className="mt-1 text-sm text-gray-600">
                    {booking.guests.map((guest, index) => (
                      <li key={index}>
                        {guest.name} ({guest.email})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <Home className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Rooms</h3>
                  <ul className="mt-1 text-sm text-gray-600">
                    {booking.rooms.map((room, index) => (
                      <li key={index}>
                        Room {room.roomNumber || index + 1}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>${total || booking.totalPrice}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Payment has been processed successfully
              </p>
            </div>

            <div className="mt-8">
              <Link
                to="/my-bookings"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;