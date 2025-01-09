const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A blog must have a title'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'A blog must have content'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A blog must have an author'],
        },
        tags: {
            type: [String],
            index: true,
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // unique: true, // To ensure unique user likes
        }],
        likesCount: {
            type: Number,
            default: 0,
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
