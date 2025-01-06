const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController'); // Assuming you have authentication middleware
const Comment = require('../models/Comment');
const { likeUnlike } = require('../controllers/likeController');

const router = express.Router();

router.use(authController.protect);

// Public routes
router.route('/:blogId/comments')
    .get(commentController.getComments)
    .post(commentController.createComment); // Protect with authentication

// Protected routes (Only author can update or delete their comments)
router.route('/:blogId/comments/:commentId')
    .patch(commentController.isCommentAuthor, commentController.updateComment) // Ensure authentication and authorization
    .delete(commentController.isCommentAuthor, commentController.deleteComment); // Ensure authentication and authorization

router.route('/:id/like')
    .patch(likeUnlike(Comment));

module.exports = router;
