const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const multer = require('multer');

// Validation rules
const postValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

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

// Slugify function
const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

// Get all posts (with pagination and search)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const category = req.query.category || "";

  // Build filter object
  let filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }
  if (category) {
    filter.category = category;
  }

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username')
      .populate('category', 'name'),
    Post.countDocuments(filter)
  ]);

  res.json({
    posts,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
});

// Get single post
router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'username')
        .populate('category', 'name');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

// Create post (with image upload)
router.post('/', auth, upload.single('featuredImage'), postValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      author: req.user.id,
      featuredImage: req.file ? `/uploads/${req.file.filename}` : undefined,
      isPublished: req.body.isPublished === "true", // <-- Ensure isPublished is a boolean
      slug: slugify(req.body.title), // <-- TEMP SLUG MANUALLY SET
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err); // <--- This line shows the error in the terminal
    res.status(500).json({ error: err.message });
  }
});

// Update post (with image upload)
router.put('/:id', auth, upload.single('featuredImage'), postValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: 'Unauthorized' });

    post.title = req.body.title;
    post.content = req.body.content;
    post.category = req.body.category;
    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
});

// Add a comment to a post
router.post('/:id/comments', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text is required" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.comments.push({ user: req.user.id, text });
  await post.save();

  // Populate the user field for the new comment
  await post.populate('comments.user', 'username');
  res.status(201).json(post.comments[post.comments.length - 1]);
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('comments.user', 'username');
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post.comments);
});

module.exports = router;