const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

// Generic Like function for both Blog and Comment
exports.likeUnlike = (Model) =>
    catchAsync(async (req, res, next) => {
        const { id } = req.params; // Either blogId or commentId
        const userId = req.user.id; // Assuming the userId comes from the request body

        // Find the document by its ID
        const document = await Model.findById(id);

        if (!document) {
            return next(new AppError(`No ${Model.modelName.toLowerCase()} found with that ID`, 404));
        }

        // Check if the user has already liked the document
        const alreadyLiked = document.likes.includes(userId);

        if (alreadyLiked) {
            // Unlike the document (remove the user from the likes array)
            document.likes = document.likes.filter((like) => like.toString() !== userId.toString());
            document.likesCount -= 1; // Decrease like count
        } else {
            // Like the document (add the user to the likes array)
            document.likes.push(userId);
            document.likesCount += 1; // Increase like count
        }

        // Save the updated document
        await document.save();

        res.status(200).json({
            status: 'success',
            data: {
                likesCount: document.likesCount,
                userLiked: !alreadyLiked, // Indicates if the user liked or unliked the post
            },
        });
    });
