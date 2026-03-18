const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');

const router = express.Router();

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
router.post('/register', async (req, res) => {
    try {
        const { role, name, email, password, phone, ...otherData } = req.body;

        // Check if user exists in any collection
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let user;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
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
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

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

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
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
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
