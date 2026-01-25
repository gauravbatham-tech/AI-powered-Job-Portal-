const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();
    const totalHires = await Application.countDocuments({ status: 'accepted' });

    const stats = {
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      totalHires,
      conversionRate: totalUsers > 0 ? ((totalApplications / totalCandidates) * 100).toFixed(2) : 0,
      hireRate: totalApplications > 0 ? ((totalHires / totalApplications) * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics: ' + error.message
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isVerified, page = 1, limit = 10 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpiry')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users: ' + error.message
    });
  }
};

// Verify user (admin only)
exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    user.adminVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'User verified successfully',
      user
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying user: ' + error.message
    });
  }
};

// Deactivate user (admin only)
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user: ' + error.message
    });
  }
};

// Get job analytics
exports.getJobAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get job stats
    const totalJobs = await Job.countDocuments(query);
    const activeJobs = await Job.countDocuments({ ...query, status: 'open' });
    const closedJobs = await Job.countDocuments({ ...query, status: 'closed' });

    // Get category breakdown
    const categoryBreakdown = await Job.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get experience level breakdown
    const experienceBreakdown = await Job.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$experienceLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        totalJobs,
        activeJobs,
        closedJobs,
        categoryBreakdown,
        experienceBreakdown,
        averageApplicationsPerJob: totalJobs > 0 
          ? (await Job.aggregate([
              { $match: query },
              { $group: { _id: null, avgApplications: { $avg: '$applicationsCount' } } }
            ]))[0]?.avgApplications || 0
          : 0
      }
    });
  } catch (error) {
    console.error('Get job analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job analytics: ' + error.message
    });
  }
};

// Get application analytics
exports.getApplicationAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Status breakdown
    const statusBreakdown = await Application.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Matching score distribution
    const scoreDistribution = await Application.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$matchingScore',
          boundaries: [0, 25, 50, 75, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments(query);
    const acceptedCount = await Application.countDocuments({ ...query, status: 'accepted' });
    const rejectedCount = await Application.countDocuments({ ...query, status: 'rejected' });

    res.json({
      success: true,
      analytics: {
        totalApplications,
        acceptedCount,
        rejectedCount,
        conversionRate: totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(2) : 0,
        statusBreakdown,
        scoreDistribution
      }
    });
  } catch (error) {
    console.error('Get application analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application analytics: ' + error.message
    });
  }
};

// Get top recruiters
exports.getTopRecruiters = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topRecruiters = await User.aggregate([
      { $match: { role: 'recruiter' } },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'recruiterId',
          as: 'jobs'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          company: 1,
          jobsPosted: { $size: '$jobs' },
          totalApplications: { $sum: '$jobs.applicationsCount' }
        }
      },
      { $sort: { jobsPosted: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      topRecruiters
    });
  } catch (error) {
    console.error('Get top recruiters error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top recruiters: ' + error.message
    });
  }
};

// Get top candidates
exports.getTopCandidates = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topCandidates = await User.aggregate([
      { $match: { role: 'candidate' } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'candidateId',
          as: 'applications'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          skills: 1,
          headline: 1,
          applicationsCount: { $size: '$applications' },
          averageMatchingScore: { $avg: '$applications.matchingScore' }
        }
      },
      { $sort: { averageMatchingScore: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      topCandidates
    });
  } catch (error) {
    console.error('Get top candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top candidates: ' + error.message
    });
  }
};
