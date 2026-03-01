const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Image must belong to a patient']
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Can be patient or doctor
        required: true
    },
    type: {
        type: String,
        enum: ['xray', 'intraoral', 'other'],
        default: 'other'
    },
    url: {
        type: String,
        required: [true, 'Image URL is required']
    },
    filename: String,
    aiAnalysis: {
        confidenceScore: { type: Number },
        detectedConditions: [{ type: String }],
        bounding_boxes: [{
            x: Number,
            y: Number,
            width: Number,
            height: Number,
            label: String
        }],
        specialistRecommendation: String,
        urgencyLevel: {
            type: String,
            enum: ['low', 'medium', 'high', 'immediate']
        },
        analyzedAt: Date
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);
