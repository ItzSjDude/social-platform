const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add a comment to a post
router.post('/comments', authMiddleware, async (req, res) => {
  const { content, postId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = new Comment({
      content,
      post: postId,
      author: req.userId
    });
    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get comments for a post
router.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ post: postId }).populate('author', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
