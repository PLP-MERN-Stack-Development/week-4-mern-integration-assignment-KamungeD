const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Create a new category (protected)
router.post(
  '/',
  auth,
  [body('name').notEmpty().withMessage('Category name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const category = new Category({ name: req.body.name });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;