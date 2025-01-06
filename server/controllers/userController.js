const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/User')

exports.updateUser = catchAsync(async (req, res, next) => {
    const updates = {
        profilePic: req.body.profilePic,
    };

    // Only allow specific fields to be updated
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true, // Return the updated document
        runValidators: true, // Validate updates against the schema
    });

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
});




