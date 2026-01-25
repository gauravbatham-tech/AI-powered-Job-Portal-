# System Architecture & Design Document

## Overview

The AI-Powered Job Portal is built on a modern MERN (MongoDB, Express, React, Node.js) stack with advanced AI features for resume parsing and job matching. The system implements a three-tier architecture with clean separation of concerns.

---

## Architecture Layers

### 1. Presentation Layer (Frontend)
**Technology**: Next.js 16, React 19, Tailwind CSS

```
┌─────────────────────────────────┐
│     React Components Layer       │
│  (Pages, Components, Layouts)   │
└─────────────────┬───────────────┘
                  │
┌─────────────────▼───────────────┐
│   Context & State Management    │
│  (AuthContext, Global State)    │
└─────────────────┬───────────────┘
                  │
┌─────────────────▼───────────────┐
│   Services & API Layer          │
│  (API Client, Service Functions)│
└─────────────────┬───────────────┘
                  │
        Backend API (5000)
```

### 2. API Layer (Backend)
**Technology**: Express.js, Node.js

```
┌──────────────────────────────────┐
│      Route Handlers              │
│  (Express Routes)                │
└─────────────┬──────────────────┘
              │
┌─────────────▼──────────────────┐
│    Middleware Stack             │
│  - Authentication               │
│  - Authorization                │
│  - Validation                   │
│  - Error Handling               │
└─────────────┬──────────────────┘
              │
┌─────────────▼──────────────────┐
│    Business Logic Layer         │
│  (Controllers)                  │
│  - Auth Controller              │
│  - Job Controller               │
│  - Application Controller       │
│  - Resume Controller            │
│  - Admin Controller             │
└─────────────┬──────────────────┘
              │
┌─────────────▼──────────────────┐
│    Service & Utility Layer      │
│  - AI Matching Engine           │
│  - Resume Parser                │
│  - Token Utils                  │
│  - Validation Utils             │
└─────────────┬──────────────────┘
```

### 3. Data Layer (Database)
**Technology**: MongoDB, Mongoose

```
┌──────────────────────────────────┐
│    Models & Schemas              │
│  (Mongoose Models)               │
│  - User                          │
│  - Job                           │
│  - Application                   │
│  - Resume                        │
│  - HiringStage                   │
└─────────────┬──────────────────┘
              │
┌─────────────▼──────────────────┐
│    MongoDB Database             │
│  - Collections                  │
│  - Indexes                      │
│  - Relationships                │
└──────────────────────────────────┘
```

---

## Data Flow

### User Registration Flow
```
Frontend (Register Form)
    ↓
Validate Input (Frontend)
    ↓
POST /api/auth/register
    ↓
Authentication Controller
    ↓
Validate Email & Password
    ↓
Hash Password (bcrypt)
    ↓
Create User in Database
    ↓
Generate JWT Token
    ↓
Return Token & User Data
    ↓
Store Token (localStorage)
    ↓
Redirect to Dashboard
```

### Job Application Flow
```
Candidate View
    ↓
Browse Jobs (GET /api/jobs)
    ↓
Click Apply
    ↓
Select Resume & Submit
    ↓
POST /api/applications
    ↓
Validate Resume
    ↓
Parse Resume Text
    ↓
Calculate AI Match Score
    ↓
Create Application
    ↓
Increment Job Application Count
    ↓
Return Matching Score to Frontend
    ↓
Show Confirmation to Candidate

Recruiter View
    ↓
GET /api/applications/job/:jobId
    ↓
Applications Sorted by Match Score
    ↓
Review Candidate
    ↓
View AI Matching Details
    ↓
Schedule Interview or Shortlist
    ↓
UPDATE /api/applications/:id/status
```

### Resume Parsing Flow
```
Candidate Upload Resume
    ↓
File Validation
    ↓
Read File Content
    ↓
POST /api/resumes
    ↓
parseResume() Function
    ↓
├─ Extract Name
├─ Extract Email/Phone
├─ Extract Skills
├─ Extract Experience
├─ Extract Education
├─ Extract Certifications
└─ Extract Languages
    ↓
Store Raw Text & Parsed Data
    ↓
Extract Keywords
    ↓
Save in Database
    ↓
Return Parsed Resume to Frontend
```

---

## Authentication Flow

