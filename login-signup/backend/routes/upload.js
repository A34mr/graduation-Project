const express = require('express');
const router = express.Router();
const {
    uploadImage,
    uploadMultipleImages,
    uploadDocument,
    handleMulterError
} = require('../middleware/upload');
const {
    uploadImage: uploadImageController,
    uploadMultipleImages: uploadMultipleController,
    uploadDocument: uploadDocumentController,
    deleteFile
} = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');

// All upload routes require authentication
router.use(auth);

// Upload single image
router.post('/image', uploadImage, handleMulterError, uploadImageController);

// Upload multiple images
router.post('/images', uploadMultipleImages, handleMulterError, uploadMultipleController);

// Upload document
router.post('/document', uploadDocument, handleMulterError, uploadDocumentController);

// Delete file
router.delete('/:filename', deleteFile);

module.exports = router;
