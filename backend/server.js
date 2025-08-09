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
  methods: ['GET', 'POST',  'PUT', 'DELETE','OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static('uploads'));


if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });


connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
