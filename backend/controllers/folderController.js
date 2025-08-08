const Folder = require('../models/Folder');
const Image = require('../models/Image');
const fs = require('fs');

// GET USER FOLDERS
exports.getFolders = async (req, res) => {
  try {
    const { parentId } = req.query;
    const folders = await Folder.find({
      userId: req.user.id,
      parentId: parentId || null
    }).sort({ createdAt: -1 });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE FOLDER
exports.createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    let path = '/';
    if (parentId) {
      const parentFolder = await Folder.findOne({ _id: parentId, userId: req.user.id });
      if (!parentFolder) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      path = parentFolder.path === '/' ? `/${name}` : `${parentFolder.path}/${name}`;
    } else {
      path = `/${name}`;
    }

    const folder = new Folder({ name, userId: req.user.id, parentId: parentId || null, path });
    await folder.save();

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE FOLDER (and its contents)
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    if (folder.parentId === null) {
      return res.status(400).json({ message: 'Cannot delete root folder' });
    }

    // Delete images in folder
    const images = await Image.find({ folderId: folder._id, userId: req.user.id });
    for (let image of images) {
      if (fs.existsSync(image.filePath)) {
        fs.unlinkSync(image.filePath);
      }
    }
    await Image.deleteMany({ folderId: folder._id, userId: req.user.id });

    // Recursively delete subfolders
    async function deleteSubfolders(parentId) {
      const subfolders = await Folder.find({ parentId, userId: req.user.id });
      for (let subfolder of subfolders) {
        await deleteSubfolders(subfolder._id);

        const subImages = await Image.find({ folderId: subfolder._id, userId: req.user.id });
        for (let img of subImages) {
          if (fs.existsSync(img.filePath)) {
            fs.unlinkSync(img.filePath);
          }
        }
        await Image.deleteMany({ folderId: subfolder._id, userId: req.user.id });
        await Folder.deleteOne({ _id: subfolder._id });
      }
    }

    await deleteSubfolders(folder._id);
    await Folder.deleteOne({ _id: folder._id });

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET BREADCRUMB PATH
exports.getFolderPath = async (req, res) => {
  try {
    const folderId = req.params.id;
    const breadcrumb = [];

    let currentFolder = await Folder.findOne({ _id: folderId, userId: req.user.id });
    while (currentFolder) {
      breadcrumb.unshift({
        id: currentFolder._id,
        name: currentFolder.name,
        path: currentFolder.path
      });
      if (currentFolder.parentId) {
        currentFolder = await Folder.findOne({ _id: currentFolder.parentId, userId: req.user.id });
      } else {
        break;
      }
    }

    res.json(breadcrumb);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
