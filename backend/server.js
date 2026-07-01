const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// CORS configuration - dynamic origin helper for cookie-based JWT authentication
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser for accessing authentication tokens
app.use(cookieParser());

// Serve static files from the public directory (Frontend build files)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));

// Simple Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running smoothly.' });
});

// Wildcard route to serve frontend client index.html for React routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
