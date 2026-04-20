const Message = require('../models/Message');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');

// Generate conversation ID (sorted participant IDs)
function generateConversationId(participant1, participant2) {
    const [first, second] = [participant1, participant2].sort();
    return `${first}_${second}`;
}

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, receiverModel, content, messageType, fileUrl, fileName } = req.body;
        const sender = req.user.id;
        const senderModel = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);

        // Validate required fields
        if (!receiver || !receiverModel || !content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate receiver model
        if (!['Patient', 'Doctor', 'Clinic'].includes(receiverModel)) {
            return res.status(400).json({ message: 'Invalid receiver model' });
        }

        // Verify receiver exists
        let receiverCollection;
        switch (receiverModel) {
            case 'Patient':
                receiverCollection = Patient;
                break;
            case 'Doctor':
                receiverCollection = Doctor;
                break;
            case 'Clinic':
                receiverCollection = Clinic;
                break;
        }

        const receiverExists = await receiverCollection.findById(receiver);
        if (!receiverExists) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Generate conversation ID
        const conversationId = generateConversationId(sender, receiver);

        // Create message
        const message = new Message({
            sender,
            senderModel,
            receiver,
            receiverModel,
            content,
            messageType: messageType || 'text',
            fileUrl: fileUrl || '',
            fileName: fileName || '',
            conversationId
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name')
            .populate('receiver', 'name');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            message: populatedMessage
        });
    } catch (err) {
        console.error('Send message error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get conversation messages
exports.getConversation = async (req, res) => {
    try {
        const { userId, userModel } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        const currentUserId = req.user.id;
        const currentUserModel = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);

        // Generate conversation ID
        const conversationId = generateConversationId(currentUserId, userId);

        // Verify user exists
        let userCollection;
        switch (userModel.toLowerCase()) {
            case 'patient':
                userCollection = Patient;
                break;
            case 'doctor':
                userCollection = Doctor;
                break;
            case 'clinic':
                userCollection = Clinic;
                break;
            default:
                return res.status(400).json({ message: 'Invalid user model' });
        }

        const userExists = await userCollection.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get messages
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('sender', 'name profileImage')
            .populate('receiver', 'name profileImage');

        // Mark unread messages as read (if current user is receiver)
        await Message.updateMany(
            {
                conversationId,
                receiver: currentUserId,
                isRead: false
            },
            {
                $set: { isRead: true, readAt: new Date() }
            }
        );

        const total = await Message.countDocuments({ conversationId });

        res.json({
            success: true,
            count: messages.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            messages: messages.reverse() // Return in chronological order
        });
    } catch (err) {
        console.error('Get conversation error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all conversations for current user
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        // Find all messages where user is sender or receiver
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { receiver: userId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$$ROOT' },
                    messageCount: { $sum: 1 }
                }
            }
        ]);

        // Get conversation participants
        const conversations = await Promise.all(
            messages.map(async m => {
                const msg = m.lastMessage;
                const otherUserId = msg.sender.toString() === userId ? msg.receiver : msg.sender;
                const otherUserModel = msg.sender.toString() === userId ? msg.receiverModel : msg.senderModel;

                let userCollection;
                switch (otherUserModel.toLowerCase()) {
                    case 'patient':
                        userCollection = Patient;
                        break;
                    case 'doctor':
                        userCollection = Doctor;
                        break;
                    case 'clinic':
                        userCollection = Clinic;
                        break;
                }

                const otherUser = await userCollection.findById(otherUserId).select('name profileImage');

                // Count unread messages
                const unreadCount = await Message.countDocuments({
                    conversationId: msg.conversationId,
                    receiver: userId,
                    isRead: false
                });

                return {
                    conversationId: msg.conversationId,
                    otherUser: {
                        id: otherUserId,
                        name: otherUser?.name,
                        profileImage: otherUser?.profileImage,
                        model: otherUserModel
                    },
                    lastMessage: msg,
                    messageCount: m.messageCount,
                    unreadCount
                };
            })
        );

        res.json({
            success: true,
            count: conversations.length,
            conversations
        });
    } catch (err) {
        console.error('Get conversations error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (message.receiver.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        message.isRead = true;
        message.readAt = new Date();
        await message.save();

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (err) {
        console.error('Mark as read error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only sender or admin can delete
        if (role !== 'admin' && message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await message.deleteOne();

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (err) {
        console.error('Delete message error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Search messages
exports.searchMessages = async (req, res) => {
    try {
        const { query, conversationId } = req.query;
        const userId = req.user.id;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        let searchQuery = {
            conversationId: { $in: [] },
            content: new RegExp(query, 'i')
        };

        // Get conversation IDs where user is participant
        const conversations = await Message.distinct('conversationId', {
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        });

        searchQuery.conversationId.$in = conversations;

        const messages = await Message.find(searchQuery)
            .limit(20)
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (err) {
        console.error('Search messages error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await Message.countDocuments({
            receiver: userId,
            isRead: false
        });

        res.json({
            success: true,
            unreadCount: count
        });
    } catch (err) {
        console.error('Get unread count error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