### JWT Authentication
```
1. User Registers
   ├─ Password hashed with bcrypt
   └─ User saved to DB

2. User Logs In
   ├─ Verify email exists
   ├─ Compare password
   ├─ Generate JWT payload
   ├─ Sign JWT (7-day expiry)
   └─ Return token

3. Client Storage
   ├─ Save token to localStorage
   ├─ Save user data to localStorage
   └─ Set in Auth Context

4. API Requests
   ├─ Axios interceptor adds token
   ├─ Authorization: Bearer {token}
   └─ Send with each request

5. Server Verification
   ├─ Extract token from header
   ├─ Verify JWT signature
   ├─ Check expiration
   ├─ Decode user ID & role
   └─ Attach to req.user

6. Authorization
   ├─ Check required role
   ├─ Compare req.user.role
   ├─ Allow/Deny access
   └─ Return 403 if unauthorized
```

---

## Database Design

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  role: Enum["candidate", "recruiter", "admin"],
  
  // Candidate fields
  headline: String,
  bio: String,
  location: String,
  skills: [String],
  experience: [{ title, company, startDate, endDate, description }],
  education: [{ degree, school, startDate, endDate }],
  
  // Recruiter fields
  company: String,
  industry: String,
  companySize: String,
  
  // Verification
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date,
  
  // Tokens
  verificationToken: String,
  resetPasswordToken: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Job Collection
```javascript
{
  _id: ObjectId,
  title: String (indexed),
  description: String (text indexed),
  category: Enum,
  experienceLevel: Enum,
  
  location: {
    city: String,
    state: String,
    country: String,
    isRemote: Boolean
  },
  
  salaryMin: Number,
  salaryMax: Number,
  
  requiredSkills: [String],
  preferredSkills: [String],
  requirements: [String],
  responsibilities: [String],
  
  recruiterId: ObjectId (ref: User),
  companyName: String,
  
  status: Enum["open", "closed", "archived"],
  applicationsCount: Number,
  viewsCount: Number,
  
  deadline: Date,
  postedDate: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Application Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: Job),
  candidateId: ObjectId (ref: User),
  recruiterId: ObjectId (ref: User),
  resumeId: ObjectId (ref: Resume),
  
  // AI Matching
  matchingScore: Number (0-100),
  matchingDetails: {
    skillsMatch: Number,
    experienceMatch: Number,
    educationMatch: Number,
    overallFit: String
  },
  
  // Status
  status: Enum (applied, screening, interview_scheduled, ...),
  timeline: [{
    status: String,
    date: Date,
    notes: String,
    updatedBy: ObjectId
  }],
  
  // Interviews
  interviews: [{
    date: Date,
    type: String,
    feedback: String,
    rating: Number,
    interviewer: ObjectId
  }],
  
  // Recruiter Info
  recruiterNotes: [{
    note: String,
    createdBy: ObjectId,
    createdAt: Date
  }],
  
  // Flags
  isShortlisted: Boolean,
  isViewed: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId (ref: User),
  
  // File info
  fileName: String,
  fileUrl: String,
  fileSize: Number,
  uploadDate: Date,
  
  // Parsed data
  parsedData: {
    fullName: String,
    email: String,
    skills: [{
      name: String,
      level: String,
      yearsOfExperience: Number
    }],
    workExperience: [{
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String
    }],
    education: [{
      degree: String,
      school: String,
      startDate: Date,
      endDate: Date
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date
    }]
  },
  
  // Raw text
  rawText: String (text indexed),
  
  // Processing
  processingStatus: Enum["pending", "processing", "completed", "failed"],
  
  // Flags
  isDefault: Boolean,
  isActive: Boolean,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes Strategy
```javascript
// User indexes
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1, isVerified: 1 });

// Job indexes
db.jobs.createIndex({ title: "text", description: "text", requiredSkills: "text" });
db.jobs.createIndex({ recruiterId: 1, status: 1 });
db.jobs.createIndex({ category: 1, experienceLevel: 1 });
db.jobs.createIndex({ deadline: 1 });

// Application indexes
db.applications.createIndex({ jobId: 1, candidateId: 1 }, { unique: true });
db.applications.createIndex({ recruiterId: 1, status: 1 });
db.applications.createIndex({ matchingScore: -1 });

// Resume indexes
db.resumes.createIndex({ candidateId: 1 });
db.resumes.createIndex({ rawText: "text" });
```

---

## AI Matching Engine

### Algorithm Overview
```
Input: Resume Data & Job Description

Step 1: Extract Skills
├─ From resume: Get skill names
└─ From job: Get required skills

Step 2: Calculate Skill Match (40% weight)
├─ Find matching skills
├─ Count matches vs required
└─ Return: (matches / required) * 100

Step 3: Calculate Experience Match (30% weight)
├─ Sum years of experience from resume
├─ Compare to job requirement
├─ Return: Min(years / required * 100, 100)

