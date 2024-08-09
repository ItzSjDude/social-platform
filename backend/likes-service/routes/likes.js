const express = require('express');
const Like = require('../models/Like');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Like a post
router.post('/likes', authMiddleware, async (req, res) => {
  const { postId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const existingLike = await Like.findOne({ post: postId, user: req.userId });
    if (existingLike) return res.status(400).json({ error: 'Already liked' });

    const newLike = new Like({
      post: postId,
      user: req.userId
    });
    await newLike.save();

    post.likes += 1;
    await post.save();

    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get likes for a post
router.get('/likes/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const likes = await Like.find({ post: postId }).populate('user', 'username');
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
