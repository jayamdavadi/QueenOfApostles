import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Save, Trash2, Plus, X, Clock, MapPin } from 'lucide-react';
import { BACKEND_URL } from '../../constants';

const ProgramAdminForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    startDate: '',
    endDate: '',
    price: '',
    capacity: '',
    location: '',
    schedule: [],
    features: [],
    image: '',
    gallery: []
  });

  const [newScheduleItem, setNewScheduleItem] = useState({ time: '', activity: '' });
  const [feature, setFeature] = useState('');
  const [galleryImage, setGalleryImage] = useState('');

  // Fetch program data if editing
  useEffect(() => {
    if (isEditing) {
      fetchProgram();
    }
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/programs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch program');
      }

      const program = await response.json();

      // Format dates for the form
      program.startDate = program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : '';
      program.endDate = program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : '';

      setFormData(program);
    } catch (err) {
      setError(err.message || 'Error fetching program');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setNewScheduleItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addScheduleItem = () => {
    if (newScheduleItem.time && newScheduleItem.activity) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, { ...newScheduleItem }]
      }));
      setNewScheduleItem({ time: '', activity: '' });
    }
  };

  const removeScheduleItem = (index) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = () => {
    if (galleryImage.trim() && !formData.gallery.includes(galleryImage.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, galleryImage.trim()]
      }));
      setGalleryImage('');
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      const url = isEditing
        ? `${BACKEND_URL}/api/programs/${id}`
        : `${BACKEND_URL}/api/programs`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save program');
      }

      const result = await response.json();

      setSuccess(result.message);

      if (!isEditing) {
        // Redirect to edit mode after creation
        navigate(`/admin/programs/edit/${result.program._id}`);
      }
    } catch (err) {
      setError(err.message || 'Error saving program');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BACKEND_URL}/api/programs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete program');
      }

      navigate('/admin/programs');
    } catch (err) {
      setError(err.message || 'Error deleting program');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.title) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center">Loading program data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            {isEditing ? 'Edit Program' : 'Add New Program'}
          </h1>

          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          )}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  className="w-full pl-7 p-2 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleNumberChange}
                className="w-full p-2 border rounded-md"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="2"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Main Preview"
                  className="w-40 h-24 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Images
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="url"
                value={galleryImage}
                onChange={(e) => setGalleryImage(e.target.value)}
                className="flex-grow p-2 border rounded-md"
                placeholder="Enter image URL"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            {formData.gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {formData.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program Schedule
            </label>
            <div className="flex space-x-2 mb-2">
              <div className="flex-1">
                <input
                  type="text"
                  name="time"
                  value={newScheduleItem.time}
                  onChange={handleScheduleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Time (e.g., 9:00 AM)"
                />
              </div>
              <div className="flex-2">
                <input
                  type="text"
                  name="activity"
                  value={newScheduleItem.activity}
                  onChange={handleScheduleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Activity description"
                />
              </div>
              <button
                type="button"
                onClick={addScheduleItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            {formData.schedule.length > 0 ? (
              <div className="space-y-2">
                {formData.schedule.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium mr-2">{item.time}:</span>
                      <span>{item.activity}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(index)}
                      className="text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No schedule items added yet</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                className="flex-grow p-2 border rounded-md"
                placeholder="Add a program feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </button>
            </div>
            {formData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((item, index) => (
                  <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-blue-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No features added yet</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? 'Update Program' : 'Create Program'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramAdminForm;