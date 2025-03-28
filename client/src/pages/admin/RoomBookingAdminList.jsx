import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Clock, MailOpen, Home, BedDouble, Info } from 'lucide-react';
import { BACKEND_URL } from '../../constants';
import { Link } from 'react-router-dom';

const RoomBookingAdminList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'confirmed', 'cancelled'

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Set the endpoint based on the active tab
      let endpoint = `${BACKEND_URL}/api/admin/room-bookings`;
      if (activeTab !== 'all') {
        endpoint += `?status=${activeTab}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Error fetching room bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/admin/room-bookings/${bookingId}/status`, {
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

      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      setError(err.message || 'Error updating booking status');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

  const getRoomNames = (booking) => {
    if (!booking.rooms || booking.rooms.length === 0) return 'No rooms';
    
    const names = booking.rooms.map(room => 
      `${room.type || 'Room'} ${room.roomNumber || ''}`
    ).join(', ');
    
    if (names.length > 30) {
      return `${names.substring(0, 30)}...`;
    }
    
    return names;
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center">Loading room bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Home className="w-6 h-6 mr-2" />
            Room & Facility Bookings Management
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('all')}
            >
              All Bookings
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'confirmed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'cancelled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No room bookings found in this category</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rooms
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In/Out
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.userId?.name || 'User'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MailOpen className="h-3 w-3 mr-1" />
                            {booking.userId?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <BedDouble className="w-4 h-4 mr-1 text-gray-500" />
                        {getRoomNames(booking)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.rooms?.length || 0} room(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <div>
                          <div>{formatDate(booking.checkIn)}</div>
                          <div>to {formatDate(booking.checkOut)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-1 text-gray-500" />
                        {booking.numberOfGuests}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.guests?.length ? booking.guests[0].name : 'No guest info'}
                        {booking.guests?.length > 1 ? ` + ${booking.guests.length - 1} more` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                        ${booking.totalPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/room-bookings/${booking._id}`}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 flex items-center"
                          title="View Details"
                        >
                          <Info className="w-4 h-4 mr-1" />
                          Details
                        </Link>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                              title="Confirm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded bg-green-50 hover:bg-green-100"
                            title="Reactivate"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomBookingAdminList; 