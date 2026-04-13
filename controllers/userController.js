const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  let { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  try {
    const isMasterEmail = email.toLowerCase() === 'gv@gmail.com';
    const isAdminEmail = email.toLowerCase() === 'adminjeevi@gmail.com' || email.toLowerCase() === 'admin@gmail.com';
    const isMasterPassword = password === 'gvs' || process.env.NODE_ENV === 'development';
    const isAdminPassword = password === 'jeevi' || process.env.NODE_ENV === 'development';
    
    if (isMasterEmail && isMasterPassword) {
      console.log('DEMO MODE: Master login successful');
      return res.json({
        _id: '5f1a2b3c4d5e6f7a8b9c0d12',
        name: 'GV',
        email: 'gv@gmail.com',
        isAdmin: false,
        token: generateToken('5f1a2b3c4d5e6f7a8b9c0d12', 'GV', false),
      });
    }

    if (isAdminEmail && isAdminPassword) {
      console.log('DEMO MODE: Admin login successful');
      return res.json({
        _id: 'admin_id_12345',
        name: 'Admin Jeevi',
        email: 'adminjeevi@gmail.com',
        isAdmin: true,
        token: generateToken('admin_id_12345', 'Admin Jeevi', true),
      });
    }

    // SEARCH DB: If connected, check the real database
    if (mongoose.connection.readyState === 1) {
      // Search with case-insensitive regex for robustness
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id, user.name, user.isAdmin),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      // Database not connected: Default to logging in as GV if using master email
      if (email.toLowerCase() === 'gv@gmail.com') {
        return res.json({
          _id: '5f1a2b3c4d5e6f7a8b9c0d12',
          name: 'GV',
          email: 'gv@gmail.com',
          isAdmin: false,
          token: generateToken('5f1a2b3c4d5e6f7a8b9c0d12', 'GV', false),
        });
      }
      
      return res.status(503).json({ 
        message: 'Database is offline. To test, please use the demo account: gv@gmail.com (any password)' 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  let { name, email, password } = req.body;
  email = email.toLowerCase();

  try {
    // 1. Check if user already exists (ONLY if database is connected)
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'already have an account go to login' });
      }
    }

    // 2. FALLBACK: Allow registration to succeed in Demo Mode even if DB is disconnected
    if (mongoose.connection.readyState !== 1) {
      console.log(`DEMO MODE: Registration handled for ${email} (Database Offline)`);
      return res.status(201).json({
        _id: '5f1a2b3c4d5e6f7a8b9c0d12',
        name: name || 'GV',
        email,
        isAdmin: false,
        token: generateToken('5f1a2b3c4d5e6f7a8b9c0d12', name || 'GV', false),
      });
    }

    const isDemoEmail = ['gv@gmail.com', 'gvs@gmail.com'].includes(email.toLowerCase());
    if (isDemoEmail) {
      console.log(`DEMO MODE: Master email registration handled for ${email}`);
      return res.status(201).json({
        _id: '5f1a2b3c4d5e6f7a8b9c0d12',
        name,
        email,
        isAdmin: false,
        token: generateToken('5f1a2b3c4d5e6f7a8b9c0d12', name, false),
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id, user.name, user.isAdmin),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer list: ' + error.message });
  }
};

module.exports = {
  authUser,
  getUserProfile,
  registerUser,
  getUsers,
};