const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    chronicDiseases: {
        type: String,
    },
    allergies: {
        type: String,
    },
    dentalIssues: {
        type: String,
    },
    emergencyContact: {
        type: String,
    },
    role: {
        type: String,
        default: 'patient',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Patient', PatientSchema);
