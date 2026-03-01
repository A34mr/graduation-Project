const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Appointment must belong to a patient']
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Appointment must have a doctor']
    },
    clinic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Clinic',
        required: [true, 'Appointment must belong to a clinic']
    },
    dateTime: {
        type: Date,
        required: [true, 'Appointment date and time is required']
    },
    duration: {
        type: Number, // in minutes
        default: 30
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded', 'partial'],
        default: 'unpaid'
    },
    type: {
        type: String,
        enum: ['consultation', 'follow-up', 'emergency', 'treatment'],
        default: 'consultation'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent double booking for the same doctor at the same time
appointmentSchema.index({ doctor: 1, dateTime: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
