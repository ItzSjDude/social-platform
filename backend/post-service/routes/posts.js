const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new post
router.post('/posts', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const newPost = new Post({
      content,
      author: req.userId
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').populate('comments');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
