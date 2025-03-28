const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const RoomBooking = require('../models/RoomBooking');
const authMiddleware = require('../middleware/auth');

// Get all room bookings (admin only)
router.get('/bookings', authMiddleware, async (req, res) => {
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

// Get room bookings for current user
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await RoomBooking.find({ userId: req.user.id })
      .populate('rooms')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user room bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single room booking
router.get('/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('rooms');
    
    if (!booking) {
      return res.status(404).json({ message: 'Room booking not found' });
    }

    // Check if user is admin or booking owner
    if (!req.user.isAdmin && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    console.error('Error fetching room booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update room booking status (admin only)
router.patch('/bookings/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
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
router.delete('/bookings/:id', authenticateToken, authorizeAdmin, async (req, res) => {
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