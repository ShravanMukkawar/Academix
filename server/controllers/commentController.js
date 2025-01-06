const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Create a new comment on a blog
exports.createComment = catchAsync(async (req, res, next) => {
    // Find the blog that the comment is related to
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    // Create the comment
    const comment = await Comment.create({
        content: req.body.content,
        author: req.user.id,  // Assuming the user is authenticated
        blog: req.params.blogId,
        parentComment: req.body.parentComment || null,  // Optional, for nested comments
    });

    res.status(201).json({
        status: 'success',
        data: {
            comment,
        },
    });
});

// Get all comments for a blog
exports.getComments = catchAsync(async (req, res, next) => {
    let query = Comment.find({ blog: req.params.blogId });

    // Apply sorting based on query parameter (e.g., sort=createdAt or sort=-likesCount)
    if (req.query.sort) {
        query = query.sort(req.query.sort);
    }

    // Execute the query and populate author details
    const comments = await query.populate('author', 'name email');

    if (!comments) {
        return next(new AppError('No comments found for this blog', 404));
    }

    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: {
            comments,
        },
    });
});


exports.isCommentAuthor = async (req, res, next) => {
    // Find the blog by ID
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    // Check if the current user is the author of the comment
    if (comment.author.toString() !== req.user.id) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
};

// Update a comment
exports.updateComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    // Update the comment
    comment.content = req.body.content || comment.content;
    await comment.save();

    res.status(200).json({
        status: 'success',
        data: {
            comment,
        },
    });
});

// Delete a comment
exports.deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);

    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
