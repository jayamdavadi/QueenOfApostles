import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, BedDouble, Calendar, Users, Clock, DollarSign, ArrowLeft, CheckCircle, XCircle, AlertCircle, Mail, Phone, User } from 'lucide-react';
import { BACKEND_URL } from '../../constants';

const RoomBookingDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${BACKEND_URL}/api/admin/room-bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room booking details');
      }

      const data = await response.json();
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Error fetching room booking details');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (newStatus) => {
    try {
      setProcessingAction(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/admin/room-bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();
      setBooking(updatedBooking);
    } catch (err) {
      setError(err.message || 'Error updating booking status');
    } finally {
      setProcessingAction(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
          <button 
            onClick={() => navigate('/admin/room-bookings')}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Room Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-700">Room booking not found</p>
          <button 
            onClick={() => navigate('/admin/room-bookings')}
            className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Room Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <button 
            onClick={() => navigate('/admin/room-bookings')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Room Bookings
          </button>
          <div className="flex items-center">
            <span className={`px-3 py-1 inline-flex items-center rounded-full ${getStatusBadgeClass(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="ml-1 font-medium">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </span>
          </div>
        </div>

        <div className="border-b pb-6 mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Home className="w-6 h-6 mr-2 text-blue-600" />
            Room Booking #{booking._id}
          </h1>
          <p className="text-gray-600 mt-2">Created on {formatDate(booking.createdAt)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Stay Details</h2>
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Check-in:</span> <span className="ml-1">{formatDate(booking.checkIn)}</span>
              </p>
              <p className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Check-out:</span> <span className="ml-1">{formatDate(booking.checkOut)}</span>
              </p>
              <p className="flex items-center text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Duration:</span> <span className="ml-1">
                  {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                </span>
              </p>
              <p className="flex items-center text-gray-700">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Guests:</span> <span className="ml-1">{booking.numberOfGuests}</span>
              </p>
              <p className="flex items-center text-gray-700">
                <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">Total Price:</span> <span className="ml-1">${booking.totalPrice}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
            <div className="space-y-2">
              <p className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                {booking.userId?.name || 'Unknown User'}
              </p>
              <p className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                {booking.userId?.email || 'No email'}
              </p>
              {booking.userId?.phone && (
                <p className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {booking.userId.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Booked Rooms</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Night
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {booking.rooms && booking.rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.roomNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.floor || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.capacity || 'N/A'} {room.capacity === 1 ? 'person' : 'people'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${room.pricePerNight || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Guest Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal Plans
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {booking.guests && booking.guests.map((guest, index) => {
                  const assignedRoom = booking.rooms?.find(room => room._id === guest.roomId);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {guest.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {guest.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignedRoom ? `${assignedRoom.type} ${assignedRoom.roomNumber}` : 'Not assigned'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {guest.mealPlans && (
                          <div>
                            {guest.mealPlans.breakfast && (
                              <div className="flex items-center">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                <span>Breakfast: {guest.mealPreferences?.breakfast || 'No preference'}</span>
                              </div>
                            )}
                            {guest.mealPlans.lunch && (
                              <div className="flex items-center">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                <span>Lunch: {guest.mealPreferences?.lunch || 'No preference'}</span>
                              </div>
                            )}
                            {guest.mealPlans.dinner && (
                              <div className="flex items-center">
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                <span>Dinner: {guest.mealPreferences?.dinner || 'No preference'}</span>
                              </div>
                            )}
                            {!guest.mealPlans.breakfast && !guest.mealPlans.lunch && !guest.mealPlans.dinner && (
                              <span>No meal plans</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t pt-6 flex justify-end space-x-4">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => updateBookingStatus('confirmed')}
                disabled={processingAction}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center"
              >
                {processingAction ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Confirm Booking
              </button>
              <button
                onClick={() => updateBookingStatus('cancelled')}
                disabled={processingAction}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
              >
                {processingAction ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Cancel Booking
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => updateBookingStatus('cancelled')}
              disabled={processingAction}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
            >
              {processingAction ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Cancel Booking
            </button>
          )}
          {booking.status === 'cancelled' && (
            <button
              onClick={() => updateBookingStatus('confirmed')}
              disabled={processingAction}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center"
            >
              {processingAction ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Reactivate Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomBookingDetailView; 