// User Roles
const ROLES = {
  ADMIN: 'admin',
  RECRUITER: 'recruiter',
  CANDIDATE: 'candidate'
};

// Job Status
const JOB_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  ARCHIVED: 'archived'
};

// Application Status
const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEWED: 'interviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  DECLINED: 'declined'
};

// Experience Levels
const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  EXECUTIVE: 'executive'
};

// Job Categories
const JOB_CATEGORIES = {
  IT: 'IT',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  SALES: 'Sales',
  HR: 'HR',
  OPERATIONS: 'Operations',
  DESIGN: 'Design',
  DATA_SCIENCE: 'Data Science',
  PRODUCT: 'Product',
  ENGINEERING: 'Engineering'
};

module.exports = {
  ROLES,
  JOB_STATUS,
  APPLICATION_STATUS,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES
};
