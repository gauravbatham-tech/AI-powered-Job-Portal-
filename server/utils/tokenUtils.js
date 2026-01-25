const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '7d' }
  );

  return token;
};

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const formatUserResponse = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profileImage: user.profileImage,
    isVerified: user.isVerified,
    ...(user.role === 'candidate' && {
      headline: user.headline,
      bio: user.bio,
      location: user.location,
      skills: user.skills,
      experience: user.experience,
      education: user.education
    }),
    ...(user.role === 'recruiter' && {
      company: user.company,
      companySize: user.companySize,
      industry: user.industry
    })
  };
};

const formatJobResponse = (job) => {
  return {
    id: job._id,
    title: job.title,
    description: job.description,
    category: job.category,
    experienceLevel: job.experienceLevel,
    location: job.location,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    requiredSkills: job.requiredSkills,
    preferredSkills: job.preferredSkills,
    companyName: job.companyName,
    companyLogoUrl: job.companyLogoUrl,
    status: job.status,
    postedDate: job.postedDate,
    deadline: job.deadline,
    applicationsCount: job.applicationsCount,
    viewsCount: job.viewsCount
  };
};

module.exports = {
  generateToken,
  generateResetToken,
  generateVerificationToken,
  formatUserResponse,
  formatJobResponse
};
