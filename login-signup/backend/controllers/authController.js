const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');

// Helper function to find user across all collections
async function findUserByEmail(email) {
    let user = await Patient.findOne({ email });
    if (user) return { user, role: 'patient' };

    user = await Doctor.findOne({ email });
    if (user) return { user, role: 'doctor' };

    user = await Clinic.findOne({ email });
    if (user) return { user, role: 'clinic' };

    return null;
}

// Register a new user
exports.register = async (req, res) => {
    try {
        const { role, name, email, password, phone, ...otherData } = req.body;

        // Validate required fields
        if (!role || !name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user;

        // Create user based on role
        switch (role) {
            case 'patient':
                user = new Patient({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    dateOfBirth: otherData.dateOfBirth,
                    gender: otherData.gender,
                    chronicDiseases: otherData.chronicDiseases,
                    allergies: otherData.allergies,
                    dentalIssues: otherData.dentalIssues,
                    emergencyContact: otherData.emergencyContact,
                });
                break;

            case 'doctor':
                user = new Doctor({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    gender: otherData.gender,
                    specialty: otherData.specialty,
                    experience: otherData.experience,
                    licenseNumber: otherData.licenseNumber,
                    workingDays: otherData.workingDays,
                    consultationPrice: otherData.consultationPrice,
                    clinic: otherData.clinic,
                });
                break;

            case 'clinic':
                user = new Clinic({
                    name: otherData.clinicName || name,
                    email,
                    password: hashedPassword,
                    phone,
                    address: otherData.address,
                    city: otherData.city,
                    mapsLink: otherData.mapsLink,
                    workingHours: otherData.workingHours,
                    maxDoctors: otherData.maxDoctors,
                });
                break;

            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user across all collections
        const userData = await findUserByEmail(email);
        if (!userData) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const { user, role } = userData;

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check if user is verified (for doctors and clinics)
        if (role !== 'patient' && user.approvalStatus === 'pending') {
            return res.status(403).json({
                message: 'Your account is pending approval. Please wait for admin approval.'
            });
        }

        if (role !== 'patient' && user.approvalStatus === 'rejected') {
            return res.status(403).json({
                message: 'Your account has been rejected. Please contact support.'
            });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                role: role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: role
                    }
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let user;
        switch (role) {
            case 'patient':
                user = await Patient.findById(userId).select('-password');
                break;
            case 'doctor':
                user = await Doctor.findById(userId).select('-password').populate('clinic', 'name address city');
                break;
            case 'clinic':
                user = await Clinic.findById(userId).select('-password');
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const updateData = req.body;

        // Prevent updating sensitive fields
        delete updateData.password;
        delete updateData.email;
        delete updateData.role;

        let user;
        switch (role) {
            case 'patient':
                user = await Patient.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
                break;
            case 'doctor':
                user = await Doctor.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
                break;
            case 'clinic':
                user = await Clinic.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
