const express = require('express');
const { 
  getPlatformStats, 
  getAllUsers, 
  verifyUser, 
  deactivateUser,
  getJobAnalytics,
  getApplicationAnalytics,
  getTopRecruiters,
  getTopCandidates
} = require('../controllers/admin.controller');
const authenticateToken = require('../middleware/authenticateToken');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();

// All admin routes are protected
router.get('/stats', authenticateToken, authorize(ROLES.ADMIN), getPlatformStats);
router.get('/users', authenticateToken, authorize(ROLES.ADMIN), getAllUsers);
router.post('/users/:userId/verify', authenticateToken, authorize(ROLES.ADMIN), verifyUser);
router.post('/users/:userId/deactivate', authenticateToken, authorize(ROLES.ADMIN), deactivateUser);
router.get('/analytics/jobs', authenticateToken, authorize(ROLES.ADMIN), getJobAnalytics);
router.get('/analytics/applications', authenticateToken, authorize(ROLES.ADMIN), getApplicationAnalytics);
router.get('/top-recruiters', authenticateToken, authorize(ROLES.ADMIN), getTopRecruiters);
router.get('/top-candidates', authenticateToken, authorize(ROLES.ADMIN), getTopCandidates);

module.exports = router;
