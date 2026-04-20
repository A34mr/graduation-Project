const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    feedbackText: {
        type: String,
        required: true,
        trim: true,
    },
    categories: {
        cleanliness: {
            type: Number,
            min: 1,
            max: 5,
        },
        professionalism: {
            type: Number,
            min: 1,
            max: 5,
        },
        waitTime: {
            type: Number,
            min: 1,
            max: 5,
        },
        valueForMoney: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    isHelpful: {
        type: Number,
        default: 0,
    },
    adminResponse: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// Ensure a patient can only review a doctor once per appointment
ReviewSchema.index({ patient: 1, doctor: 1, appointment: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
