const Resume = require('../models/Resume');
const User = require('../models/User');
const { parseResume } = require('../utils/resumeParser');

// Helper function to extract keywords
const extractKeywords = (text) => {
  if (!text) return [];
  const words = text.toLowerCase().split(/\s+/);
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'be', 'been']);
  return [...new Set(words.filter(w => w.length > 3 && !commonWords.has(w)))].slice(0, 50);
};

// Upload resume
exports.uploadResume = async (req, res) => {
  try {
    const { fileName, fileUrl, fileSize, mimeType, resumeText } = req.body;
    const candidateId = req.user.id;

    if (!fileName || !fileUrl || !resumeText) {
      return res.status(400).json({
        success: false,
        message: 'File name, URL, and resume text are required'
      });
    }

    const parsedData = parseResume(resumeText);

    const resume = new Resume({
      candidateId,
      fileName,
      fileUrl,
      fileSize,
      mimeType,
      rawText: resumeText,
      parsedData,
      processingStatus: 'completed',
      keywords: extractKeywords(resumeText)
    });

    await resume.save();

    const resumeCount = await Resume.countDocuments({ candidateId });
    if (resumeCount === 1) {
      resume.isDefault = true;
      await resume.save();
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume: ' + error.message
    });
  }
};

// Get candidate's resumes
exports.getCandidateResumes = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const resumes = await Resume.find({ candidateId })
      .select('-rawText')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      resumes
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes: ' + error.message
    });
  }
};

// Get resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (resume.candidateId.toString() !== req.user.id && req.user.role === 'candidate') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this resume'
      });
    }

    res.json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume: ' + error.message
    });
  }
};

// Set default resume
exports.setDefaultResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const candidateId = req.user.id;

    await Resume.updateMany(
      { candidateId, isDefault: true },
      { isDefault: false }
    );

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { isDefault: true },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.json({
      success: true,
      message: 'Default resume updated',
      resume
    });
  } catch (error) {
    console.error('Set default resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resume: ' + error.message
    });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const candidateId = req.user.id;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (resume.candidateId.toString() !== candidateId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this resume'
      });
    }

    await Resume.findByIdAndDelete(resumeId);

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume: ' + error.message
    });
  }
};

// Search resumes (recruiter)
exports.searchResumes = async (req, res) => {
  try {
    const { keyword, skill, minExperience, page = 1, limit = 10 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { 'rawText': { $regex: keyword, $options: 'i' } },
        { 'keywords': { $in: [keyword.toLowerCase()] } }
      ];
    }

    if (skill) {
      query['parsedData.skills.name'] = { $regex: skill, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const total = await Resume.countDocuments(query);
    const resumes = await Resume.find(query)
      .select('-rawText')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      resumes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching resumes: ' + error.message
    });
  }
};
