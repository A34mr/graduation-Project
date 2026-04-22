const express = require('express');
const router = express.Router();
const {
    createOrUpdateHistory,
    getMedicalHistory,
    addDisease,
    removeDisease,
    addMedication,
    updateAllergies,
    getHistorySummary
} = require('../controllers/medicalHistoryController');
const { auth, patientAuth, doctorAuth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get or create medical history
router.get('/', getMedicalHistory);
router.post('/', createOrUpdateHistory);
router.put('/', createOrUpdateHistory);

// Get history summary (for doctors)
router.get('/summary/:patientId', getHistorySummary);

// Add disease
router.post('/diseases', addDisease);

// Remove disease
router.delete('/diseases/:diseaseId', removeDisease);

// Add medication
router.post('/medications', addMedication);

// Update allergies
router.put('/allergies', updateAllergies);

module.exports = router;
