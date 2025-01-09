const express = require('express');
const blogController = require('./../controllers/blogController');
const authController = require('./../controllers/authController');
const { likeUnlike } = require('../controllers/likeController');
const Blog = require('../models/Blog');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.get('/search', blogController.searchBlogs)

router
    .route('/')
    .get(blogController.getAllBlogs)
    .post(blogController.createBlog); // Add auth middleware as needed

// Protected routes
router
    .route('/:id')
    .get(blogController.getBlog)
    .patch(blogController.isBlogAuthor, blogController.updateBlog)  // Add the middleware
    .delete(blogController.isBlogAuthor, blogController.deleteBlog); // Add the middleware

router
    .route('/:id/like')
    .patch(likeUnlike(Blog))


module.exports = router;