const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Appointment',
        required: [true, 'Payment must belong to an appointment']
    },
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    clinic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Clinic',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD'
    },
    method: {
        type: String,
        enum: ['credit_card', 'cash', 'insurance', 'paypal', 'bank_transfer'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String // Stripe/PayPal ID
    },
    receiptUrl: {
        type: String
    },
    breakdown: [{
        service: String,
        cost: Number
    }],
    notes: String
}, {
    timestamps: true
});

paymentSchema.index({ patient: 1 });
paymentSchema.index({ clinic: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
