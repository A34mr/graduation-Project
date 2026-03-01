const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin', 'clinic'],
        required: true
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    }
}, {
    timestamps: true,
    discriminatorKey: 'role',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

// Discriminator for Patient
const Patient = User.discriminator('patient', new mongoose.Schema({
    medicalHistory: { type: String },
    allergies: [{ type: String }],
    cardiacConditions: [{ type: String }],
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String }
    }
}));

// Discriminator for Doctor
const Doctor = User.discriminator('doctor', new mongoose.Schema({
    specialization: [{ type: String, required: true }],
    qualifications: [{ type: String, required: true }],
    clinics: [{ type: mongoose.Schema.ObjectId, ref: 'Clinic' }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    workingHours: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        startTime: { type: String },
        endTime: { type: String }
    }]
}));

// Discriminator for Admin
const Admin = User.discriminator('admin', new mongoose.Schema({
    permissions: [{ type: String }]
}));

module.exports = { User, Patient, Doctor, Admin };
