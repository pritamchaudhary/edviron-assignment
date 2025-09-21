const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Utility to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({ success: false, message: 'That username is already taken' });
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please log in.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};