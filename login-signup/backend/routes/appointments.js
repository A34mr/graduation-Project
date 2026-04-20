const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getUserAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    updatePaymentStatus,
    cancelAppointment,
    getAvailableSlots
} = require('../controllers/appointmentController');
const { auth } = require('../middleware/auth');

// All appointment routes require authentication
router.use(auth);

// Create new appointment
router.post('/', createAppointment);

// Get user's appointments
router.get('/', getUserAppointments);

// Get single appointment
router.get('/:id', getAppointmentById);

// Update appointment status
router.patch('/:id', updateAppointmentStatus);

// Update payment status
router.patch('/:id/payment', updatePaymentStatus);

// Cancel appointment
router.delete('/:id', cancelAppointment);

// Get available slots for a doctor
router.get('/slots/:doctorId/:date', getAvailableSlots);

module.exports = router;
