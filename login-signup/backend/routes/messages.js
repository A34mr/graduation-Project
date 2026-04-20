const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getConversation,
    getConversations,
    markAsRead,
    deleteMessage,
    searchMessages,
    getUnreadCount
} = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

// All message routes require authentication
router.use(auth);

// Send message
router.post('/', sendMessage);

// Get all conversations
router.get('/conversations', getConversations);

// Get conversation with specific user
router.get('/conversation/:userId/:userModel', getConversation);

// Mark message as read
router.patch('/:id/read', markAsRead);

// Delete message
router.delete('/:id', deleteMessage);

// Search messages
router.get('/search', searchMessages);

// Get unread count
router.get('/unread/count', getUnreadCount);

module.exports = router;
