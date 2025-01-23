const express = require('express');
const router = express.Router();
const authController = require('../controllers/firebase-auth-controller');
const { sendnotification, submitToken } = require('../controllers/sendNotification');

router.post('/api/auth/register', authController.registerUser);
router.post('/api/auth/login', authController.loginUser);
router.post('/api/auth/reset-password', authController.resetPassword);
router.post('/api/auth/google-login', authController.googleLogin);
router.post('/api/auth/facebook-login', authController.facebookLogin);

router.get('/sendNotification', sendnotification);
router.post('/submitToken', submitToken);
router.post('/sendNotification', sendnotification);

module.exports = router;
