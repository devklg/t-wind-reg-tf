const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { auth, isAdmin, canEditEnrollment } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create new enrollment (public route)
router.post('/', async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    
    // Generate token for the new enrollment
    const token = jwt.sign({ id: enrollment._id }, JWT_SECRET);
    
    res.status(201).json({ enrollment, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const enrollment = await Enrollment.findOne({ email }).select('+password');
    
    if (!enrollment || !(await bcrypt.compare(password, enrollment.password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ id: enrollment._id }, JWT_SECRET);
    res.json({ enrollment, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get all enrollments (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single enrollment (admin or self)
router.get('/:id', auth, canEditEnrollment, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update enrollment (admin or self)
router.put('/:id', auth, canEditEnrollment, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Only allow admins to update certain fields
    if (req.enrollment.role !== 'admin') {
      delete req.body.role;
      delete req.body.status;
    }

    Object.assign(enrollment, req.body);
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update enrollment status (admin only)
router.patch('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    enrollment.status = req.body.status;
    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete enrollment (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    await enrollment.deleteOne();
    res.json({ message: 'Enrollment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 