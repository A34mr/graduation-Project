const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
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
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    mapsLink: {
        type: String,
    },
    workingHours: {
        type: String,
    },
    maxDoctors: {
        type: Number,
        default: 10,
    },
    logo: {
        type: String,
    },
    license: {
        type: String,
    },
    role: {
        type: String,
        default: 'clinic',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Clinic', ClinicSchema);
