const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { doctor, clinic, appointment, rating, feedbackText, categories } = req.body;
        const patientId = req.user.id;

        // Validate required fields
        if (!doctor || !clinic || !rating || !feedbackText) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if patient already reviewed this doctor for this appointment
        const existingReview = await Review.findOne({
            patient: patientId,
            doctor,
            appointment
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this appointment' });
        }

        // Verify appointment exists and is completed
        const Appointment = require('../models/Appointment');
        const appointmentDoc = await Appointment.findById(appointment);

        if (!appointmentDoc) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointmentDoc.patient.toString() !== patientId) {
            return res.status(403).json({ message: 'You can only review your own appointments' });
        }

        // Create review
        const review = new Review({
            patient: patientId,
            doctor,
            clinic,
            appointment,
            rating,
            feedbackText,
            categories
        });

        await review.save();

        // Update doctor's rating
        const allDoctorReviews = await Review.find({ doctor });
        const totalRating = allDoctorReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / allDoctorReviews.length;

        await Doctor.findByIdAndUpdate(doctor, {
            'rating.average': averageRating,
            'rating.count': allDoctorReviews.length
        });

        // Update clinic's rating
        const allClinicReviews = await Review.find({ clinic });
        const clinicTotalRating = allClinicReviews.reduce((sum, r) => sum + r.rating, 0);
        const clinicAverageRating = clinicTotalRating / allClinicReviews.length;

        await Clinic.findByIdAndUpdate(clinic, {
            'rating.average': clinicAverageRating,
            'rating.count': allClinicReviews.length,
            totalReviews: allClinicReviews.length
        });

        const populatedReview = await Review.findById(review._id)
            .populate('patient', 'name')
            .populate('doctor', 'name specialty')
            .populate('clinic', 'name');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review: populatedReview
        });
    } catch (err) {
        console.error('Create review error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get reviews for a doctor
exports.getDoctorReviews = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const reviews = await Review.find({ doctor: doctorId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('patient', 'name')
            .populate('clinic', 'name');

        const total = await Review.countDocuments({ doctor: doctorId });

        res.json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            reviews
        });
    } catch (err) {
        console.error('Get doctor reviews error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get reviews for a clinic
exports.getClinicReviews = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const reviews = await Review.find({ clinic: clinicId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('patient', 'name')
            .populate('doctor', 'name specialty');

        const total = await Review.countDocuments({ clinic: clinicId });

        res.json({
            success: true,
            count: reviews.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            reviews
        });
    } catch (err) {
        console.error('Get clinic reviews error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get patient's reviews
exports.getPatientReviews = async (req, res) => {
    try {
        const patientId = req.user.id;

        const reviews = await Review.find({ patient: patientId })
            .sort({ createdAt: -1 })
            .populate('doctor', 'name specialty')
            .populate('clinic', 'name')
            .populate('appointment', 'date time treatmentType');

        res.json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (err) {
        console.error('Get patient reviews error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, feedbackText, categories } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only the patient who wrote the review can update it
        if (role === 'patient' && review.patient.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Admin can also update
        if (role === 'admin' && review.adminResponse === undefined) {
            review.adminResponse = req.body.adminResponse;
        }

        // Update fields
        if (rating) review.rating = rating;
        if (feedbackText) review.feedbackText = feedbackText;
        if (categories) review.categories = categories;

        await review.save();

        const updatedReview = await Review.findById(review._id)
            .populate('patient', 'name')
            .populate('doctor', 'name specialty')
            .populate('clinic', 'name');

        res.json({
            success: true,
            message: 'Review updated successfully',
            review: updatedReview
        });
    } catch (err) {
        console.error('Update review error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const role = req.user.role;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only admin or the patient who wrote the review can delete
        if (role === 'patient' && review.patient.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update doctor and clinic ratings after deletion
        const doctorId = review.doctor;
        const clinicId = review.clinic;

        await review.deleteOne();

        // Recalculate doctor ratings
        const doctorReviews = await Review.find({ doctor: doctorId });
        if (doctorReviews.length > 0) {
            const totalRating = doctorReviews.reduce((sum, r) => sum + r.rating, 0);
            await Doctor.findByIdAndUpdate(doctorId, {
                'rating.average': totalRating / doctorReviews.length,
                'rating.count': doctorReviews.length
            });
        } else {
            await Doctor.findByIdAndUpdate(doctorId, {
                'rating.average': 0,
                'rating.count': 0
            });
        }

        // Recalculate clinic ratings
        const clinicReviews = await Review.find({ clinic: clinicId });
        if (clinicReviews.length > 0) {
            const totalRating = clinicReviews.reduce((sum, r) => sum + r.rating, 0);
            await Clinic.findByIdAndUpdate(clinicId, {
                'rating.average': totalRating / clinicReviews.length,
                'rating.count': clinicReviews.length,
                totalReviews: clinicReviews.length
            });
        } else {
            await Clinic.findByIdAndUpdate(clinicId, {
                'rating.average': 0,
                'rating.count': 0,
                totalReviews: 0
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (err) {
        console.error('Delete review error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.isHelpful += 1;
        await review.save();

        res.json({
            success: true,
            message: 'Review marked as helpful',
            helpfulCount: review.isHelpful
        });
    } catch (err) {
        console.error('Mark helpful error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get review statistics
exports.getReviewStats = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const reviews = await Review.find({ doctor: doctorId });

        const stats = {
            total: reviews.length,
            averageRating: 0,
            distribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            },
            categories: {
                cleanliness: 0,
                professionalism: 0,
                waitTime: 0,
                valueForMoney: 0
            }
        };

        if (reviews.length > 0) {
            stats.averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

            reviews.forEach(r => {
                stats.distribution[r.rating] = (stats.distribution[r.rating] || 0) + 1;

                if (r.categories) {
                    if (r.categories.cleanliness) stats.categories.cleanliness += r.categories.cleanliness;
                    if (r.categories.professionalism) stats.categories.professionalism += r.categories.professionalism;
                    if (r.categories.waitTime) stats.categories.waitTime += r.categories.waitTime;
                    if (r.categories.valueForMoney) stats.categories.valueForMoney += r.categories.valueForMoney;
                }
            });

            // Calculate category averages
            if (reviews.length > 0) {
                stats.categories.cleanliness /= reviews.length;
                stats.categories.professionalism /= reviews.length;
                stats.categories.waitTime /= reviews.length;
                stats.categories.valueForMoney /= reviews.length;
            }
        }

        res.json({
            success: true,
            stats
        });
    } catch (err) {
        console.error('Get review stats error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
