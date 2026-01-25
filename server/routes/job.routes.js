const express = require('express');
const { createJob, getAllJobs, getJobById, updateJob, closeJob, getRecruiterJobs } = require('../controllers/job.controller');
const authenticateToken = require('../middleware/authenticateToken');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes - Recruiter
router.post('/', authenticateToken, authorize(ROLES.RECRUITER), createJob);
router.put('/:id', authenticateToken, authorize(ROLES.RECRUITER), updateJob);
router.post('/:id/close', authenticateToken, authorize(ROLES.RECRUITER), closeJob);
router.get('/recruiter/my-jobs', authenticateToken, authorize(ROLES.RECRUITER), getRecruiterJobs);

module.exports = router;
