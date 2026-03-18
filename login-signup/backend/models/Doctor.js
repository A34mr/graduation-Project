const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    specialty: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    licenseDocument: {
        type: String,
    },
    workingDays: [{
        type: String,
    }],
    consultationPrice: {
        type: Number,
        default: 0,
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
    },
    role: {
        type: String,
        default: 'doctor',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
