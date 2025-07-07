const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) return res.status(400).json({ error: 'User already exists' });

      user = new User({ username: req.body.username, password: req.body.password });
      await user.save();

      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      const isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;