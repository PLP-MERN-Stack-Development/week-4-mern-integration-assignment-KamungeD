const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Create a new category (protected)
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const category = new Category({ name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;