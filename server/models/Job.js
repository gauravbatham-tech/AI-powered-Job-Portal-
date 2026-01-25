const mongoose = require('mongoose');
const { JOB_STATUS, EXPERIENCE_LEVELS, JOB_CATEGORIES } = require('../config/constants');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    requirements: [String],
    responsibilities: [String],
    
    // Job details
    category: {
      type: String,
      enum: Object.values(JOB_CATEGORIES),
      required: true
    },
    experienceLevel: {
      type: String,
      enum: Object.values(EXPERIENCE_LEVELS),
      required: true
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
      default: 'Full-time'
    },
    
    // Salary
    salaryMin: Number,
    salaryMax: Number,
    salaryCurrency: {
      type: String,
      default: 'USD'
    },
    
    // Location
    location: {
      city: String,
      state: String,
      country: String,
      isRemote: {
        type: Boolean,
        default: false
      }
    },
    
    // Skills required
    requiredSkills: [String],
    preferredSkills: [String],
    
    // Company/Recruiter info
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyName: String,
    companyLogoUrl: String,
    
    // Job status
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.OPEN
    },
    
    // Dates
    postedDate: {
      type: Date,
      default: Date.now
    },
    deadline: Date,
    closedDate: Date,
    
    // Application tracking
    applicationsCount: {
      type: Number,
      default: 0
    },
    viewsCount: {
      type: Number,
      default: 0
    },
    
    // Job visibility
    isPublished: {
      type: Boolean,
      default: true
    },
    
    // Additional details
    benefits: [String],
    aboutCompany: String,
    
    // AI/Search optimization
    keywords: [String],
    tags: [String]
  },
  {
    timestamps: true
  }
);

// Index for better search performance
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ recruiterId: 1, status: 1 });
jobSchema.index({ category: 1, experienceLevel: 1 });
jobSchema.index({ deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);
