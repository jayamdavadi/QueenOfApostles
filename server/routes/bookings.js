const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const Program = require('../models/Program');
const auth = require('../middleware/auth');
const { sendBookingConfirmation, sendBookingUpdate } = require('../services/emailService');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { programId, booking } = req.body;

    // Validate program availability
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Check if there's enough capacity
    const existingBookings = await Booking.countDocuments({ programId });
    if (existingBookings + booking.numberOfGuests > program.capacity) {
      return res.status(400).json({ message: 'Not enough spots available' });
    }

    // Calculate total price
    const totalPrice = program.price * booking.numberOfGuests;

    // Create the booking
    const newBooking = new Booking({
      programId,
      userId: req.user.userId, 
      numberOfGuests: booking.numberOfGuests,
      guests: booking.guests,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date()
    });

    await newBooking.save();

    // Update program availability
    await Program.findByIdAndUpdate(programId, {
      $inc: { availableSpots: -booking.numberOfGuests }
    });

    // Send confirmation emails
    const emailSent = await sendBookingConfirmation(newBooking, program);
    if (!emailSent) {
      console.warn('Confirmation email failed to send for booking:', newBooking._id);
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get user's bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('programId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('programId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Update booking
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure user owns this booking
    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if update is allowed based on program date
    const program = await Program.findById(booking.programId);
    const programStartDate = new Date(program.startDate);
    const today = new Date();
    const daysDifference = Math.ceil((programStartDate - today) / (1000 * 60 * 60 * 24));

    if (daysDifference < 7) {
      return res.status(400).json({
        message: 'Bookings can only be modified up to 7 days before the program start date'
      });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
});

router.patch('/:id/guest/:guestId/preferences', auth, async (req, res) => {
  try {
    const { id, guestId } = req.params;
    const { mealPreferences } = req.body;

    // Ensure user owns this booking
    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update guest's meal preferences
    booking.guests.id(guestId).mealPreferences = mealPreferences;
    const updatedGuest = booking.guests.id(guestId);
    updatedGuest.mealPreferences = mealPreferences;
    await booking.save();

    const program = await Program.findById(booking.programId);

    // Send update email
    const emailSent = await sendBookingUpdate(booking, program, updatedGuest);
    if (!emailSent) {
      console.warn('Update email failed to send for booking:', booking._id);
    }

    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating meal preferences' });
  }
});

module.exports = router;