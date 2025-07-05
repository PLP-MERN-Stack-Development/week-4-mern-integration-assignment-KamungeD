const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Get all posts (with pagination and search)
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const posts = await Post.find(query)
        .populate('author', 'username')
        .populate('category', 'name')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    res.json(posts);
});

// Get single post
router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'username')
        .populate('category', 'name');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// Create post (protected, with image upload)
router.post('/', auth, upload.single('featuredImage'), async (req, res) => {
    const { title, content, category } = req.body;
    const featuredImage = req.file ? `/uploads/${req.file.filename}` : undefined;
    try {
        const post = new Post({
            title,
            content,
            category,
            author: req.user.id,
            featuredImage
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update post (protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' });

        Object.assign(post, req.body);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete post (protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.author.toString() !== req.user.id)
            return res.status(403).json({ error: 'Unauthorized' });

        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;