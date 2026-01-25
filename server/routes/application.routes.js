const express = require('express');
const { 
  submitApplication, 
  getCandidateApplications, 
  getJobApplications, 
  updateApplicationStatus,
  addRecruiterNotes,
  scheduleInterview,
  getShortlistedCandidates,
  withdrawApplication 
} = require('../controllers/application.controller');
const authenticateToken = require('../middleware/authenticateToken');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Candidate routes
router.post('/', authenticateToken, authorize(ROLES.CANDIDATE), submitApplication);
router.get('/candidate/my-applications', authenticateToken, authorize(ROLES.CANDIDATE), getCandidateApplications);
router.post('/:applicationId/withdraw', authenticateToken, authorize(ROLES.CANDIDATE), withdrawApplication);

// Recruiter routes
router.get('/job/:jobId', authenticateToken, authorize(ROLES.RECRUITER), getJobApplications);
router.put('/:applicationId/status', authenticateToken, authorize(ROLES.RECRUITER), updateApplicationStatus);
router.post('/:applicationId/notes', authenticateToken, authorize(ROLES.RECRUITER), addRecruiterNotes);
router.post('/:applicationId/interview', authenticateToken, authorize(ROLES.RECRUITER), scheduleInterview);
router.get('/job/:jobId/shortlisted', authenticateToken, authorize(ROLES.RECRUITER), getShortlistedCandidates);

module.exports = router;
