# AI-Powered Job Portal with ATS

A full-stack MERN application that connects candidates and recruiters through an intelligent Applicant Tracking System (ATS) with AI-assisted resume matching.

## 🚀 Features

### Candidate Features
- **Profile Management**: Create and update detailed candidate profiles with skills, experience, and education
- **Resume Management**: Upload and parse multiple resumes with automatic data extraction
- **Job Search**: Browse and search jobs with advanced filtering (category, experience level, location, salary)
- **Application Tracking**: Track all applications with status updates and interview schedules
- **AI Matching**: See resume-to-job matching scores before applying

### Recruiter Features
- **Job Posting**: Create and manage job postings with detailed requirements
- **Application Management**: Review applications with AI-powered matching scores
- **Candidate Tracking**: Track candidates through hiring pipeline stages
- **Interview Scheduling**: Schedule and manage interviews with candidates
- **Shortlisting**: AI-assisted candidate shortlisting based on resume-job fit
- **Recruiter Notes**: Add notes and feedback on applications
- **Analytics**: View job and application statistics

### Admin Features
- **Platform Statistics**: Dashboard with key metrics
- **User Management**: Manage and verify users (candidates and recruiters)
- **Job Analytics**: Monitor job postings and categories
- **Application Analytics**: Track application flows and conversion rates
- **Top Performers**: View top recruiters and candidates

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: Server framework
- **MongoDB**: NoSQL database
- **JWT**: Authentication and authorization
- **Bcrypt**: Password hashing
- **Mongoose**: MongoDB ODM

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

### AI/ML
- **Resume Parser**: Extract structured data from resumes using pattern matching
- **Resume-Job Matcher**: Calculate similarity scores using TF-IDF and weighted scoring

## 📁 Project Structure

```
├── server/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── constants.js          # Application constants
│   ├── controllers/              # Business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   ├── resume.controller.js
│   │   └── admin.controller.js
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Resume.js
│   │   └── HiringStage.js
│   ├── routes/                   # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   ├── resume.routes.js
│   │   └── admin.routes.js
│   ├── middleware/               # Custom middleware
│   │   ├── authenticateToken.js
│   │   ├── authorize.js
│   │   └── validation.js
│   ├── utils/                    # Utility functions
│   │   ├── aiMatching.js         # Resume-job matching engine
│   │   ├── resumeParser.js       # Resume text parsing
│   │   └── tokenUtils.js         # JWT utilities
│   └── server.js                 # Express app entry point
│
├── src/
│   ├── app/
│   │   ├── layout.js             # Root layout with AuthProvider
│   │   ├── page.js               # Home page
│   │   └── globals.css
│   ├── pages/                    # Page components
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── jobs.js
│   │   ├── jobs/[id].js          # Job details
│   │   ├── applications.js
│   │   ├── post-job.js
│   │   ├── profile.js
│   │   └── my-jobs.js
│   ├── components/               # Reusable components
│   │   ├── Navbar.js
│   │   ├── JobCard.js
│   │   └── ApplicationCard.js
│   ├── services/                 # API services
│   │   ├── api.js                # Axios instance
│   │   └── index.js              # Service methods
│   ├── context/
│   │   └── AuthContext.js        # Authentication context
│   ├── hooks/
│   │   └── ProtectedRoute.js     # Route protection
│   ├── utils/                    # Frontend utilities
│   └── config/
│       └── constants.js          # Frontend constants
│
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**

For development (runs both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Job Endpoints
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (recruiters only)
- `PUT /api/jobs/:id` - Update job (recruiters only)
- `POST /api/jobs/:id/close` - Close job (recruiters only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Application Endpoints
- `POST /api/applications` - Submit application
- `GET /api/applications/candidate/my-applications` - Get candidate's applications
- `GET /api/applications/job/:jobId` - Get job applications (recruiters only)
- `PUT /api/applications/:applicationId/status` - Update application status
- `POST /api/applications/:applicationId/notes` - Add recruiter notes
- `POST /api/applications/:applicationId/interview` - Schedule interview
- `GET /api/applications/job/:jobId/shortlisted` - Get shortlisted candidates

### Resume Endpoints
- `POST /api/resumes` - Upload resume
- `GET /api/resumes` - Get candidate's resumes
- `GET /api/resumes/:resumeId` - Get resume details
- `PUT /api/resumes/:resumeId/default` - Set default resume
- `DELETE /api/resumes/:resumeId` - Delete resume
- `GET /api/resumes/search` - Search resumes (recruiters only)

### User Endpoints
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/experience` - Add experience
- `POST /api/users/education` - Add education
- `GET /api/users/search-candidates` - Search candidates (recruiters only)

### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:userId/verify` - Verify user
- `POST /api/admin/users/:userId/deactivate` - Deactivate user
- `GET /api/admin/analytics/jobs` - Job analytics
- `GET /api/admin/analytics/applications` - Application analytics
- `GET /api/admin/top-recruiters` - Top recruiters
- `GET /api/admin/top-candidates` - Top candidates

## 🤖 AI Features

### Resume Parsing
The system automatically extracts the following from resumes:
- Personal information (name, email, phone, location)
- Contact links (LinkedIn, GitHub, portfolio)
- Professional summary
- Work experience with dates and descriptions
- Education with degrees and institutions
- Skills with proficiency levels
- Certifications
- Languages
- Projects

### Resume-Job Matching
The AI matching engine calculates match scores based on:
- **Skills Match** (40% weight): How many required skills are present in resume
- **Experience Match** (30% weight): Years of experience compared to job requirements
- **Education Match** (10% weight): Relevant education qualifications
- **Content Similarity** (20% weight): Overall resume-job description similarity

Match scores determine overall fit:
- 75-100: High Match
- 50-74: Medium Match
- 0-49: Low Match

## 🔐 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for Admin, Recruiter, Candidate
- **Email Verification**: Verify user accounts before full access
- **Password Reset**: Secure password recovery mechanism
- **Protected Routes**: Frontend route protection based on roles
- **CORS**: Cross-origin protection

## 📊 Database Schema

### User Schema
- Authentication fields
- Role-specific fields (candidate/recruiter)
- Profile information
- Verification status
- Password reset tokens

### Job Schema
- Job details (title, description, requirements)
- Salary information
- Location details
- Required and preferred skills
- Recruiter reference
- Application tracking

### Application Schema
- Job and candidate references
- Resume information
- AI matching scores
- Application status and timeline
- Interview scheduling
- Recruiter notes
- Offer tracking

### Resume Schema
- File information
- Parsed resume data
- Skills extracted
- Work experience
- Education
- Raw text for search
- Processing status

### HiringStage Schema
- Job pipeline stages
- Candidate progression through stages
- Stage notes and feedback
- Rating system

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
# Set environment variables
# Deploy with npm start script
npm install
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
npm start
```

### Environment Variables for Production
```
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<secure-random-secret>
NODE_ENV=production
CLIENT_URL=<production-frontend-url>
```

## 🧪 Testing

To test the application:

1. **Create Admin Account** - Register and manually set role to 'admin' in database
2. **Create Recruiter Account** - Register with recruiter role
3. **Create Candidate Account** - Register with candidate role
4. **Post a Job** - As recruiter, create a job posting
5. **Upload Resume** - As candidate, upload a resume
6. **Apply** - Apply to a job and check matching score
7. **Track Application** - View application status and timeline

## 📈 Future Enhancements

- Video interview integration
- Salary comparison tool
- Job recommendations ML model
- Email notifications
- Advanced analytics dashboard
- Bulk resume import
- Integration with LinkedIn API
- Candidate skill assessments
- Background check integration
- Interview feedback system

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

For support, email support@jobportal.com or create an issue in the repository.

---

**Happy Hiring! 🎉**
