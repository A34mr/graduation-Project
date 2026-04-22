const jwt = require('jsonwebtoken');

// Verify JWT token middleware
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authorization token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info to request
        req.user = decoded.user;

        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Admin authorization middleware
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authorization token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        next();
    } catch (err) {
        console.error('Admin auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Doctor authorization middleware
const doctorAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authorization token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check if user is doctor or admin
        if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Doctor only.' });
        }

        next();
    } catch (err) {
        console.error('Doctor auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Clinic authorization middleware
const clinicAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authorization token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check if user is clinic or admin
        if (req.user.role !== 'clinic' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Clinic only.' });
        }

        next();
    } catch (err) {
        console.error('Clinic auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Patient authorization middleware
const patientAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authorization token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // Check if user is patient or admin
        if (req.user.role !== 'patient' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Patient only.' });
        }

        next();
    } catch (err) {
        console.error('Patient auth middleware error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Optional auth - doesn't fail if no token, but adds user if token exists
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
        }

        next();
    } catch (err) {
        next(); // Continue without user info
    }
};

module.exports = {
    auth,
    adminAuth,
    doctorAuth,
    clinicAuth,
    patientAuth,
    optionalAuth
};
