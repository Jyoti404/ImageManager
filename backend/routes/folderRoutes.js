const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { getFolders, createFolder, deleteFolder, getFolderPath } = require('../controllers/folderController');

const router = express.Router();

router.get('/', authenticateToken, getFolders);
router.post('/', authenticateToken, createFolder);
router.delete('/:id', authenticateToken, deleteFolder);
router.get('/:id/path', authenticateToken, getFolderPath);

module.exports = router;
