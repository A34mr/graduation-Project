const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid',
    },
    notes: {
        type: String,
        default: '',
    },
    symptoms: {
        type: String,
        default: '',
    },
    treatmentType: {
        type: String,
        default: 'General Consultation',
    },
}, {
    timestamps: true,
});

AppointmentSchema.index({ patient: 1, date: -1 });
AppointmentSchema.index({ doctor: 1, date: -1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
