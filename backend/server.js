const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const folderRoutes = require('./routes/folderRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// Middleware


app.use(cors({
  origin: 'https://image-manager-lft2.vercel.app', // Single origin for simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204 // Explicitly set status for OPTIONS requests
}));
// app.options('*', cors());


app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads', { recursive: true });

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/images', imageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
// console.log("Registered routes:");
// app._router.stack.forEach(r => {
//   if (r.route && r.route.path) {
//     console.log(r.route.path);
//   }
// });

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
