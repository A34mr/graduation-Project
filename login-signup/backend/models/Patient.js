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
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        country: {
            type: String,
            default: 'Egypt',
        },
    },
    dateOfBirth: {
        type: Date,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
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
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        relationship: {
            type: String,
        },
    },
    profileImage: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
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

// Auto-calculate age from dateOfBirth before saving
PatientSchema.pre('save', function(next) {
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        this.age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            this.age--;
        }
    }
    next();
});

module.exports = mongoose.model('Patient', PatientSchema);
