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
        enum: ['Male', 'Female', 'Other'],
    },
    specialty: {
        type: String,
        required: true,
        enum: [
            'General Dentist',
            'Orthodontist',
            'Periodontist',
            'Endodontist',
            'Pediatric Dentist',
            'Oral Surgeon',
            'Prosthodontist',
            'Cosmetic Dentist',
        ],
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    education: [{
        degree: {
            type: String,
        },
        institution: {
            type: String,
        },
        year: {
            type: Number,
        },
    }],
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
        day: {
            type: String,
            enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        },
        startTime: {
            type: String,
        },
        endTime: {
            type: String,
        },
    }],
    consultationPrice: {
        type: Number,
        default: 0,
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
    },
    clinics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
    }],
    profileImage: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
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
