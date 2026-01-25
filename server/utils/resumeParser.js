/**
 * Resume Parser - Extracts structured data from resume text
 * Uses pattern matching and heuristics to identify sections
 */

const parseResume = (resumeText) => {
  const text = resumeText || '';
  
  const parsedData = {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    website: extractWebsite(text),
    linkedin: extractLinkedIn(text),
    github: extractGithub(text),
    summary: extractSummary(text),
    skills: extractSkillsFromResume(text),
    workExperience: extractWorkExperience(text),
    education: extractEducation(text),
    certifications: extractCertifications(text),
    languages: extractLanguages(text),
    projects: extractProjects(text)
  };
  
  return parsedData;
};

const extractName = (text) => {
  // First non-empty line is often the name
  const lines = text.split('\n');
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && trimmed.length < 50) {
      return trimmed;
    }
  }
  return '';
};

const extractEmail = (text) => {
  const emailRegex = /[\w\.-]+@[\w\.-]+\.\w+/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
};

const extractPhone = (text) => {
  const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
};

const extractLocation = (text) => {
  // Try to find city, state/country pattern
  const lines = text.split('\n');
  for (let line of lines) {
    if (line.includes(',') && line.length < 50) {
      return line.trim();
    }
  }
  return '';
};

const extractWebsite = (text) => {
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?[\w\.-]+\.\w+/;
  const match = text.match(websiteRegex);
  return match ? match[0] : '';
};

const extractLinkedIn = (text) => {
  const linkedInRegex = /linkedin\.com\/in\/[\w\-]+/;
  const match = text.match(linkedInRegex);
  return match ? match[0] : '';
};

const extractGithub = (text) => {
  const githubRegex = /github\.com\/[\w\-]+/;
  const match = text.match(githubRegex);
  return match ? match[0] : '';
};

const extractSummary = (text) => {
  const summaryKeywords = ['summary', 'objective', 'professional summary', 'profile'];
  const lines = text.split('\n');
  
  let summaryStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (summaryKeywords.some(keyword => 
      lines[i].toLowerCase().includes(keyword))) {
      summaryStart = i + 1;
      break;
    }
  }
  
  if (summaryStart !== -1) {
    const summaryLines = [];
    for (let i = summaryStart; i < Math.min(summaryStart + 5, lines.length); i++) {
      if (lines[i].trim().length > 0) {
        summaryLines.push(lines[i].trim());
      } else {
        break;
      }
    }
    return summaryLines.join(' ');
  }
  
  return '';
};

const extractSkillsFromResume = (text) => {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'express', 'mongodb', 
    'sql', 'mysql', 'postgresql', 'docker', 'kubernetes', 'aws', 'git', 'html', 
    'css', 'angular', 'vue.js', 'typescript', 'golang', 'rust', 'c++', 'php',
    'project management', 'leadership', 'communication', 'teamwork', 'problem solving',
    'agile', 'scrum', 'devops', 'machine learning', 'artificial intelligence',
    'data analysis', 'power bi', 'tableau', 'excel', 'salesforce', 'rest api',
    'graphql', 'firebase', 'azure', 'jenkins', 'gitlab', 'bitbucket'
  ];
  
  const textLower = text.toLowerCase();
  const foundSkills = [];
  
  commonSkills.forEach(skill => {
    if (textLower.includes(skill)) {
      foundSkills.push({
        name: skill.charAt(0).toUpperCase() + skill.slice(1),
        level: 'Intermediate', // Default level
        yearsOfExperience: null
      });
    }
  });
  
  return foundSkills;
};

const extractWorkExperience = (text) => {
  const experiences = [];
  const workKeywords = ['experience', 'work experience', 'professional experience'];
  const lines = text.split('\n');
  
  let workStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (workKeywords.some(keyword => 
      lines[i].toLowerCase().includes(keyword))) {
      workStart = i + 1;
      break;
    }
  }
  
  if (workStart !== -1) {
    for (let i = workStart; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip if empty or is a section header
      if (!line || line.match(/^[A-Z\s]+$/) && line.length > 20) {
        continue;
      }
      
      // Try to identify job title and company
      if (line.includes('|') || line.includes('-')) {
        const parts = line.split(/\s*[|\-]\s*/);
        if (parts.length >= 2) {
          experiences.push({
            jobTitle: parts[0].trim(),
            company: parts[1].trim(),
            location: parts[2]?.trim() || '',
            startDate: null,
            endDate: null,
            isCurrently: line.toLowerCase().includes('present'),
            description: ''
          });
        }
      }
    }
  }
  
  return experiences;
};

const extractEducation = (text) => {
  const education = [];
  const educationKeywords = ['education', 'degree', 'bachelor', 'master', 'phd'];
  const degreeTypes = ['bachelor', 'master', 'phd', 'associate', 'diploma', 'b.s.', 'm.s.', 'b.a.', 'm.a.'];
  
  const lines = text.split('\n');
  let eduStart = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (educationKeywords.some(keyword => 
      lines[i].toLowerCase().includes(keyword))) {
      eduStart = i + 1;
      break;
    }
  }
  
  if (eduStart !== -1) {
    for (let i = eduStart; i < Math.min(eduStart + 10, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        education.push({
          degree: 'Bachelor', // Default, should be extracted
          fieldOfStudy: '',
          school: line,
          startDate: null,
          endDate: null
        });
      }
    }
  }
  
  return education;
};

const extractCertifications = (text) => {
  const certifications = [];
  const certKeywords = ['certification', 'certificate', 'certified', 'credentials'];
  const lines = text.split('\n');
  
  let certStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (certKeywords.some(keyword => 
      lines[i].toLowerCase().includes(keyword))) {
      certStart = i + 1;
      break;
    }
  }
  
  if (certStart !== -1) {
    for (let i = certStart; i < Math.min(certStart + 5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        certifications.push({
          name: line,
          issuer: '',
          issueDate: null,
          expiryDate: null,
          credentialId: '',
          credentialUrl: ''
        });
      }
    }
  }
  
  return certifications;
};

const extractLanguages = (text) => {
  const commonLanguages = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Japanese'];
  const languages = [];
  const textLower = text.toLowerCase();
  
  commonLanguages.forEach(lang => {
    if (textLower.includes(lang.toLowerCase())) {
      languages.push({
        name: lang,
        proficiency: 'Fluent'
      });
    }
  });
  
  return languages;
};

const extractProjects = (text) => {
  const projects = [];
  const projectKeywords = ['project', 'projects', 'portfolio'];
  const lines = text.split('\n');
  
  let projectStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (projectKeywords.some(keyword => 
      lines[i].toLowerCase().includes(keyword))) {
      projectStart = i + 1;
      break;
    }
  }
  
  if (projectStart !== -1) {
    for (let i = projectStart; i < Math.min(projectStart + 5, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 0) {
        projects.push({
          name: line,
          description: '',
          technologies: [],
          link: ''
        });
      }
    }
  }
  
  return projects;
};

module.exports = {
  parseResume,
  extractName,
  extractEmail,
  extractPhone,
  extractLocation,
  extractWebsite,
  extractLinkedIn,
  extractGithub,
  extractSummary,
  extractSkillsFromResume,
  extractWorkExperience,
  extractEducation,
  extractCertifications,
  extractLanguages,
  extractProjects
};
