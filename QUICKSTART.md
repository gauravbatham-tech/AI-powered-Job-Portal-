# 🚀 Quick Start Guide - AI Job Portal

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd my-app
npm install
```

### Step 2: Configure Environment
Create `.env.local` in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 4: Run the Application
```bash
# Option 1: Run both frontend and backend
npm run dev

# Option 2: Run separately in different terminals
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend
```

### Step 5: Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🧪 Testing the Platform

### Test Account Credentials

#### 1. Create a Recruiter Account
- Go to http://localhost:3000/register
- Fill form with:
  - Email: `recruiter@test.com`
  - Password: `Test123` (min 6 chars, uppercase, lowercase, number)
  - Role: Recruiter
  - Company: Test Company

#### 2. Create a Candidate Account
- Go to http://localhost:3000/register
- Fill form with:
  - Email: `candidate@test.com`
  - Password: `Test123`
  - Role: Candidate

#### 3. Create Admin Account (Manual)
- Register as candidate/recruiter
- Connect to MongoDB and manually update role to 'admin'
```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin", adminVerified: true } }
)
```

---

## 📋 Basic Workflow

### As a Recruiter:
1. Login to dashboard
2. Click "Post a Job" 
3. Fill job details:
   - Title: "Senior React Developer"
   - Description: Detailed role description
   - Skills: React, Node.js, MongoDB
   - Salary: $80,000 - $120,000
   - Location: New York, NY
4. Click "Post Job"
5. Go to "My Jobs" to see posted job
6. View applications as they come in

### As a Candidate:
1. Login to dashboard
2. Go to "My Profile" to add:
   - Skills (React, Node.js, MongoDB)
   - Experience (add previous jobs)
   - Education
3. Go to "Upload Resume" and upload a resume
4. Browse jobs by clicking "Browse Jobs"
5. Click on a job to see details
6. Click "Submit Application" with your resume
7. Go to "My Applications" to track status

### As an Admin:
1. Login to dashboard (role must be 'admin')
2. Access admin features:
   - View platform statistics
   - Manage users
   - View analytics
   - See top recruiters/candidates

---

## 🧠 AI Features Demo

### Resume Matching In Action
1. As candidate, upload a PDF resume with skills
2. As recruiter, create a job with required skills
3. Candidate applies to job
4. Check the application - see AI matching score!
5. Score breakdown shows:
   - Skills Match: % of required skills found
   - Experience Match: Years of experience vs requirement
   - Education Match: Relevant degrees found
   - Overall Fit: High/Medium/Low classification

### Resume Parsing
1. Upload a resume with your information
2. Go to application submission
3. See that resume data was automatically parsed:
   - Skills extracted
   - Experience recognized
   - Education identified

---

## 🔍 API Testing with cURL

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "password": "Test123",
    "role": "candidate"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "Test123"
  }'
```

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create Job (Recruiter)
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "React Developer",
    "description": "Build amazing web apps",
    "category": "IT",
    "experienceLevel": "mid",
    "location": {"city": "NYC", "country": "USA"},
    "requiredSkills": ["React", "JavaScript"]
  }'
```

### 5. Get All Jobs
```bash
curl http://localhost:5000/api/jobs
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution**: Ensure MongoDB is running
```bash
# Start MongoDB
mongod

# Or check if port 27017 is in use
lsof -i :27017
```

### Issue: "Port 3000 already in use"
**Solution**: Kill process using port or use different port
```bash
# Kill process
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
PORT=3001 npm run dev:frontend
```

### Issue: "Port 5000 already in use"
**Solution**: 
```bash
# Kill process
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or update port in .env
PORT=5001
```

### Issue: "JWT token expired"
**Solution**: Login again to get a new token
- All tokens expire after 7 days
- Logout and login to refresh

### Issue: "Database connection error"
**Solution**: Check MongoDB URI in .env
```
# Should be:
MONGODB_URI=mongodb://localhost:27017/job_portal

# Or for remote:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job_portal
```

---

## 📚 Key Endpoints Quick Reference

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login user |
| GET | `/jobs` | Public | List all jobs |
| GET | `/jobs/:id` | Public | Job details |
| POST | `/jobs` | Recruiter | Create job |
| POST | `/applications` | Candidate | Apply to job |
| GET | `/applications/job/:jobId` | Recruiter | View applications |
| PUT | `/applications/:id/status` | Recruiter | Update status |
| POST | `/resumes` | Candidate | Upload resume |
| GET | `/admin/stats` | Admin | Platform stats |

---

## 💡 Tips & Tricks

1. **Use Chrome DevTools** to debug frontend issues
2. **Check MongoDB Compass** for database data
3. **Use Postman** for API testing
4. **Check browser console** for JavaScript errors
5. **Check server logs** in terminal for backend errors
6. **Clear browser cache** if styles don't update
7. **Use ?role=candidate** in register URL to pre-select role

---

## 🎯 Next Steps

After setup:
1. ✅ Test user registration and login
2. ✅ Create a job posting
3. ✅ Upload a resume
4. ✅ Apply to a job
5. ✅ Check AI matching scores
6. ✅ Review applications as recruiter
7. ✅ Update application status
8. ✅ Explore admin features

---

## 📞 Need Help?

- Check [DOCUMENTATION.md](DOCUMENTATION.md) for detailed docs
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for project overview
- Review code comments for implementation details
- Check browser console for error messages

---

## 🎉 Success!

Once everything is running, you should see:
- ✅ Frontend at http://localhost:3000
- ✅ Backend at http://localhost:5000
- ✅ Database connected
- ✅ Authentication working
- ✅ AI matching functional

**Happy hiring! 🚀**
