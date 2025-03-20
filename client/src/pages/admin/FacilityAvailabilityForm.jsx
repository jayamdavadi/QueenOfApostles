import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft, Check, X } from 'lucide-react';
import { BACKEND_URL } from '../../constants';

const FacilityAvailabilityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('available');

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week of first day in month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Parse date string to Date object
  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Get status for a specific date
  const getDateStatus = (dateString) => {
    if (!facility || !facility.availability) return 'available';

    const dateEntry = facility.availability.find(item => item.date === dateString);
    return dateEntry ? dateEntry.status : 'available';
  };

  // Check if a date is selected
  const isDateSelected = (dateString) => {
    return selectedDates.includes(dateString);
  };

  // Fetch facility data
  useEffect(() => {
    fetchFacility();
  }, [id]);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/facilities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch facility');
      }

      const data = await response.json();
      setFacility(data);
    } catch (err) {
      setError(err.message || 'Error fetching facility');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(prev => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prev.getMonth() - 1);
      return prevMonth;
    });
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prev => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(prev.getMonth() + 1);
      return nextMonth;
    });
  };

  // Toggle date selection
  const toggleDateSelection = (dateString) => {
    setSelectedDates(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(date => date !== dateString);
      } else {
        return [...prev, dateString];
      }
    });
  };

  // Handle single date status change
  const handleStatusChange = async (dateString, status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Find if this date already exists in availability
      const existingAvailability = facility.availability || [];
      const updatedAvailability = [...existingAvailability];

      const existingIndex = updatedAvailability.findIndex(item => item.date === dateString);

      if (existingIndex >= 0) {
        // Update existing date
        updatedAvailability[existingIndex].status = status;
      } else {
        // Add new date
        updatedAvailability.push({ date: dateString, status });
      }

      const response = await fetch(`${BACKEND_URL}/api/facilities/${id}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ availability: updatedAvailability })
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      const result = await response.json();
      setFacility(result.facility);
      setSuccess(`Updated availability for ${dateString}`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error updating availability');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk update
  const handleBulkUpdate = async () => {
    if (selectedDates.length === 0) {
      setError('No dates selected');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/facilities/${id}/availability/bulk`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          dates: selectedDates,
          status: bulkStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      const result = await response.json();
      setFacility(result.facility);
      setSuccess(`Updated ${selectedDates.length} dates to ${bulkStatus}`);
      setSelectedDates([]);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error updating availability');
    } finally {
      setLoading(false);
    }
  };

  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate days
    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-14 border border-gray-200"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = formatDate(date);
      const status = getDateStatus(dateString);
      const selected = isDateSelected(dateString);

      days.push(
        <div
          key={day}
          className={`h-14 border border-gray-200 p-1 relative cursor-pointer ${selected ? 'ring-2 ring-blue-500' : ''
            }`}
          onClick={() => toggleDateSelection(dateString)}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">{day}</span>
            <div
              className={`w-3 h-3 rounded-full ${status === 'available' ? 'bg-green-500' :
                  status === 'booked' ? 'bg-red-500' :
                    'bg-yellow-500' // maintenance
                }`}
            ></div>
          </div>

          <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(dateString, 'available');
              }}
              className={`text-xs p-1 ${status === 'available' ? 'text-green-700 bg-green-100' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Mark as Available"
            >
              <Check className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange(dateString, 'booked');
              }}
              className={`text-xs p-1 ${status === 'booked' ? 'text-red-700 bg-red-100' : 'text-gray-600 hover:bg-gray-100'}`}
              title="Mark as Booked"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold">
            {monthNames[month]} {year}
          </h2>

          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  if (loading && !facility) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center">Loading facility data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2" />
            Manage Availability
          </h1>

          <button
            type="button"
            onClick={() => navigate(`/admin/facilities/edit/${id}`)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Facility
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            {success}
          </div>
        )}

        {facility && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{facility.name}</h2>
              <p className="text-gray-600">{facility.description}</p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-blue-800 font-medium">Bulk Update</h3>
                  <p className="text-sm text-blue-600">
                    Selected: {selectedDates.length} {selectedDates.length === 1 ? 'date' : 'dates'}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="p-2 border rounded-md"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleBulkUpdate}
                    disabled={selectedDates.length === 0 || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    Update Selected
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>

                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Booked</span>
                </div>

                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Maintenance</span>
                </div>
              </div>
            </div>

            {renderCalendar()}
          </>
        )}
      </div>
    </div>
  );
};

export default FacilityAvailabilityForm;