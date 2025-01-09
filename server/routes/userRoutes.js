const express = require('express');
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const router = express.Router();

// router.get('/hi', userController.);
router.post('/register', authController.signup);
router.post('/verifySignupEmailOTP', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updateMe', userController.updateUser);
router.get('/me', authController.getUserData);


module.exports = router;