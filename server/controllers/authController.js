//email mis to be change from env while sending mail

const jwt = require('jsonwebtoken');
const User = require('../models/User')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const nodemailer = require('nodemailer')
const sendEmail = require('./../utils/email');
const { passwordResetEmail, otpVerificationEmail } = require('./../helpers/EmailTemplate');
const crypto = require('crypto');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


const createSendToken = (user, statusCode, req, res) => {
    const tokenData = {
        id: user._id,
        email: user.email,
        // role: user.role,
        mis: user.mis
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    user.password = undefined;

    res.status(statusCode).cookie('token', token, { maxAge: 9000000, httpOnly: true, secure: true, }).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};


exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm, mis, profilePic } = req.body;

    // Validate password and passwordConfirm
    if (password !== passwordConfirm) {
        return next(new AppError('Passwords do not match!', 400));
    }
    const user = await User.findOne({ email: email }); // Use await to resolve the promise

    if (user) { // Check if user exists
        console.log(user.email);
        return next(new AppError('Duplicate Email Found.', 401));
    }

    // If no user found, continue with your next logic


    // Generate a 6-digit integer OTP
    const Emailotp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP

    // Hash the OTP
    const hashedOtp = crypto
        .createHash('sha256')
        .update(Emailotp)
        .digest('hex');

    const EmailotpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    const randomString = generateRandomString(6);
    const modifiedEmail = "notverified" + randomString + email;
    // const modifiedMIS = "notverified" + randomString + mis;
    // Create new user with hashed OTP and its expiration
    const newUser = await User.create({
        name,
        profilePic,
        email: modifiedEmail,
        password,
        passwordConfirm,
        role: "User",
        mis,
        Emailotp: hashedOtp,
        EmailotpExpires
    });

    console.log(newUser);

    // Send the original OTP via email
    const message = `Your OTP code is ${Emailotp}  . It will expire in 10 minutes.`;
    console.log(message);
    try {
        // await sendEmail({
        //     email: email,
        //     subject: 'Your OTP for Signup (valid for 10 min)',
        //     html: otpVerificationEmail(name, Emailotp)
        // });

    } catch (err) {
        // Clean up user data if email sending fails
        newUser.Emailotp = undefined;
        newUser.EmailotpExpires = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
    createSendToken(newUser, 200, req, res);
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user still exists
    console.log("😍😒😂🔥🤣", req.body.Emailotp);
    // console.log(decoded);
    const hashedOtp = crypto
        .createHash('sha256')
        .update(req.body.Emailotp)
        .digest('hex');
    const realEmail = decoded.email;
    const realEmail1 = realEmail.slice(17); // Adjust based on your slicing logic
    const user = await User.findOne({ email: realEmail1 }); // Use await to resolve the promise
    // console.log(user);
    // const realMIS = user.mis;
    // const realMIS1 = realMIS.slice(17); // Adjust based on your slicing logic

    console.log(decoded.email);
    if (user) { // Check if user exists
        console.log(user.email);
        return next(new AppError('Duplicate Email Found.', 401));
    }

    // If no user found, continue with your next logic
    console.log(decoded);

    const oldUser = await User.findOne({
        $and: [
            { email: decoded.email }, // Match the email
            { Emailotp: hashedOtp }, // Match the hashed OTP
            { EmailotpExpires: { $gt: Date.now() } } // Ensure OTP has not expired
        ]
    });

    if (!oldUser) {
        return next(
            new AppError(
                'Invalid User Please do not verify otp',
                401
            )
        );
    }
    await User.findByIdAndUpdate(
        oldUser._id,            // Find the user by their ID
        { email: realEmail1 }   // Update the email field with `realEmail1`
    );
    oldUser.email = realEmail1;
    res.status(200).clearCookie('token').json({
        status: 'success', token,
        data: {
            oldUser
        }
    });
    // createSendToken(newUser, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { userkey, password } = req.body;
    // 1) Check if email and password exist
    if (!userkey) {
        return next(new AppError('Please provide emamil!', 400));
    }
    if (!userkey || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    var user;
    if (userkey) {
        user = await User.findOne({ email: userkey }).select('+password');
    }
    if (!user) {
        user = await User.findOne({ mis: userkey }).select('+password');
    }
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        maxAge: 9000,
        httpOnly: true
    });
    res.status(200).clearCookie('token').json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    var user;
    if (req.body.userkey) {
        user = await User.findOne({ email: req.body.userkey });
    }
    if (!user) {
        user = await User.findOne({ mis: req.body.userkey });
    }
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    // console.log("Before saving:", user);
    await user.save({ validateBeforeSave: false });
    // console.log("After saving:", user);

    // await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    console.log(resetURL);
    try {
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Your password reset token (valid for 10 min)',
        //     html: passwordResetEmail(user, resetURL)
        // });
        console.log("😒😒😒😒", resetToken);
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        console.log(err);
        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});

exports.getNameByMIS = async (req, res) => {
    try {
        const { mis } = req.params;

        // 1. Find the user by their MIS
        const user = await User.findOne({ mis });
        console.log(user.name)
        // 2. Check if the user exists
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: `No user found with MIS: ${mis}`,
            });
        }

        // 3. Return the user's name
        res.status(200).json({
            status: 'success',
            data: {
                name: user.name,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};
  
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
});
