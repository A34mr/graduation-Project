const express = require('express');
const router = express.Router();
const {
    createReview,
    getDoctorReviews,
    getClinicReviews,
    getPatientReviews,
    updateReview,
    deleteReview,
    markHelpful,
    getReviewStats
} = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/doctor/:doctorId', optionalAuth, getDoctorReviews);
router.get('/clinic/:clinicId', optionalAuth, getClinicReviews);
router.get('/stats/:doctorId', getReviewStats);

// Protected routes
router.use(auth);

// Get patient's own reviews
router.get('/my/reviews', getPatientReviews);

// Create review
router.post('/', createReview);

// Update review
router.put('/:id', updateReview);

// Delete review
router.delete('/:id', deleteReview);

// Mark review as helpful
router.post('/:id/helpful', markHelpful);

module.exports = router;
