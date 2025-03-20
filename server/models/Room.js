const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Suite', 'Family', 'Deluxe']
  },
  floor: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  squareFootage: {
    type: Number,
    required: true
  },
  beds: [{
    type: {
      type: String,
      enum: ['Single', 'Double', 'Queen', 'King'],
      required: true
    },
    count: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  bathroom: {
    hasShower: {
      type: Boolean,
      default: true
    },
    hasBathtub: {
      type: Boolean,
      default: false
    },
    hasHairDryer: {
      type: Boolean,
      default: true
    },
    toiletries: {
      type: Boolean,
      default: true
    }
  },
  amenities: {
    tv: {
      available: {
        type: Boolean,
        default: true
      },
      screenSize: {
        type: Number, // in inches
        default: 32
      },
      smartTv: {
        type: Boolean,
        default: true
      }
    },
    balcony: {
      type: Boolean,
      default: false
    },
    airConditioning: {
      type: Boolean,
      default: true
    },
    heating: {
      type: Boolean,
      default: true
    },
    wifi: {
      type: Boolean,
      default: true
    },
    minibar: {
      type: Boolean,
      default: false
    },
    refrigerator: {
      type: Boolean,
      default: true
    },
    coffeeMaker: {
      type: Boolean,
      default: true
    },
    workDesk: {
      type: Boolean,
      default: true
    },
    iron: {
      type: Boolean,
      default: true
    },
    safe: {
      type: Boolean,
      default: true
    },
    wheelchairAccessible: {
      type: Boolean,
      default: false
    }
  },
  view: {
    type: String,
    enum: ['City', 'Garden', 'Pool', 'Mountain', 'Interior'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
roomSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Fixed method to check room availability for given dates
roomSchema.methods.isAvailable = async function (checkIn, checkOut) {
  // Make sure we have valid date objects
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Find any bookings that overlap with the requested dates
  const bookings = await mongoose.model('RoomBooking').find({
    rooms: this._id, // Since rooms is an array of ObjectIds
    status: { $ne: 'cancelled' },
    $or: [
      {
        // Check if a booking exists that overlaps with the requested dates
        checkIn: { $lt: checkOutDate },
        checkOut: { $gt: checkInDate }
      }
    ]
  });

  // Room is available if no overlapping bookings are found
  return bookings.length === 0;
};

// Virtual for full room name
roomSchema.virtual('fullName').get(function () {
  return `Room ${this.roomNumber} - ${this.type}`;
});

// Method to get room features summary
roomSchema.methods.getFeaturesSummary = function () {
  const bedSummary = this.beds.map(bed =>
    `${bed.count} ${bed.type} bed${bed.count > 1 ? 's' : ''}`
  ).join(', ');

  return {
    beds: bedSummary,
    bathroom: {
      features: [
        this.bathroom.hasShower && 'Shower',
        this.bathroom.hasBathtub && 'Bathtub',
        this.bathroom.hasHairDryer && 'Hair Dryer',
        this.bathroom.toiletries && 'Toiletries'
      ].filter(Boolean)
    },
    keyAmenities: [
      this.amenities.tv.available && `${this.amenities.tv.screenSize}" TV${this.amenities.tv.smartTv ? ' (Smart)' : ''}`,
      this.amenities.balcony && 'Balcony',
      this.amenities.minibar && 'Minibar',
      this.amenities.coffeeMaker && 'Coffee Maker',
      this.amenities.workDesk && 'Work Desk',
      this.amenities.safe && 'Safe'
    ].filter(Boolean)
  };
};

module.exports = mongoose.model('Room', roomSchema);