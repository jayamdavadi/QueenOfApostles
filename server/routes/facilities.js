const express = require('express');
const Facility = require('../models/Facility');
const router = express.Router();
const auth = require('../middleware/auth');

// Create facility
router.get('/', async (req, res) => {
  try {
    const programs = await Facility.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Facility.findById(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching program' });
  }
});

// admin routes

// Get all facilities
router.get('/', auth, async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ createdAt: -1 });
    res.status(200).json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ message: 'Error fetching facilities', error: error.message });
  }
});

// Get facility by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.status(200).json(facility);
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({ message: 'Error fetching facility details', error: error.message });
  }
});

// Create new facility
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      type,
      capacity,
      pricePerDay,
      location,
      size,
      features,
      amenities,
      mainImage,
      gallery,
      availability
    } = req.body;

    // Check for required fields
    if (!name || !description || !type || !capacity || !pricePerDay || !location || !size || !mainImage) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Create new facility
    const facility = new Facility({
      name,
      description,
      longDescription,
      type,
      capacity,
      pricePerDay,
      location,
      size,
      features: features || [],
      amenities: amenities || [],
      mainImage,
      gallery: gallery || [],
      availability: availability || []
    });

    await facility.save();

    res.status(201).json({
      message: 'Facility created successfully',
      facility
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({ message: 'Error creating facility', error: error.message });
  }
});

// Update facility
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      type,
      capacity,
      pricePerDay,
      location,
      size,
      features,
      amenities,
      mainImage,
      gallery,
      availability
    } = req.body;

    // Find facility and update
    const updatedFacility = await Facility.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        longDescription,
        type,
        capacity,
        pricePerDay,
        location,
        size,
        features,
        amenities,
        mainImage,
        gallery,
        availability,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedFacility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.status(200).json({
      message: 'Facility updated successfully',
      facility: updatedFacility
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ message: 'Error updating facility', error: error.message });
  }
});

// Delete facility
router.delete('/:id', auth, async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.status(200).json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({ message: 'Error deleting facility', error: error.message });
  }
});

// Update facility availability
router.put('/:id/availability', auth, async (req, res) => {
  try {
    const { availability } = req.body;

    if (!availability || !Array.isArray(availability)) {
      return res.status(400).json({ message: 'Valid availability array must be provided' });
    }

    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    facility.availability = availability;
    facility.updatedAt = Date.now();

    await facility.save();

    res.status(200).json({
      message: 'Availability updated successfully',
      facility
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
});

// Bulk update availability for multiple dates
router.put('/:id/availability/bulk', auth, async (req, res) => {
  try {
    const { dates, status } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0 || !status) {
      return res.status(400).json({ message: 'Valid dates array and status must be provided' });
    }

    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Create a map of existing availability for quick lookup
    const availabilityMap = {};
    facility.availability.forEach(item => {
      availabilityMap[item.date] = item;
    });

    // Update or add availability for each date
    dates.forEach(date => {
      if (availabilityMap[date]) {
        // Update existing date
        availabilityMap[date].status = status;
      } else {
        // Add new date
        facility.availability.push({ date, status });
      }
    });

    facility.updatedAt = Date.now();
    await facility.save();

    res.status(200).json({
      message: 'Availability bulk updated successfully',
      facility
    });
  } catch (error) {
    console.error('Error bulk updating availability:', error);
    res.status(500).json({ message: 'Error bulk updating availability', error: error.message });
  }
});


module.exports = router;