const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'A comment cannot be empty'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A comment must have an author'],
        },
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: [true, 'A comment must belong to a blog'],
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment', // For nested comments
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        likesCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
