const express = require('express');
const router = express.Router();
const {
    getAllClinics,
    getClinicById,
    getClinicDoctors,
    createClinic,
    updateClinic,
    searchClinics,
    getClinicStats
} = require('../controllers/clinicController');
const { auth, clinicAuth } = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');

// Public routes (optional auth for personalized results)
router.get('/', optionalAuth, getAllClinics);
router.get('/search', searchClinics);
router.get('/:id', optionalAuth, getClinicById);

// Get clinic's doctors
router.get('/:id/doctors', getClinicDoctors);

// Protected routes
router.post('/register', createClinic);
router.put('/profile', clinicAuth, updateClinic);
router.get('/profile/stats', clinicAuth, getClinicStats);

module.exports = router;
