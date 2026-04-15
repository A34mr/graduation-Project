const mongoose = require('mongoose');

const MedicalHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        unique: true,
    },
    diseases: [{
        diseaseType: {
            type: String,
            required: true,
        },
        diagnosisDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'resolved', 'chronic'],
            default: 'active',
        },
        notes: {
            type: String,
        },
    }],
    allergicHistory: {
        type: String,
        default: '',
    },
    cardiacCondition: {
        type: Boolean,
        default: false,
    },
    cardiacDetails: {
        type: String,
        default: '',
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    medications: [{
        name: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    }],
    dentalHistory: [{
        procedure: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        dentist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
        notes: {
            type: String,
        },
    }],
    lastCheckup: {
        type: Date,
    },
    nextCheckup: {
        type: Date,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('MedicalHistory', MedicalHistorySchema);
