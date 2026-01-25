const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { calculateResumeJobMatch } = require('../utils/aiMatching');
const { APPLICATION_STATUS } = require('../config/constants');

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;
    const candidateId = req.user.id;

    // Validate input
    if (!jobId || !resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID and Resume ID are required'
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if resume exists
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      candidateId,
      isActive: true
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Calculate AI matching score
    const matchingResult = calculateResumeJobMatch(resume, job);

    // Create application
    const application = new Application({
      jobId,
      candidateId,
      recruiterId: job.recruiterId,
      resumeId,
      resumeText: resume.rawText,
      coverLetter,
      status: APPLICATION_STATUS.APPLIED,
      matchingScore: matchingResult.matchingScore,
      matchingDetails: matchingResult.matchingDetails,
      timeline: [
        {
          status: APPLICATION_STATUS.APPLIED,
          date: new Date(),
          notes: 'Application submitted'
        }
      ]
    });

    await application.save();

    // Increment job applications count
    job.applicationsCount = (job.applicationsCount || 0) + 1;
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        jobId: application.jobId,
        candidateId: application.candidateId,
        status: application.status,
        matchingScore: application.matchingScore,
        matchingDetails: application.matchingDetails,
        createdAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application: ' + error.message
    });
  }
};

// Get candidate's applications
exports.getCandidateApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const candidateId = req.user.id;

    const query = { candidateId, isActive: true };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('jobId', 'title companyName salaryMin salaryMax location')
      .populate('resumeId', 'fileName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get candidate applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications: ' + error.message
    });
  }
};

// Get job applications (for recruiter)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, sortBy = '-matchingScore', page = 1, limit = 10 } = req.query;

    // Check if job exists and user is the recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these applications'
      });
    }

    const query = { jobId, isActive: true };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('candidateId', 'firstName lastName email headline location')
      .populate('resumeId', 'fileName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortBy);

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications: ' + error.message
    });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is recruiter of the job
    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this application'
      });
    }

    // Validate status
    if (!Object.values(APPLICATION_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    application.status = status;

    // Add to timeline
    application.timeline.push({
      status,
      date: new Date(),
      notes,
      updatedBy: req.user.id
    });

    // Update shortlist flag if applicable
    if (status === APPLICATION_STATUS.SHORTLISTED) {
      application.isShortlisted = true;
      application.shortlistedDate = new Date();
    }

    // Update offer fields if applicable
    if (status === APPLICATION_STATUS.OFFERED) {
      application.offerSent = true;
      application.offerSentDate = new Date();
    }

    if (status === APPLICATION_STATUS.ACCEPTED) {
      application.offerAccepted = true;
      application.offerAcceptedDate = new Date();
    }

    if (status === APPLICATION_STATUS.REJECTED) {
      application.rejectedDate = new Date();
    }

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application: ' + error.message
    });
  }
};

// Add recruiter notes
exports.addRecruiterNotes = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Note is required'
      });
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add notes'
      });
    }

    application.recruiterNotes.push({
      note,
      createdBy: req.user.id,
      createdAt: new Date()
    });

    await application.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      recruiterNotes: application.recruiterNotes
    });
  } catch (error) {
    console.error('Add recruiter notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding notes: ' + error.message
    });
  }
};

// Schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { interviewDate, interviewType, notes } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to schedule interviews'
      });
    }

    application.interviews.push({
      date: new Date(interviewDate),
      type: interviewType,
      notes,
      interviewer: req.user.id
    });

    application.status = APPLICATION_STATUS.INTERVIEW_SCHEDULED;
    application.timeline.push({
      status: APPLICATION_STATUS.INTERVIEW_SCHEDULED,
      date: new Date(),
      notes: `Interview scheduled for ${interviewDate}`,
      updatedBy: req.user.id
    });

    await application.save();

    res.json({
      success: true,
      message: 'Interview scheduled successfully',
      application
    });
  } catch (error) {
    console.error('Schedule interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview: ' + error.message
    });
  }
};

// Get shortlisted candidates for a job
exports.getShortlistedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these applications'
      });
    }

    const skip = (page - 1) * limit;

    const applications = await Application.find({
      jobId,
      isShortlisted: true,
      isActive: true
    })
      .populate('candidateId', 'firstName lastName email headline location')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ matchingScore: -1 });

    const total = await Application.countDocuments({
      jobId,
      isShortlisted: true,
      isActive: true
    });

    res.json({
      success: true,
      shortlistedCandidates: applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get shortlisted candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shortlisted candidates: ' + error.message
    });
  }
};

// Withdraw application (by candidate)
exports.withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.candidateId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to withdraw this application'
      });
    }

    application.isActive = false;
    await application.save();

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application: ' + error.message
    });
  }
};
