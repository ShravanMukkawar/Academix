const Blog = require('../models/Blog');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Create a new blog
exports.createBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        author: req.user.id, // Assuming `req.user` is populated by auth middleware
    });

    res.status(201).json({
        status: 'success',
        data: {
            blog,
        },
    });
});

// Get all blogs
exports.getAllBlogs = catchAsync(async (req, res, next) => {
    let query = Blog.find();

    // Handle tag filtering
    if (req.query.tags) {
        const tags = req.query.tags.split(',').map(tag => tag.trim());
        query = query.find({ tags: { $in: tags } });
    }

    // Handle search query filtering (search by title or content)
    if (req.query.search) {
        const searchTerm = req.query.search.trim();
        query = query.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } }, // case-insensitive search on title
                { content: { $regex: searchTerm, $options: 'i' } } // case-insensitive search on content
            ]
        });
    }

    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const blogs = await features.query.populate('author', 'name');
    const totalCount = await Blog.countDocuments(query.getFilter());

    res.status(200).json({
        status: 'success',
        results: blogs.length,
        totalCount,
        data: { blogs }
    });
});


// Get a single blog by ID
exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');

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
