import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../../contexts/AdminContext';
import { BACKEND_URL } from '../../constants';

const FacilityForm = () => {
  const { fetchFacilities, selectedItem, actionType, setActionType } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    pricePerNight: '',
    image: '',
    amenities: {
      hasBathroom: false,
      beds: 0,
      hasShower: false,
      chairs: 0
    }
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (actionType === 'edit' && selectedItem) {
      setFormData({
        name: selectedItem.name,
        type: selectedItem.type,
        description: selectedItem.description,
        pricePerNight: selectedItem.pricePerNight,
        image: selectedItem.image
      });
    }
  }, [selectedItem, actionType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (actionType === 'edit') {
        await axios.put(`${BACKEND_URL}/api/facilities/${selectedItem._id}`, formData);
      } else {
        await axios.post(`${BACKEND_URL}/api/facilities`, formData);
      }
      setActionType('');
      fetchFacilities();
    } catch (err) {
      console.error('Error saving facility:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {actionType === 'edit' ? 'Edit Facility' : 'New Facility'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                required
              >
                <option value="">Select Type</option>
                <option value="hotel">Hotel Room</option>
                <option value="chapel">Chapel</option>
                <option value="conference">Conference Room</option>
                <option value="dining">Dining Area</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price/Night ($)</label>
              <input
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
                rows="3"
              ></textarea>
            </div>

            {/* Amenities Section */}
  <div className="border p-4 rounded">
    <h3 className="font-medium mb-2">Amenities</h3>
    
    {/* Generic Amenities */}
    <label className="flex items-center mb-2">
      <input
        type="checkbox"
        checked={formData.amenities.hasBathroom}
        onChange={(e) => setFormData({
          ...formData,
          amenities: { ...formData.amenities, hasBathroom: e.target.checked }
        })}
        className="mr-2"
      />
      Bathroom
    </label>

    {/* Conditional Fields Based on Facility Type */}
    {formData.type === 'hotel' && (
      <>
        <div className="mb-2">
          <label className="block text-sm">Beds</label>
          <input
            type="number"
            value={formData.amenities.beds || 0}
            onChange={(e) => setFormData({
              ...formData,
              amenities: { ...formData.amenities, beds: e.target.value }
            })}
            className="w-full p-2 border rounded"
          />
        </div>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={formData.amenities.hasShower}
            onChange={(e) => setFormData({
              ...formData,
              amenities: { ...formData.amenities, hasShower: e.target.checked }
            })}
            className="mr-2"
          />
          Shower
        </label>
      </>
    )}

    {formData.type === 'conference' && (
      <div className="mb-2">
        <label className="block text-sm">Chairs</label>
        <input
          type="number"
          value={formData.amenities.chairs || 0}
          onChange={(e) => setFormData({
            ...formData,
            amenities: { ...formData.amenities, chairs: e.target.value }
          })}
          className="w-full p-2 border rounded"
        />
      </div>
    )}
  </div>

          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setActionType('')}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {actionType === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityForm;