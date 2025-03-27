const express = require('express');
const router = express.Router();
const RoomBooking = require('../models/RoomBooking');
const authenticateMiddleware = require('../middleware/auth');

// Get all room bookings (admin only)
router.get('/', authenticateMiddleware, async (req, res) => {
  try {
    const query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await RoomBooking.find(query)
      .populate('userId', 'name email')
      .populate('rooms')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching room bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single room booking (admin only)
router.get('/:id', authenticateMiddleware, async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('rooms');
    
    if (!booking) {
      return res.status(404).json({ message: 'Room booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error fetching room booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room booking status (admin only)
router.patch('/:id/status', authenticateMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await RoomBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Room booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Error updating room booking status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a room booking (admin only)
router.delete('/:id', authenticateMiddleware, async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Room booking not found' });
    }

    await booking.remove();
    res.json({ message: 'Room booking removed' });
  } catch (err) {
    console.error('Error deleting room booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 