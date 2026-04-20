const fs = require('fs');
const path = require('path');

// Upload dental images (X-rays, intraoral photos)
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const fileName = req.file.originalname;
        const fileSize = req.file.size;
        const fileType = req.file.mimetype;

        // Validate file type (only images)
        if (!fileType.startsWith('image/')) {
            // Delete uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('File deletion error:', err);
            });
            return res.status(400).json({ message: 'Only image files are allowed' });
        }

        // Validate file size (max 5MB)
        if (fileSize > 5 * 1024 * 1024) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('File deletion error:', err);
            });
            return res.status(400).json({ message: 'File size must be less than 5MB' });
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                url: fileUrl,
                name: fileName,
                size: fileSize,
                type: fileType
            }
        });
    } catch (err) {
        console.error('Upload image error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            name: file.originalname,
            size: file.size,
            type: file.mimetype
        }));

        res.json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully`,
            files: uploadedFiles
        });
    } catch (err) {
        console.error('Upload multiple images error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Upload medical document (PDF, etc.)
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const fileName = req.file.originalname;
        const fileSize = req.file.size;
        const fileType = req.file.mimetype;

        // Validate file type (PDF, DOC, DOCX)
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(fileType)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('File deletion error:', err);
            });
            return res.status(400).json({ message: 'Only PDF and Word documents are allowed' });
        }

        // Validate file size (max 10MB)
        if (fileSize > 10 * 1024 * 1024) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('File deletion error:', err);
            });
            return res.status(400).json({ message: 'File size must be less than 10MB' });
        }

        res.json({
            success: true,
            message: 'Document uploaded successfully',
            file: {
                url: fileUrl,
                name: fileName,
                size: fileSize,
                type: fileType
            }
        });
    } catch (err) {
        console.error('Upload document error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete uploaded file
exports.deleteFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('File deletion error:', err);
                return res.status(500).json({ message: 'Error deleting file' });
            }

            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        });
    } catch (err) {
        console.error('Delete file error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
