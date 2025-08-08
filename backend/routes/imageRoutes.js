const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateToken = require('../middlewares/authMiddleware');
const { uploadImage, getImages, searchImages, deleteImage } = require('../controllers/imageController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = `uploads/${req.user.id}`;
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const router = express.Router();

router.post('/upload', authenticateToken, upload.single('image'), uploadImage);
router.get('/', authenticateToken, getImages);
router.get('/search', authenticateToken, searchImages);
router.delete('/:id', authenticateToken, deleteImage);

module.exports = router;
