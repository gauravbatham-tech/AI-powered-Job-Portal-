const express = require('express');
const { register, login, verifyEmail, forgotPassword, resetPassword, getCurrentUser } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;
