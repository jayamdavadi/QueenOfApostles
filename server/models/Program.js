const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  time: { type: String, required: true },
  activity: { type: String, required: true }
});

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  schedule: { type: [scheduleSchema], required: true },
  features: { type: [String], required: true },
  image: { type: String, required: true },
  gallery: { type: [String], required: true }
});

module.exports = mongoose.model('Program', programSchema);