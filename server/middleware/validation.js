const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
};

const validateJobForm = (jobData) => {
  const errors = [];
  
  if (!jobData.title || jobData.title.trim().length < 5) {
    errors.push('Job title must be at least 5 characters');
  }
  
  if (!jobData.description || jobData.description.trim().length < 50) {
    errors.push('Job description must be at least 50 characters');
  }
  
  if (!jobData.category) {
    errors.push('Job category is required');
  }
  
  if (!jobData.experienceLevel) {
    errors.push('Experience level is required');
  }
  
  if (!jobData.location || !jobData.location.city) {
    errors.push('Job location is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateApplicationForm = (appData) => {
  const errors = [];
  
  if (!appData.jobId) {
    errors.push('Job ID is required');
  }
  
  if (!appData.resumeId) {
    errors.push('Resume is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateJobForm,
  validateApplicationForm
};
