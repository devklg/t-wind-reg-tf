const jwt = require('jsonwebtoken');
const Enrollment = require('../models/Enrollment');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const enrollment = await Enrollment.findOne({ _id: decoded.id });

        if (!enrollment) {
            throw new Error();
        }

        req.enrollment = enrollment;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.enrollment.role !== 'admin') {
            throw new Error();
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

const canEditEnrollment = async (req, res, next) => {
    try {
        const enrollmentId = req.params.id;
        const userEnrollment = req.enrollment;

        // Allow if user is admin or if user is editing their own profile
        if (userEnrollment.role === 'admin' || userEnrollment._id.toString() === enrollmentId) {
            next();
        } else {
            throw new Error();
        }
    } catch (error) {
        res.status(403).json({ message: 'Access denied. You can only edit your own profile.' });
    }
};

module.exports = { auth, isAdmin, canEditEnrollment }; 