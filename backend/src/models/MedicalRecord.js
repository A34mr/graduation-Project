const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Medical record must belong to a patient']
    },
    doctor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Medical record must be created by a doctor']
    },
    date: {
        type: Date,
        default: Date.now
    },
    diagnosis: {
        code: { type: String }, // ICD-10 or similar code
        description: { type: String, required: true }
    },
    treatmentPlan: {
        steps: [{ type: String }],
        estimatedDuration: { type: String },
        notes: { type: String }
    },
    prescriptions: [{
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String }
    }],
    images: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Image'
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index to quickly find patient records
medicalRecordSchema.index({ patient: 1, date: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
