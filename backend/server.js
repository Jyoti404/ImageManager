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


const corsOptions = {
  origin: 'https://image-manager-lft2.vercel.app', // Your frontend's origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
// app.options('*', cors());
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests (required for CORS)
// app.options('*', cors(corsOptions));


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
