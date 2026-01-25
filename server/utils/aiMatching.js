/**
 * AI-powered Resume to Job Matching Engine
 * Uses similarity scoring for skill, experience, and education matching
 */

// Simple TF-IDF based similarity calculation
const calculateSimilarity = (text1, text2) => {
  const normalize = (text) => text.toLowerCase().trim().split(/\s+/);
  
  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
};

// Extract skills from text
const extractSkills = (text) => {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'express', 'mongodb', 
    'sql', 'mysql', 'postgresql', 'docker', 'kubernetes', 'aws', 'git', 'html', 
    'css', 'angular', 'vue.js', 'typescript', 'golang', 'rust', 'c++', 'php',
    'project management', 'leadership', 'communication', 'teamwork', 'problem solving',
    'agile', 'scrum', 'devops', 'machine learning', 'artificial intelligence',
    'data analysis', 'power bi', 'tableau', 'excel', 'salesforce'
  ];
  
  const textLower = text.toLowerCase();
  return commonSkills.filter(skill => textLower.includes(skill));
};

// Calculate skill match percentage
const calculateSkillsMatch = (resumeSkills, jobRequiredSkills) => {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) return 100;
  if (!resumeSkills || resumeSkills.length === 0) return 0;
  
  const matchedSkills = jobRequiredSkills.filter(skill =>
    resumeSkills.some(resSkill => 
      resSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(resSkill.toLowerCase())
    )
  );
  
  return (matchedSkills.length / jobRequiredSkills.length) * 100;
};

// Calculate experience match
const calculateExperienceMatch = (resumeExperience, jobExperienceLevel) => {
  const experienceLevels = {
    'entry': 0,
    'junior': 2,
    'mid': 5,
    'senior': 8,
    'lead': 12,
    'executive': 15
  };
  
  const requiredYears = experienceLevels[jobExperienceLevel] || 0;
  
  let totalYears = 0;
  if (resumeExperience && Array.isArray(resumeExperience)) {
    resumeExperience.forEach(exp => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrently ? new Date() : new Date(exp.endDate);
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      totalYears += years;
    });
  }
  
  if (totalYears >= requiredYears) {
    return 100;
  } else if (requiredYears === 0) {
    return 100;
  } else {
    return (totalYears / requiredYears) * 100;
  }
};

// Calculate education match
const calculateEducationMatch = (resumeEducation, jobDescription) => {
  const degreeKeywords = ['bachelor', 'master', 'phd', 'diploma', 'associate', 'degree'];
  const hasEducation = resumeEducation && resumeEducation.length > 0;
  
  if (!hasEducation) return 50;
  
  // Simple check for education presence
  return 100;
};

// Main matching engine
const calculateResumeJobMatch = (resume, job) => {
  try {
    const resumeText = resume.rawText || '';
    const resumeSkills = resume.parsedData?.skills?.map(s => s.name) || [];
    const resumeExperience = resume.parsedData?.workExperience || [];
    const resumeEducation = resume.parsedData?.education || [];
    
    const jobDescription = job.description || '';
    const jobRequiredSkills = job.requiredSkills || [];
    const jobExperienceLevel = job.experienceLevel || 'entry';
    
    // Calculate individual match scores
    const skillsMatch = calculateSkillsMatch(resumeSkills, jobRequiredSkills);
    const experienceMatch = calculateExperienceMatch(resumeExperience, jobExperienceLevel);
    const educationMatch = calculateEducationMatch(resumeEducation, jobDescription);
    const contentMatch = calculateSimilarity(resumeText, jobDescription);
    
    // Weighted average (adjust weights as needed)
    const weights = {
      skills: 0.40,
      experience: 0.30,
      education: 0.10,
      content: 0.20
    };
    
    const overallScore = 
      (skillsMatch * weights.skills +
       experienceMatch * weights.experience +
       educationMatch * weights.education +
       contentMatch * weights.content);
    
    // Determine overall fit
    let overallFit = 'Low';
    if (overallScore >= 75) overallFit = 'High';
    else if (overallScore >= 50) overallFit = 'Medium';
    
    return {
      matchingScore: Math.round(overallScore),
      matchingDetails: {
        skillsMatch: Math.round(skillsMatch),
        experienceMatch: Math.round(experienceMatch),
        educationMatch: Math.round(educationMatch),
        overallFit
      }
    };
  } catch (error) {
    console.error('Error calculating resume-job match:', error);
    return {
      matchingScore: 0,
      matchingDetails: {
        skillsMatch: 0,
        experienceMatch: 0,
        educationMatch: 0,
        overallFit: 'Low'
      }
    };
  }
};

module.exports = {
  calculateResumeJobMatch,
  calculateSkillsMatch,
  calculateExperienceMatch,
  calculateEducationMatch,
  calculateSimilarity,
  extractSkills
};
