const User = require('../models/User');
const { formatUserResponse } = require('../utils/tokenUtils');
const { validateEmail } = require('../middleware/validation');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user profile: ' + error.message 
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, headline, bio, location, skills, companyName, industry } = req.body;
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update common fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    // Update candidate-specific fields
    if (user.role === 'candidate') {
      if (headline) user.headline = headline;
      if (bio) user.bio = bio;
      if (location) user.location = location;
      if (skills) user.skills = skills;
    }

    // Update recruiter-specific fields
    if (user.role === 'recruiter') {
      if (companyName) user.company = companyName;
      if (industry) user.industry = industry;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile: ' + error.message 
    });
  }
};

// Add work experience
exports.addExperience = async (req, res) => {
  try {
    const { title, company, startDate, endDate, description, isCurrently } = req.body;
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.experience.push({
      title,
      company,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description,
      isCurrently: isCurrently || false
    });

    await user.save();

    res.json({
      success: true,
      message: 'Experience added successfully',
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding experience: ' + error.message 
    });
  }
};

// Add education
exports.addEducation = async (req, res) => {
  try {
    const { degree, fieldOfStudy, school, startDate, endDate } = req.body;
    
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.education.push({
      degree,
      fieldOfStudy,
      school,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null
    });

    await user.save();

    res.json({
      success: true,
      message: 'Education added successfully',
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding education: ' + error.message 
    });
  }
};

// Search candidates
exports.searchCandidates = async (req, res) => {
  try {
    const { keyword, skills, experience, location, page = 1, limit = 10 } = req.query;

    const query = { role: 'candidate', isVerified: true };

    if (keyword) {
      query.$or = [
        { firstName: { $regex: keyword, $options: 'i' } },
        { lastName: { $regex: keyword, $options: 'i' } },
        { headline: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (experience) {
      query.experience = { $not: { $size: 0 } };
    }

    const skip = (page - 1) * limit;
    
    const candidates = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpiry -verificationToken')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      candidates,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search candidates error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error searching candidates: ' + error.message 
    });
  }
};
