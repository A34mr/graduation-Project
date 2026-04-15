const MedicalHistory = require('../models/MedicalHistory');
const Patient = require('../models/Patient');

// Create or update medical history
exports.createOrUpdateHistory = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user.id;
        const role = req.user.role;

        // Only patient or doctor can update medical history
        if (role === 'patient' && patientId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const {
            diseases,
            allergicHistory,
            cardiacCondition,
            cardiacDetails,
            bloodType,
            medications,
            dentalHistory
        } = req.body;

        // Find existing history or create new
        let history = await MedicalHistory.findOne({ patient: patientId });

        if (history) {
            // Update existing
            if (diseases) history.diseases = diseases;
            if (allergicHistory !== undefined) history.allergicHistory = allergicHistory;
            if (cardiacCondition !== undefined) history.cardiacCondition = cardiacCondition;
            if (cardiacDetails !== undefined) history.cardiacDetails = cardiacDetails;
            if (bloodType) history.bloodType = bloodType;
            if (medications) history.medications = medications;
            if (dentalHistory) history.dentalHistory = dentalHistory;

            await history.save();
        } else {
            // Create new
            history = new MedicalHistory({
                patient: patientId,
                diseases: diseases || [],
                allergicHistory: allergicHistory || '',
                cardiacCondition: cardiacCondition || false,
                cardiacDetails: cardiacDetails || '',
                bloodType,
                medications: medications || [],
                dentalHistory: dentalHistory || []
            });

            await history.save();
        }

        const populatedHistory = await MedicalHistory.findById(history._id)
            .populate('patient', 'name email dateOfBirth age')
            .populate('dentalHistory.dentist', 'name specialty');

        res.json({
            success: true,
            message: history ? 'Medical history updated successfully' : 'Medical history created successfully',
            history: populatedHistory
        });
    } catch (err) {
        console.error('Create/Update medical history error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get patient's medical history
exports.getMedicalHistory = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user.id;
        const role = req.user.role;
        const userId = req.user.id;

        // Check access permissions
        if (role === 'patient' && patientId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (role === 'doctor') {
            // Doctor can only view if they have an appointment with this patient
            const Appointment = require('../models/Appointment');
            const hasAppointment = await Appointment.findOne({
                doctor: userId,
                patient: patientId,
                status: { $in: ['pending', 'confirmed', 'completed'] }
            });

            if (!hasAppointment && !req.query.shared) {
                return res.status(403).json({ message: 'Access denied. No active appointment with this patient.' });
            }
        }

        const history = await MedicalHistory.findOne({ patient: patientId })
            .populate('patient', 'name email dateOfBirth age phone')
            .populate('dentalHistory.dentist', 'name specialty')
            .sort({ createdAt: -1 });

        if (!history) {
            return res.json({
                success: true,
                message: 'No medical history found',
                history: null
            });
        }

        res.json({
            success: true,
            history
        });
    } catch (err) {
        console.error('Get medical history error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add disease to medical history
exports.addDisease = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { diseaseType, diagnosisDate, status, notes } = req.body;

        if (!diseaseType || !diagnosisDate) {
            return res.status(400).json({ message: 'Disease type and diagnosis date are required' });
        }

        const history = await MedicalHistory.findOne({ patient: patientId });

        if (history) {
            history.diseases.push({
                diseaseType,
                diagnosisDate,
                status: status || 'active',
                notes
            });
            await history.save();
        } else {
            const newHistory = new MedicalHistory({
                patient: patientId,
                diseases: [{
                    diseaseType,
                    diagnosisDate,
                    status: status || 'active',
                    notes
                }]
            });
            await newHistory.save();
        }

        const updatedHistory = await MedicalHistory.findOne({ patient: patientId })
            .populate('patient', 'name email');

        res.json({
            success: true,
            message: 'Disease added successfully',
            history: updatedHistory
        });
    } catch (err) {
        console.error('Add disease error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Remove disease from medical history
exports.removeDisease = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { diseaseId } = req.params;

        const history = await MedicalHistory.findOne({ patient: patientId });

        if (!history) {
            return res.status(404).json({ message: 'Medical history not found' });
        }

        history.diseases = history.diseases.filter(d => d._id.toString() !== diseaseId);
        await history.save();

        const updatedHistory = await MedicalHistory.findById(history._id)
            .populate('patient', 'name email');

        res.json({
            success: true,
            message: 'Disease removed successfully',
            history: updatedHistory
        });
    } catch (err) {
        console.error('Remove disease error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add medication to medical history
exports.addMedication = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { name, dosage, startDate, endDate } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Medication name is required' });
        }

        let history = await MedicalHistory.findOne({ patient: patientId });

        if (history) {
            history.medications.push({
                name,
                dosage,
                startDate,
                endDate
            });
            await history.save();
        } else {
            history = new MedicalHistory({
                patient: patientId,
                medications: [{
                    name,
                    dosage,
                    startDate,
                    endDate
                }]
            });
            await history.save();
        }

        const updatedHistory = await MedicalHistory.findById(history._id)
            .populate('patient', 'name email');

        res.json({
            success: true,
            message: 'Medication added successfully',
            history: updatedHistory
        });
    } catch (err) {
        console.error('Add medication error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update allergies
exports.updateAllergies = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { allergicHistory } = req.body;

        let history = await MedicalHistory.findOne({ patient: patientId });

        if (history) {
            history.allergicHistory = allergicHistory;
            await history.save();
        } else {
            history = new MedicalHistory({
                patient: patientId,
                allergicHistory
            });
            await history.save();
        }

        const updatedHistory = await MedicalHistory.findById(history._id)
            .populate('patient', 'name email');

        res.json({
            success: true,
            message: 'Allergies updated successfully',
            history: updatedHistory
        });
    } catch (err) {
        console.error('Update allergies error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get medical history summary for doctor
exports.getHistorySummary = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        const history = await MedicalHistory.findOne({ patient: patientId })
            .select('allergicHistory cardiacCondition bloodType diseases medications')
            .populate('patient', 'name age');

        if (!history) {
            return res.json({
                success: true,
                summary: {
                    allergies: 'None recorded',
                    cardiacCondition: false,
                    bloodType: 'Unknown',
                    activeDiseases: [],
                    medications: []
                }
            });
        }

        const summary = {
            allergies: history.allergicHistory || 'None recorded',
            cardiacCondition: history.cardiacCondition,
            cardiacDetails: history.cardiacDetails,
            bloodType: history.bloodType || 'Unknown',
            activeDiseases: history.diseases.filter(d => d.status === 'active'),
            currentMedications: history.medications.filter(m => !m.endDate || new Date(m.endDate) > new Date())
        };

        res.json({
            success: true,
            summary
        });
    } catch (err) {
        console.error('Get history summary error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
