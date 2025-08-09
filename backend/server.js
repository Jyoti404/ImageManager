const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const folderRoutes = require('./routes/folderRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

const corsOptions = {
  origin: 'https://image-manager-lft2.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions)); // Handles all CORS requests
app.use(express.json());
app.use('/uploads', express.static('Uploads'));

if (!fs.existsSync('Uploads')) fs.mkdirSync('Uploads', { recursive: true });

try {
  connectDB();
} catch (err) {
  console.error('Error in connectDB:', err);
  process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));