const { User, Patient, Doctor, Admin } = require('./User');
const Clinic = require('./Clinic');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const Image = require('./Image');
const Review = require('./Review');
const Complaint = require('./Complaint');
const Message = require('./Message');
const Payment = require('./Payment');
const Notification = require('./Notification');

module.exports = {
    User,
    Patient,
    Doctor,
    Admin,
    Clinic,
    Appointment,
    MedicalRecord,
    Image,
    Review,
    Complaint,
    Message,
    Payment,
    Notification
};
