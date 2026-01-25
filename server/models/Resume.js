const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // File information
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: Number,
    mimeType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    
    // Parsed resume data
    parsedData: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
      
      summary: String,
      
      // Extracted skills
      skills: [
        {
          name: String,
          level: String, // Beginner, Intermediate, Advanced, Expert
          yearsOfExperience: Number
        }
      ],
      
      // Work experience
      workExperience: [
        {
          jobTitle: String,
          company: String,
          location: String,
          startDate: Date,
          endDate: Date,
          isCurrently: Boolean,
          description: String,
          responsibilities: [String]
        }
      ],
      
      // Education
      education: [
        {
          degree: String,
          fieldOfStudy: String,
          school: String,
          startDate: Date,
          endDate: Date,
          gpa: String,
          activities: String
        }
      ],
      
      // Certifications
      certifications: [
        {
          name: String,
          issuer: String,
          issueDate: Date,
          expiryDate: Date,
          credentialId: String,
          credentialUrl: String
        }
      ],
      
      // Languages
      languages: [
        {
          name: String,
          proficiency: String
        }
      ],
      
      // Projects
      projects: [
        {
          name: String,
          description: String,
          technologies: [String],
          link: String
        }
      ]
    },
    
    // Raw resume text (for full-text search)
    rawText: String,
    
    // Processing status
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    processingError: String,
    
    // Metadata
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    
    // AI embeddings for similarity search
    embeddings: [Number], // Vector for resume-job matching
    
    // Indexed keywords for search
    keywords: [String],
    extractedKeywords: [String]
  },
  {
    timestamps: true
  }
);

// Index for search
resumeSchema.index({ candidateId: 1 });
resumeSchema.index({ 'parsedData.skills.name': 1 });
resumeSchema.index({ rawText: 'text' });

module.exports = mongoose.model('Resume', resumeSchema);
