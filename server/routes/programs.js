const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const auth = require('../middleware/auth');

// Create Program
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      longDescription,
      startDate,
      endDate,
      price,
      capacity,
      location,
      schedule,
      features,
      image,
      gallery
    } = req.body;

    // Check for required fields
    if (!title || !description || !startDate || !endDate || !price || !capacity || !image) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Create new program
    const program = new Program({
      title,
      description,
      longDescription,
      startDate,
      endDate,
      price,
      capacity,
      location,
      schedule: schedule || [],
      features: features || [],
      image,
      gallery: gallery || []
    });

    await program.save();

    res.status(201).json({
      message: 'Program created successfully',
      program
    });
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Error creating program', error: error.message });
  }
});

// Get All Programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find().sort({ startDate: 1 });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Program by ID
router.get('/:id', async (req, res, next) => {
  let program;
  try {
    program = await Program.findById(req.params.id);
    if (program == null) {
      return res.status(404).json({ message: 'Program not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  return res.json(program);
});

// Update Program by ID
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      longDescription,
      startDate,
      endDate,
      price,
      capacity,
      location,
      schedule,
      features,
      image,
      gallery
    } = req.body;

    // Validate dates if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Find program and update
    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        longDescription,
        startDate,
        endDate,
        price,
        capacity,
        location,
        schedule,
        features,
        image,
        gallery
      },
      { new: true, runValidators: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({
      message: 'Program updated successfully',
      program: updatedProgram
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Error updating program', error: error.message });
  }
});

// Delete Program by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting program', error: error.message });
  }
});


module.exports = router;