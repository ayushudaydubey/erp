const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Helper function to sign token and set cookie
const generateTokenAndResponse = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  // Cooke options for local dev
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    sameSite: 'lax',
    secure: false // Set to true if using HTTPS, false is safe for localhost HTTP
  };

  res.cookie('token', token, cookieOptions);
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  console.log("Register request received:", req.body);
  try {
    const { name, email, password } = req.body;

    // Validation checks
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields (name, email, password).' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    return generateTokenAndResponse(user, res);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation checks
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return generateTokenAndResponse(user, res);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });
  return res.status(200).json({ message: 'Logged out successfully.' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe
};
