const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'receiverModel',
        required: true,
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Patient', 'Doctor', 'Clinic'],
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['Patient', 'Doctor', 'Clinic'],
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text',
    },
    fileUrl: {
        type: String,
        default: '',
    },
    fileName: {
        type: String,
        default: '',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
