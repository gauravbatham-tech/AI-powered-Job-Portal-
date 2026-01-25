const Job = require('../models/Job');
const { formatJobResponse } = require('../utils/tokenUtils');
const { validateJobForm } = require('../middleware/validation');
const { JOB_STATUS } = require('../config/constants');

// Create a job posting
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      category,
      experienceLevel,
      employmentType,
      salaryMin,
      salaryMax,
      location,
      requiredSkills,
      preferredSkills,
      companyName,
      benefits,
      aboutCompany,
      deadline
    } = req.body;

    // Validate input
    const validation = validateJobForm(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Create job
    const job = new Job({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      category,
      experienceLevel,
      employmentType,
      salaryMin: salaryMin ? parseInt(salaryMin) : null,
      salaryMax: salaryMax ? parseInt(salaryMax) : null,
      location,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : [],
      recruiterId: req.user.id,
      companyName,
      benefits: Array.isArray(benefits) ? benefits : [],
      aboutCompany,
      deadline: deadline ? new Date(deadline) : null,
      keywords: [title, category, ...requiredSkills],
      tags: [experienceLevel, location.city]
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: formatJobResponse(job)
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job: ' + error.message
    });
  }
};

// Get all jobs with filtering and search
exports.getAllJobs = async (req, res) => {
  try {
    const { 
      keyword, 
      category, 
      experienceLevel, 
      location, 
      salaryMin,
      salaryMax,
      isRemote,
      page = 1, 
      limit = 10 
    } = req.query;

    const query = { status: JOB_STATUS.OPEN, isPublished: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    if (isRemote === 'true') {
      query['location.isRemote'] = true;
    }

    if (salaryMin || salaryMax) {
      query.salaryMin = query.salaryMin || {};
      if (salaryMin) query.salaryMin = { $gte: parseInt(salaryMin) };
      if (salaryMax) query.salaryMax = { $lte: parseInt(salaryMax) };
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('recruiterId', 'firstName lastName company')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs: jobs.map(formatJobResponse),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs: ' + error.message
    });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('recruiterId', 'firstName lastName company profileImage');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job: formatJobResponse(job)
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job: ' + error.message
    });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the recruiter who posted the job
    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this job'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'description', 'requirements', 'responsibilities', 
                          'requiredSkills', 'preferredSkills', 'salaryMin', 'salaryMax', 
                          'deadline', 'status', 'benefits'];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        job[key] = updates[key];
      }
    });

    await job.save();

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: formatJobResponse(job)
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job: ' + error.message
    });
  }
};

// Close job
exports.closeJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to close this job'
      });
    }

    job.status = JOB_STATUS.CLOSED;
    job.closedDate = new Date();
    await job.save();

    res.json({
      success: true,
      message: 'Job closed successfully',
      job: formatJobResponse(job)
    });
  } catch (error) {
    console.error('Close job error:', error);
    res.status(500).json({
      success: false,
      message: 'Error closing job: ' + error.message
    });
  }
};

// Get recruiter's jobs
exports.getRecruiterJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { recruiterId: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs: jobs.map(formatJobResponse),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recruiter jobs: ' + error.message
    });
  }
};
