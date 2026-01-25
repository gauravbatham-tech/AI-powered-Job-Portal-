const express = require('express');
const { uploadResume, getCandidateResumes, getResumeById, setDefaultResume, deleteResume, searchResumes } = require('../controllers/resume.controller');
const authenticateToken = require('../middleware/authenticateToken');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../config/constants');

const router = express.Router();

// Candidate routes
router.post('/', authenticateToken, authorize(ROLES.CANDIDATE), uploadResume);
router.get('/', authenticateToken, authorize(ROLES.CANDIDATE), getCandidateResumes);
router.get('/:resumeId', authenticateToken, getResumeById);
router.put('/:resumeId/default', authenticateToken, authorize(ROLES.CANDIDATE), setDefaultResume);
router.delete('/:resumeId', authenticateToken, authorize(ROLES.CANDIDATE), deleteResume);

// Recruiter routes - Search resumes
router.get('/search', authenticateToken, authorize(ROLES.RECRUITER), searchResumes);

module.exports = router;
