const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked', 'maintenance'], required: true }
});

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  location: { type: String, required: true },
  size: { type: String, required: true },
  features: [{ type: String }],
  amenities: [{ type: String }],
  mainImage: { type: String, required: true },
  gallery: [{ type: String }],
  availability: [AvailabilitySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Facility = mongoose.model('Facility', FacilitySchema);

module.exports = Facility;
