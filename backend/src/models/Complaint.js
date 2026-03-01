const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Complaint must belong to a patient']
    },
    targetType: {
        type: String,
        enum: ['clinic', 'doctor', 'platform'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        refPath: 'targetModel'
    },
    targetModel: {
        type: String,
        enum: ['Clinic', 'User']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        enum: ['Service Quality', 'Billing', 'Treatment', 'Staff', 'Other'],
        required: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Dismissed'],
        default: 'Submitted'
    },
    evidence: [{
        url: String,
        type: { type: String }
    }],
    resolution: {
        summary: String,
        resolvedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        resolvedAt: Date,
        satisfactionScore: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    timeline: [{
        status: String,
        note: String,
        date: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
