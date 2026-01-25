import apiClient from './api';

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  getCurrentUser: () => apiClient.get('/auth/me')
};

export const userService = {
  getUserProfile: (userId) => apiClient.get(`/users/profile/${userId}`),
  getMyProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  addExperience: (data) => apiClient.post('/users/experience', data),
  addEducation: (data) => apiClient.post('/users/education', data),
  searchCandidates: (params) => apiClient.get('/users/search-candidates', { params })
};

export const jobService = {
  getAllJobs: (params) => apiClient.get('/jobs', { params }),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  createJob: (data) => apiClient.post('/jobs', data),
  updateJob: (id, data) => apiClient.put(`/jobs/${id}`, data),
  closeJob: (id) => apiClient.post(`/jobs/${id}/close`),
  getRecruiterJobs: (params) => apiClient.get('/jobs/recruiter/my-jobs', { params })
};

export const applicationService = {
  submitApplication: (data) => apiClient.post('/applications', data),
  getCandidateApplications: (params) => apiClient.get('/applications/candidate/my-applications', { params }),
  getJobApplications: (jobId, params) => apiClient.get(`/applications/job/${jobId}`, { params }),
  updateApplicationStatus: (applicationId, data) => apiClient.put(`/applications/${applicationId}/status`, data),
  addRecruiterNotes: (applicationId, data) => apiClient.post(`/applications/${applicationId}/notes`, data),
  scheduleInterview: (applicationId, data) => apiClient.post(`/applications/${applicationId}/interview`, data),
  getShortlistedCandidates: (jobId, params) => apiClient.get(`/applications/job/${jobId}/shortlisted`, { params }),
  withdrawApplication: (applicationId) => apiClient.post(`/applications/${applicationId}/withdraw`)
};

export const resumeService = {
  uploadResume: (data) => apiClient.post('/resumes', data),
  getCandidateResumes: () => apiClient.get('/resumes'),
  getResumeById: (resumeId) => apiClient.get(`/resumes/${resumeId}`),
  setDefaultResume: (resumeId) => apiClient.put(`/resumes/${resumeId}/default`),
  deleteResume: (resumeId) => apiClient.delete(`/resumes/${resumeId}`),
  searchResumes: (params) => apiClient.get('/resumes/search', { params })
};

export const adminService = {
  getPlatformStats: () => apiClient.get('/admin/stats'),
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  verifyUser: (userId) => apiClient.post(`/admin/users/${userId}/verify`),
  deactivateUser: (userId, data) => apiClient.post(`/admin/users/${userId}/deactivate`, data),
  getJobAnalytics: (params) => apiClient.get('/admin/analytics/jobs', { params }),
  getApplicationAnalytics: (params) => apiClient.get('/admin/analytics/applications', { params }),
  getTopRecruiters: (params) => apiClient.get('/admin/top-recruiters', { params }),
  getTopCandidates: (params) => apiClient.get('/admin/top-candidates', { params })
};
