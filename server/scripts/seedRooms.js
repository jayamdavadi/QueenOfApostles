const Room = require('../models/Room');

const roomsData = [
  // First Floor - Single Rooms
  {
    roomNumber: "101",
    type: "Single",
    floor: 1,
    capacity: 1,
    pricePerNight: 89,
    squareFootage: 250,
    beds: [{ type: "Single", count: 1 }],
    view: "Garden",
    images: [{
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
      caption: "Cozy Single Room"
    }]
  },
  {
    roomNumber: "102",
    type: "Single",
    floor: 1,
    capacity: 1,
    pricePerNight: 95,
    squareFootage: 250,
    beds: [{ type: "Queen", count: 1 }],
    bathroom: { hasBathtub: true },
    view: "Garden",
    images: [{
      url: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658",
      caption: "Modern Single Room"
    }]
  },

  // First Floor - Double Rooms
  {
    roomNumber: "103",
    type: "Double",
    floor: 1,
    capacity: 2,
    pricePerNight: 149,
    squareFootage: 350,
    beds: [{ type: "Queen", count: 1 }],
    amenities: {
      balcony: true,
      minibar: true
    },
    view: "Pool",
    images: [{
      url: "https://images.unsplash.com/photo-1631049035182-249067d7618e",
      caption: "Spacious Double Room"
    }]
  },

  // Second Floor - Family Rooms
  {
    roomNumber: "201",
    type: "Family",
    floor: 2,
    capacity: 4,
    pricePerNight: 249,
    squareFootage: 500,
    beds: [
      { type: "Queen", count: 1 },
      { type: "Single", count: 2 }
    ],
    bathroom: {
      hasBathtub: true,
      hasShower: true
    },
    amenities: {
      balcony: true,
      minibar: true,
      tv: {
        screenSize: 55,
        smartTv: true
      }
    },
    view: "Mountain",
    images: [{
      url: "https://images.unsplash.com/photo-1631049035026-64947d38b975",
      caption: "Luxurious Family Room"
    }]
  },

  // Second Floor - Suites
  {
    roomNumber: "202",
    type: "Suite",
    floor: 2,
    capacity: 2,
    pricePerNight: 299,
    squareFootage: 600,
    beds: [{ type: "King", count: 1 }],
    bathroom: {
      hasBathtub: true,
      hasShower: true
    },
    amenities: {
      balcony: true,
      minibar: true,
      tv: {
        screenSize: 65,
        smartTv: true
      }
    },
    view: "Mountain",
    images: [{
      url: "https://images.unsplash.com/photo-1631049035634-c04c637651b1",
      caption: "Elegant Suite"
    }]
  },

  // Third Floor - Deluxe Rooms
  {
    roomNumber: "301",
    type: "Deluxe",
    floor: 3,
    capacity: 2,
    pricePerNight: 399,
    squareFootage: 700,
    beds: [{ type: "King", count: 1 }],
    bathroom: {
      hasBathtub: true,
      hasShower: true
    },
    amenities: {
      balcony: true,
      minibar: true,
      tv: {
        screenSize: 75,
        smartTv: true
      }
    },
    view: "Mountain",
    wheelchairAccessible: true,
    images: [{
      url: "https://images.unsplash.com/photo-1631049035517-72c2d7f5e9c6",
      caption: "Premium Deluxe Room"
    }]
  }
];

const seedRooms = async () => {
  try {
    // check more than 1 room, skip seeding
    const existingRooms = await Room.countDocuments();
    if (existingRooms > 1) {
      console.log('Rooms already seeded');
      return;
    }

    // Clear existing rooms
    await Room.deleteMany({});

    // Insert new rooms
    await Room.insertMany(roomsData);

    console.log('Rooms seeded successfully');
  } catch (error) {
    console.error('Error seeding rooms:', error);
  }
};

module.exports = seedRooms;