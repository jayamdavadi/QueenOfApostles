const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const RoomBooking = require('../models/RoomBooking');
const auth = require('../middleware/auth');

// Get all available rooms
router.get('/', async (req, res) => {
  try {
    const { checkIn, checkOut, capacity, type } = req.query;
    let query = {};

    if (type) {
      // ignore case
      query.type = { $regex: new RegExp(type, 'i') };
    }

    if (capacity) {
      query.capacity = { $gte: parseInt(capacity) };
    }

    const rooms = await Room.find(query);

    if (checkIn && checkOut) {
      // Ensure valid date objects
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      // Filter rooms based on availability
      const availableRooms = await Promise.all(
        rooms.map(async (room) => {
          const isAvailable = await room.isAvailable(checkInDate, checkOutDate);
          return isAvailable ? room : null;
        })
      );

      return res.json(availableRooms.filter(room => room !== null));
    }

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

// get my bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await RoomBooking.find({ userId: req.user.userId })
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// update guest meal preferences
router.patch('/bookings/:bookingId/guest/:guestId/preferences', auth, async (req, res) => {
  const { bookingId, guestId } = req.params;
  const { mealPreferences } = req.body;

  console.log('mealPreferences:', mealPreferences);
  console.log('bookingId:', bookingId);
  console.log('guestId:', guestId);

  try {
    const booking = await RoomBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const guest = booking.guests.id(guestId);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    guest.mealPreferences = mealPreferences;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Error updating guest meal preferences:', error);
    res.status(500).json({ message: 'Error updating guest meal preferences' });
  }
});

// Create a new booking
router.post('/book', auth, async (req, res) => {
  try {
    const {
      rooms,
      checkIn,
      checkOut,
      numberOfGuests,
      mealPlans,
      guests,
      totalPrice
    } = req.body;

    // Ensure we have valid date objects
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Validate room availability again - important to check right before booking
    const unavailableRooms = [];
    for (const roomId of rooms) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: `Room with ID ${roomId} not found` });
      }

      const isAvailable = await room.isAvailable(checkInDate, checkOutDate);
      if (!isAvailable) {
        unavailableRooms.push(roomId);
      }
    }

    if (unavailableRooms.length > 0) {
      return res.status(400).json({
        message: 'Some rooms are no longer available for the selected dates',
        unavailableRooms
      });
    }

    // Create booking
    const booking = new RoomBooking({
      userId: req.user.userId,
      rooms,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfGuests,
      mealPlans,
      guests,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      message: 'Error creating booking',
      error: error.message
    });
  }
});

module.exports = router;