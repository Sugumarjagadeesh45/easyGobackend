const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Registration = require('../models/Registration');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// Phone number verification endpoint
router.post('/verify-phone', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    // Check if user exists
    const user = await Registration.findOne({ phoneNumber });
    
    if (user) {
      // User exists - sign in
      const token = generateToken(user._id);
      return res.json({ 
        success: true, 
        token,
        user: { name: user.name, phoneNumber: user.phoneNumber }
      });
    } else {
      // User doesn't exist - sign up
      return res.json({ 
        success: true, 
        newUser: true 
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Check if phone number already exists
    const existingUser = await Registration.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const newUser = new Registration({
      name,
      phoneNumber
    });

    await newUser.save();
    
    const token = generateToken(newUser._id);
    
    res.status(201).json({ 
      success: true,
      token,
      user: { name: newUser.name, phoneNumber: newUser.phoneNumber }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;