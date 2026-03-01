const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a patient']
    },
    targetType: {
        type: String,
        enum: ['clinic', 'doctor'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'targetModel'
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['Clinic', 'User']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    appointmentRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Appointment'
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' // For moderation
    },
    clinicResponse: {
        content: String,
        date: Date,
        respondedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent multiple reviews for the same appointment
reviewSchema.index({ appointmentRef: 1 }, { unique: true, sparse: true });
// Fast query for target entity
reviewSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model('Review', reviewSchema);
