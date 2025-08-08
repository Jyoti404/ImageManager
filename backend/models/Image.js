const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
  size: { type: Number },
  mimeType: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
