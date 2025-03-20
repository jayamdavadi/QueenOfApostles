const mongoose = require('mongoose');

const mealPreferencesSchema = new mongoose.Schema({
  breakfast: String,
  lunch: String,
  dinner: String
});

const mealPlansSchema = new mongoose.Schema({
  breakfast: Boolean,
  lunch: Boolean,
  dinner: Boolean
});

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  specialRequests: String,
  mealPlans: {
    type: mealPlansSchema,
    default: {
      breakfast: false,
      lunch: false,
      dinner: false
    }
  },
  mealPreferences: {
    type: mealPreferencesSchema,
    default: {
      breakfast: '',
      lunch: '',
      dinner: ''
    }
  }
});

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }],
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  // mealPlans: {
  //   type: mealPlansSchema,
  //   required: true
  // },
  guests: [guestSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('RoomBooking', bookingSchema);