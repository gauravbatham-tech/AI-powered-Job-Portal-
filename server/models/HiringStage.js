const mongoose = require('mongoose');

const hiringStageSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    
    stages: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: {
          type: String,
          required: true,
          enum: ['Application', 'Screening', 'Interview', 'Assessment', 'Offer', 'Final Decision']
        },
        description: String,
        order: Number,
        duration: Number, // in days
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],
    
    // Candidates in pipeline
    pipeline: [
      {
        applicationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Application'
        },
        candidateId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        currentStage: {
          type: mongoose.Schema.Types.ObjectId,
          // Reference to stage in stages array
        },
        stageEnteredDate: Date,
        stageNotes: String,
        feedback: String,
        rating: Number // 1-5
      }
    ],
    
    recruiterNotes: String,
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('HiringStage', hiringStageSchema);