Step 4: Calculate Education Match (10% weight)
├─ Check if relevant degrees present
└─ Return: 0-100 based on presence

Step 5: Calculate Content Similarity (20% weight)
├─ Extract words from both texts
├─ Calculate Jaccard similarity
├─ TF-IDF vectorization
└─ Return: Similarity score

Step 6: Weighted Average
Final Score = 
  (Skills * 0.40) +
  (Experience * 0.30) +
  (Education * 0.10) +
  (Content * 0.20)

Step 7: Classify Fit
├─ >= 75: High
├─ 50-74: Medium
└─ < 50: Low

Output: Score & Fit Classification
```

### Resume Parser Logic
```
Input: Resume Text

1. Split into lines
2. Pattern matching for:
   - Email: /[\w\.-]+@[\w\.-]+\.\w+/
   - Phone: /(\d{3})-?(\d{3})-?(\d{4})/
   - LinkedIn: /linkedin\.com\/in\/.../
   - GitHub: /github\.com\/.../

3. Section Detection
   - Keywords: "experience", "education", "skills"
   - Extract following lines until next section

4. Skill Extraction
   - Common skills list matching
   - Case-insensitive search

5. Experience Parsing
   - Date patterns
   - Company/Job title pairs
   - Description extraction

6. Store Structured Data
   - parsedData object
   - Keywords array
   - Raw text for search

Output: Structured Resume Object
```

---

## API Response Format

### Success Response
```javascript
{
  success: true,
  message: "Operation completed",
  data: {
    // Response data
  },
  pagination?: {
    total: Number,
    page: Number,
    limit: Number,
    pages: Number
  }
}
```

### Error Response
```javascript
{
  success: false,
  message: "Error description",
  errors?: [
    "Error 1",
    "Error 2"
  ]
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

---

## Security Measures

### 1. Authentication
- JWT tokens with 7-day expiration
- Secure token storage in localStorage
- HttpOnly cookies optional

### 2. Authorization
- Role-based access control (RBAC)
- Resource ownership verification
- Protected API endpoints

### 3. Password Security
- Bcrypt hashing with 10 salt rounds
- Password reset with time-limited tokens
- Email verification before access

### 4. Data Protection
- Input validation on frontend & backend
- SQL injection prevention (NoSQL)
- XSS protection with React escaping
- CORS protection

### 5. Rate Limiting
- Can be added to prevent brute force
- Implement on authentication endpoints

---

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    ├─ Server Instance 1
    ├─ Server Instance 2
    ├─ Server Instance 3
    └─ Server Instance N
         ↓
    MongoDB Cluster
    (Replica Set with sharding)
```

### Optimization Strategies
1. **Database**: Implement caching (Redis)
2. **API**: Implement pagination & filtering
3. **Frontend**: Code splitting & lazy loading
4. **Storage**: Cloud storage for resumes (S3)
5. **Search**: Elasticsearch for advanced search

---

## Deployment Architecture

### Development
```
Localhost:3000 (Frontend)
Localhost:5000 (Backend)
Localhost:27017 (MongoDB)
```

### Production
```
Frontend (Vercel/Netlify)
    ↓
CDN (CloudFlare)
    ↓
API Gateway
    ↓
Backend Servers (AWS/Heroku)
    ↓
MongoDB Atlas
```

---

## Error Handling Strategy

### Frontend Error Handling
```
User Action
    ↓
Try-Catch Block
    ↓
├─ Network Error
│   └─ Display offline message
├─ 401 Unauthorized
│   └─ Redirect to login
├─ 403 Forbidden
│   └─ Show permission denied
├─ 404 Not Found
│   └─ Show not found page
├─ 5xx Server Error
│   └─ Retry or contact support
└─ Validation Error
    └─ Show field errors
```

### Backend Error Handling
```
Express Request
    ↓
Route Handler (try-catch)
    ↓
├─ Validation Error
│   └─ Return 400 with errors
├─ Authentication Error
│   └─ Return 401
├─ Authorization Error
│   └─ Return 403
├─ Database Error
│   └─ Log & return 500
├─ Business Logic Error
│   └─ Return appropriate status
└─ Unexpected Error
    └─ Log stack trace & return 500
```

---

## Performance Monitoring

### Key Metrics
1. **API Response Time**: Target < 200ms
2. **Page Load Time**: Target < 3s
3. **Database Query Time**: Target < 100ms
4. **Application Creation**: Track conversion rate
5. **User Retention**: Track active users

### Tools
- Browser DevTools
- MongoDB Performance Analyzer
- Application Performance Monitoring (APM)

---

This comprehensive architecture ensures scalability, security, and maintainability of the AI-Powered Job Portal system.
