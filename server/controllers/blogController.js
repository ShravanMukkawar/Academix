const Blog = require('../models/Blog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/User')

// Create a new blog
exports.createBlog = catchAsync(async (req, res, next) => {
    const tags = req.body.tags.map(tag => tag.toLowerCase());
    const blog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        tags: tags,
        author: req.user.id, // Assuming `req.user` is populated by auth middleware
    });

    res.status(201).json({
        status: 'success',
        data: {
            blog,
        },
    });
});

exports.getAllBlogs = catchAsync(async (req, res, next) => {
    let query = Blog.find();
    if (req.query.tags) {
        const tags = req.query.tags.split(',').map(tag => tag.trim().toLowerCase());
        query = query.find({ tags: { $in: tags } });
    }
    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    try {
        const blogs = await features.query.populate('author', 'name');
        const totalCount = await Blog.countDocuments(query.getFilter());

        res.status(200).json({
            status: 'success',
            results: blogs.length,
            totalCount,
            data: { blogs }
        });
    } catch (error) {
        console.error('Error during population:', error);
        return res.status(500).json({ message: 'Error during population' });
    }
});





// Get a single blog by ID
exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { viewsCount: 1 } },  // Increment viewsCount by 1
        {
            new: true,  // Return the updated document
            runValidators: true
        }
    ).populate('author', 'name email');

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            blog,
        },
    });
});

exports.isBlogAuthor = async (req, res, next) => {
    // Find the blog by ID
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    // Check if the current user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
};

// Update a blog by ID
exports.updateBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            blog,
        },
    });
});

// Delete a blog by ID
exports.deleteBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.searchBlogs = catchAsync(async (req, res, next) => {
    try {
        const { title, author } = req.query;

        // Construct a search query object
        const searchQuery = {};

        if (title) {
            searchQuery.title = { $regex: title, $options: 'i' };  // Case-insensitive search for title
        }

        // Only add author to query if it's provided
        let authorQuery = {};
        if (author) {
            authorQuery = { name: { $regex: author, $options: 'i' } };  // Case-insensitive search for author name
        }

        // Perform the search
        const blogs = await Blog.find(searchQuery)
            .populate({
                path: 'author',
                match: authorQuery,  // Apply the author query here
                select: 'name',  // Select only the name of the author
            });

        // Filter out blogs where author is not matched
        const filteredBlogs = blogs.filter(blog => blog.author);

        if (filteredBlogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found' });
        }

        // Send the result
        res.status(200).json({
            status: 'success',
            results: filteredBlogs.length,
            data: {
                blogs: filteredBlogs,
            },
        });
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
