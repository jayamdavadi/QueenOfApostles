import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BedDouble, Users, Utensils, Coffee, DollarSign } from 'lucide-react';
import { BACKEND_URL } from '../constants';

const facilityIcons = {
  meditation: Coffee,
  accommodation: BedDouble,
  activity: Users,
  dining: Utensils
};

export const Facilities = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/facilities`);
        if (!response.ok) {
          throw new Error('Failed to fetch facilities');
        }
        const data = await response.json();

        setFacilities(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFacilities();
  }, [])
  


  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || facility.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our world-class facilities designed to enhance your retreat experience.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="meditation">Meditation Rooms</option>
              <option value="accommodation">Accommodation</option>
              <option value="activity">Activity Spaces</option>
              <option value="dining">Dining Areas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFacilities.map((facility) => {
          const IconComponent = facilityIcons[facility.type] || Coffee;
          
          return (
            <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48">
                <img
                  src={facility.mainImage}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{facility.name}</h3>
                <p className="text-gray-600 mb-4">{facility.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Capacity: {facility.capacity} people</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>${facility.pricePerDay} per day</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {facility.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {feature}
                    </span>
                  ))}
                  {facility.features.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{facility.features.length - 3} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/facilities/${facility._id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};