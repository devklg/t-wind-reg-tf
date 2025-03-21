const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { auth, isAdmin, canEditEnrollment } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login route (no auth required)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const enrollment = await Enrollment.findOne({ email });
        if (!enrollment) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, enrollment.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: enrollment._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, enrollment: { 
            id: enrollment._id,
            firstName: enrollment.firstName,
            lastName: enrollment.lastName,
            email: enrollment.email,
            role: enrollment.role,
            package: enrollment.package,
            status: enrollment.status,
            sponsorName: enrollment.sponsorName
        }});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new enrollment (no auth required)
router.post('/', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            sponsorName,
            package,
            paymentMethod
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !sponsorName || !package) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate package
        const validPackages = ['Entry Pack', 'Elite Pack', 'Pro Pack'];
        if (!validPackages.includes(package)) {
            return res.status(400).json({ message: 'Invalid package selected' });
        }

        // Set temporary password
        const tempPassword = "magnificent";
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create enrollment data
        const enrollmentData = {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            sponsorName,
            package,
            password: hashedPassword,
            status: 'Pending'
        };

        if (paymentMethod) {
            enrollmentData.paymentMethod = paymentMethod;
        }

        const enrollment = new Enrollment(enrollmentData);
        await enrollment.save();

        const token = jwt.sign(
            { id: enrollment._id, role: enrollment.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const logData = { ...enrollmentData };
        delete logData.password;
        console.log('New enrollment created:', logData);

        res.status(201).json({
            message: 'Enrollment created successfully',
            token,
            temporaryPassword: tempPassword,
            enrollment: {
                ...enrollment.toObject(),
                password: undefined
            }
        });
    } catch (error) {
        console.error('Enrollment creation error:', error);
        
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: 'Error creating enrollment' });
    }
});

// Get all enrollees (admin only)
router.get('/all-enrollees', auth, isAdmin, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({}, '-password')
            .sort({ createdAt: -1 });
        
        const formattedEnrollments = enrollments.map(enrollment => ({
            id: enrollment._id,
            name: `${enrollment.firstName} ${enrollment.lastName}`,
            email: enrollment.email,
            sponsor: enrollment.sponsorName,
            package: enrollment.package,
            status: enrollment.status,
            location: enrollment.location,
            enrollmentDate: enrollment.createdAt,
            role: enrollment.role
        }));

        res.json(formattedEnrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's downline (authenticated users only)
router.get('/downline', async (req, res) => {
    try {
        console.log('Fetching downline for user:', {
            id: req.enrollment._id,
            name: `${req.enrollment.firstName} ${req.enrollment.lastName}`
        });
        
        const enrollments = await Enrollment.find({ 
            sponsorName: `${req.enrollment.firstName} ${req.enrollment.lastName}`
        }).select('-password');
        
        console.log(`Found ${enrollments.length} downline enrollments`);
        res.json(enrollments);
    } catch (error) {
        console.error('Error fetching downline:', error);
        res.status(500).json({ message: 'Error fetching downline: ' + error.message });
    }
});

// Get all enrollments (admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        const enrollments = await Enrollment.find();
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single enrollment (admin or self)
router.get('/:id', canEditEnrollment, async (req, res) => {
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
router.put('/:id', canEditEnrollment, async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id).select('+password');
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        if (req.body.newPassword) {
            enrollment.password = await bcrypt.hash(req.body.newPassword, 10);
            delete req.body.newPassword;
        }

        if (req.enrollment.role !== 'admin') {
            delete req.body.role;
            delete req.body.status;
        }

        Object.assign(enrollment, req.body);
        await enrollment.save();

        const response = enrollment.toObject();
        delete response.password;
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update enrollment status (admin only)
router.patch('/:id/status', isAdmin, async (req, res) => {
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
router.delete('/:id', isAdmin, async (req, res) => {
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