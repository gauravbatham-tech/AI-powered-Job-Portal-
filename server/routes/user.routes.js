const express = require('express');
const { getUserProfile, updateUserProfile, addExperience, addEducation, searchCandidates } = require('../controllers/user.controller');
const authenticateToken = require('../middleware/authenticateToken');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Get user profile
router.get('/profile/:id?', authenticateToken, getUserProfile);

// Update profile (protected)
router.put('/profile', authenticateToken, updateUserProfile);

// Add experience
router.post('/experience', authenticateToken, authorize(ROLES.CANDIDATE), addExperience);

// Add education
router.post('/education', authenticateToken, authorize(ROLES.CANDIDATE), addEducation);

// Search candidates (recruiters only)
router.get('/search-candidates', authenticateToken, authorize(ROLES.RECRUITER), searchCandidates);

module.exports = router;
