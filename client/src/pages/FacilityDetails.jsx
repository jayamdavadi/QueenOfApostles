import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle,
  MapPin,
  DollarSign
} from 'lucide-react';
import { BACKEND_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';

export const FacilityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/facilities/${id}`);
        if (!response.ok) {
          throw new Error('Facility not found');
        }
        const data = await response.json();
        setFacility(data);
      } catch (err) {
        console.error('Error fetching facility:', err);
      }
    };

    if (id) {
      fetchFacility();
    }
  }, [id]);

  if (!facility) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Facility not found</h2>
          <p className="mt-2 text-gray-600">The facility you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/facilities')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Facilities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${facility.mainImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{facility.name}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">{facility.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Facility Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Facility */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">About the Facility</h2>
              <p className="text-gray-600 whitespace-pre-line">{facility.longDescription}</p>
            </section>

            {/* Features */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facility.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {facility.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="relative h-32 overflow-hidden rounded-lg hover:opacity-90 transition"
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* Availability Calendar */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Availability</h2>
              <div className="space-y-2">
                {facility.availability.map((day, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-md ${day.status === 'available'
                      ? 'bg-green-50 text-green-700'
                      : day.status === 'booked'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                      }`}
                  >
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                    <span className="capitalize">{day.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${facility.pricePerDay}</span>
                  <span className="text-gray-500">per day</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Capacity: {facility.capacity} people</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{facility.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{facility.size}</span>
                  </div>
                </div>

                {/* Room booking button */}
                <button
                  onClick={() => navigate(!user ? '/login' : `/room-booking`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Book Now</span>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Contact us for special arrangements or group bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Gallery preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};