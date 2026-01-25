const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../config/constants');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Resume information
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    resumeText: String, // For easy searching and AI matching
    
    // Application status
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED
    },
    
    // AI Matching Score
    matchingScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    matchingDetails: {
      skillsMatch: Number,
      experienceMatch: Number,
      educationMatch: Number,
      overallFit: String // High, Medium, Low
    },
    
    // Cover letter and additional info
    coverLetter: String,
    additionalInfo: String,
    
    // Application history/timeline
    timeline: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now
        },
        notes: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    
    // Interview tracking
    interviews: [
      {
        date: Date,
        type: String,
        notes: String,
        feedback: String,
        rating: Number,
        interviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    
    // Recruiter notes
    recruiterNotes: [
      {
        note: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    
    // Shortlist info
    isShortlisted: Boolean,
    shortlistedDate: Date,
    
    // Offer details
    offerSent: Boolean,
    offerSentDate: Date,
    offerAccepted: Boolean,
    offerAcceptedDate: Date,
    
    // Rejection details
    rejectionReason: String,
    rejectedDate: Date,
    
    // Flags
    isViewed: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
applicationSchema.index({ jobId: 1, candidateId: 1, unique: true });
applicationSchema.index({ recruiterId: 1, status: 1 });
applicationSchema.index({ candidateId: 1, status: 1 });
applicationSchema.index({ matchingScore: -1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
