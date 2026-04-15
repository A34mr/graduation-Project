const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');

// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctor, clinic, date, time, symptoms, treatmentType, notes } = req.body;
        const patientId = req.user.id;

        // Validate required fields
        if (!doctor || !clinic || !date || !time) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if doctor exists
        const doctorExists = await Doctor.findById(doctor);
        if (!doctorExists) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if clinic exists
        const clinicExists = await Clinic.findById(clinic);
        if (!clinicExists) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        // Check if patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check for duplicate appointment
        const existingAppointment = await Appointment.findOne({
            patient: patientId,
            doctor,
            date,
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'You already have an appointment scheduled at this time' });
        }

        // Create appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor,
            clinic,
            date,
            time,
            symptoms,
            treatmentType: treatmentType || 'General Consultation',
            notes
        });

        await appointment.save();

        // Populate appointment details
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name email specialty profileImage')
            .populate('clinic', 'name address city mapsLink');

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: populatedAppointment
        });
    } catch (err) {
        console.error('Create appointment error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all appointments for the current user
exports.getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const status = req.query.status;

        let query = {};

        // Build query based on user role
        switch (role) {
            case 'patient':
                query.patient = userId;
                break;
            case 'doctor':
                query.doctor = userId;
                break;
            case 'clinic':
                // Get all doctors in this clinic
                const doctors = await Doctor.find({ clinic: userId }).distinct('_id');
                query.doctor = { $in: doctors };
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .sort({ date: -1, time: 1 })
            .populate('patient', 'name email phone')
            .populate('doctor', 'name email specialty profileImage')
            .populate('clinic', 'name address city mapsLink');

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (err) {
        console.error('Get appointments error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get single appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const appointment = await Appointment.findById(id)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name email specialty profileImage')
            .populate('clinic', 'name address city mapsLink');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if user has access to this appointment
        const isPatient = appointment.patient._id.toString() === userId;
        const isDoctor = appointment.doctor._id.toString() === userId;
        const isClinic = appointment.clinic._id.toString() === userId;

        if (!isPatient && !isDoctor && !isClinic) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({
            success: true,
            appointment
        });
    } catch (err) {
        console.error('Get appointment error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        // Validate status
        if (status && !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check permissions
        if (role === 'doctor' && appointment.doctor.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (role === 'patient' && status === 'cancelled' && appointment.patient.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update fields
        if (status) appointment.status = status;
        if (notes) appointment.notes = notes;

        await appointment.save();

        const updatedAppointment = await Appointment.findById(id)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name email specialty profileImage')
            .populate('clinic', 'name address city mapsLink');

        res.json({
            success: true,
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        });
    } catch (err) {
        console.error('Update appointment error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        // Validate payment status
        if (paymentStatus && !['unpaid', 'paid', 'refunded'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Only clinic or admin can update payment
        if (role !== 'clinic') {
            const clinic = await Clinic.findById(userId);
            if (!clinic || clinic._id.toString() !== appointment.clinic.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        appointment.paymentStatus = paymentStatus;
        await appointment.save();

        const updatedAppointment = await Appointment.findById(id)
            .populate('patient', 'name email phone')
            .populate('doctor', 'name email specialty profileImage')
            .populate('clinic', 'name address city mapsLink');

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            appointment: updatedAppointment
        });
    } catch (err) {
        console.error('Update payment error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const { cancellationReason } = req.body;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if already cancelled
        if (appointment.status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment is already cancelled' });
        }

        // Check permissions - patient can cancel, doctor can cancel, admin can cancel
        const isPatient = appointment.patient.toString() === userId;
        const isDoctor = appointment.doctor.toString() === userId;

        if (!isPatient && !isDoctor && role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        appointment.status = 'cancelled';
        if (cancellationReason) {
            appointment.notes = (appointment.notes || '') + '\nCancellation Reason: ' + cancellationReason;
        }

        await appointment.save();

        res.json({
            success: true,
            message: 'Appointment cancelled successfully'
        });
    } catch (err) {
        console.error('Cancel appointment error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get available appointment slots for a doctor
exports.getAvailableSlots = async (req, res) => {
    try {
        const { doctorId, date } = req.params;

        // Validate date format
        const requestedDate = new Date(date);
        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Get doctor's working days
        const doctor = await Doctor.findById(doctorId).populate('clinic');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Get all appointments for the requested date
        const startOfDay = new Date(requestedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(requestedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointment.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['pending', 'confirmed'] }
        });

        // Generate time slots (e.g., 9 AM to 5 PM, 30 min slots)
        const allSlots = [];
        const startHour = 9;
        const endHour = 17;

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                allSlots.push(time);
            }
        }

        // Get booked times
        const bookedTimes = bookedAppointments.map(apt => apt.time);

        // Available slots are those not booked
        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

        res.json({
            success: true,
            date,
            doctor: {
                id: doctorId,
                name: doctor.name,
                specialty: doctor.specialty
            },
            availableSlots,
            totalAvailable: availableSlots.length
        });
    } catch (err) {
        console.error('Get available slots error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
