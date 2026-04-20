const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');

// Get all clinics with optional filtering
exports.getAllClinics = async (req, res) => {
    try {
        const { specialty, city, search, minRating, page = 1, limit = 10 } = req.query;

        // Build query
        let query = { approvalStatus: 'approved', isActive: true };

        // Filter by city
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }

        // Filter by specialty (search in related doctors)
        if (specialty) {
            const doctorIds = await Doctor.find({ specialty, approvalStatus: 'approved' }).distinct('_id');
            const clinicIds = await Doctor.find({ _id: { $in: doctorIds } }).distinct('clinic');
            query._id = { $in: clinicIds };
        }

        // Search by name
        if (search) {
            query.name = new RegExp(search, 'i');
        }

        // Filter by minimum rating
        if (minRating) {
            query['rating.average'] = { $gte: parseFloat(minRating) };
        }

        // Pagination
        const skip = (page - 1) * limit;

        const clinics = await Clinic.find(query)
            .sort({ 'rating.average': -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-password');

        const total = await Clinic.countDocuments(query);

        res.json({
            success: true,
            count: clinics.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            clinics
        });
    } catch (err) {
        console.error('Get clinics error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get single clinic by ID
exports.getClinicById = async (req, res) => {
    try {
        const { id } = req.params;

        const clinic = await Clinic.findById(id)
            .select('-password')
            .populate({
                path: '_id',
                populate: {
                    path: 'doctors',
                    model: 'Doctor',
                    select: 'name specialty profileImage rating'
                }
            });

        // Get doctors in this clinic
        const doctors = await Doctor.find({ clinic: id, approvalStatus: 'approved' })
            .select('name email specialty profileImage experience rating workingDays consultationPrice')
            .populate('clinic', 'name address');

        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        res.json({
            success: true,
            clinic,
            doctors
        });
    } catch (err) {
        console.error('Get clinic error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get clinic's doctors
exports.getClinicDoctors = async (req, res) => {
    try {
        const { id } = req.params;

        const doctors = await Doctor.find({ clinic: id })
            .select('-password')
            .populate('clinic', 'name address city');

        res.json({
            success: true,
            count: doctors.length,
            doctors
        });
    } catch (err) {
        console.error('Get clinic doctors error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create new clinic (for registration)
exports.createClinic = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            city,
            mapsLink,
            workingHours,
            description,
            services
        } = req.body;

        // Check if clinic already exists
        const existingClinic = await Clinic.findOne({ email });
        if (existingClinic) {
            return res.status(400).json({ message: 'Clinic with this email already exists' });
        }

        // Create clinic (pending approval)
        const clinic = new Clinic({
            name,
            email,
            password,
            phone,
            address,
            city,
            mapsLink,
            workingHours,
            description,
            services,
            approvalStatus: 'pending'
        });

        await clinic.save();

        res.status(201).json({
            success: true,
            message: 'Clinic registered successfully. Pending admin approval.',
            clinic: {
                id: clinic._id,
                name: clinic.name,
                email: clinic.email,
                approvalStatus: clinic.approvalStatus
            }
        });
    } catch (err) {
        console.error('Create clinic error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update clinic profile
exports.updateClinic = async (req, res) => {
    try {
        const clinicId = req.user.id;
        const updateData = req.body;

        // Prevent updating sensitive fields
        delete updateData.password;
        delete updateData.email;
        delete updateData.approvalStatus;
        delete updateData.rating;

        const clinic = await Clinic.findByIdAndUpdate(clinicId, updateData, { new: true }).select('-password');

        if (!clinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }

        res.json({
            success: true,
            message: 'Clinic updated successfully',
            clinic
        });
    } catch (err) {
        console.error('Update clinic error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Search clinics by location and specialization
exports.searchClinics = async (req, res) => {
    try {
        const { lat, lng, radius, specialty, city } = req.query;

        let query = { approvalStatus: 'approved', isActive: true };

        // City filter
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }

        // Specialty filter
        if (specialty) {
            const doctors = await Doctor.find({ specialty, approvalStatus: 'approved' });
            const clinicIds = doctors.map(d => d.clinic).filter(Boolean);
            query._id = { $in: clinicIds };
        }

        const clinics = await Clinic.find(query)
            .select('-password')
            .limit(20);

        res.json({
            success: true,
            count: clinics.length,
            clinics
        });
    } catch (err) {
        console.error('Search clinics error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get clinic statistics
exports.getClinicStats = async (req, res) => {
    try {
        const clinicId = req.user.id;

        // Get doctors count
        const doctorsCount = await Doctor.countDocuments({ clinic: clinicId });

        // Get appointments count
        const Appointment = require('../models/Appointment');
        const doctors = await Doctor.find({ clinic: clinicId }).distinct('_id');
        const appointmentsCount = await Appointment.countDocuments({ doctor: { $in: doctors } });

        // Get reviews count and average rating
        const clinic = await Clinic.findById(clinicId);

        res.json({
            success: true,
            stats: {
                doctorsCount,
                appointmentsCount,
                totalReviews: clinic.totalReviews || 0,
                averageRating: clinic.rating.average || 0
            }
        });
    } catch (err) {
        console.error('Get clinic stats error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
