const jwt = require('jsonwebtoken');
const Enrollment = require('../models/Enrollment');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ _id: decoded.id });

        if (!enrollment) {
            throw new Error('Enrollment not found');
        }

        // Set up the full enrollment object with all necessary fields
        req.enrollment = enrollment.toObject();
        delete req.enrollment.password; // Remove sensitive data
        req.token = token;
        
        console.log('Auth middleware - User:', {
            id: req.enrollment._id,
            name: `${req.enrollment.firstName} ${req.enrollment.lastName}`,
            role: req.enrollment.role
        });
        
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.enrollment || req.enrollment.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

const canEditEnrollment = async (req, res, next) => {
    try {
        if (!req.enrollment) {
            return res.status(401).json({ message: 'Please authenticate.' });
        }

        const enrollmentId = req.params.id;
        const userEnrollment = req.enrollment;

        // Allow if user is admin or if user is editing their own profile
        if (userEnrollment.role === 'admin' || userEnrollment._id.toString() === enrollmentId) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. You can only edit your own profile.' });
        }
    } catch (error) {
        res.status(403).json({ message: 'Access denied. You can only edit your own profile.' });
    }
};

module.exports = { auth, isAdmin, canEditEnrollment }; 