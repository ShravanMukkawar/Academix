const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A bookmark must belong to a user'],
        },
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: [true, 'A bookmark must belong to a blog'],
        },
    },
    {
        timestamps: true,
    }
);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;