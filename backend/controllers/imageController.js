const Image = require('../models/Image');
const Folder = require('../models/Folder');
const fs = require('fs');

// UPLOAD IMAGE
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { name, folderId } = req.body;
    const folder = await Folder.findOne({ _id: folderId, userId: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const image = new Image({
      name: name || req.file.originalname,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      userId: req.user.id,
      folderId,
      size: req.file.size,
      mimeType: req.file.mimetype
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET IMAGES
exports.getImages = async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = { userId: req.user.id };
    if (folderId) query.folderId = folderId;

    const images = await Image.find(query)
      .populate('folderId', 'name path')
      .sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// SEARCH IMAGES
exports.searchImages = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });

    const images = await Image.find({
      userId: req.user.id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { originalName: { $regex: q, $options: 'i' } }
      ]
    }).populate('folderId', 'name path')
      .sort({ createdAt: -1 });

    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE IMAGE
exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, userId: req.user.id });
    if (!image) return res.status(404).json({ message: 'Image not found' });

    if (fs.existsSync(image.filePath)) {
      fs.unlinkSync(image.filePath);
    }

    await Image.deleteOne({ _id: req.params.id });
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
