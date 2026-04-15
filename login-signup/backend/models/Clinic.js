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
    alternativePhone: {
        type: String,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
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
    mapsLink: {
        type: String,
    },
    workingHours: [{
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
        isClosed: {
            type: Boolean,
            default: false,
        },
    }],
    description: {
        type: String,
        maxlength: 1000,
    },
    services: [{
        name: {
            type: String,
        },
        price: {
            type: Number,
        },
        duration: {
            type: Number, // in minutes
        },
    }],
    equipment: [{
        type: String,
    }],
    insuranceAccepted: [{
        type: String,
    }],
    maxDoctors: {
        type: Number,
        default: 10,
    },
    logo: {
        type: String,
    },
    gallery: [{
        type: String,
    }],
    license: {
        type: String,
    },
    licenseDocument: {
        type: String,
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
    totalReviews: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
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
