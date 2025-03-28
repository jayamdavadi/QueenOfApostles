const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authenticateMiddleware = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', authenticateMiddleware, async (req, res) => {
  try {
    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('programId', 'title startDate endDate')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single booking (admin only)
router.get('/:id', authenticateMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('programId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', authenticateMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a booking (admin only)
router.delete('/:id', authenticateMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.remove();
    res.json({ message: 'Booking removed' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 