'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/services/index';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState(user);
  const [editing, setEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError('');
      
      await userService.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        headline: profileData.headline,
        bio: profileData.bio,
        location: profileData.location,
        skills: profileData.skills
      });

      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <ProtectedRoute><div>Loading...</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}
            {success && <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">{success}</div>}

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData?.firstName || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData?.lastName || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData?.phone || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Candidate Specific Fields */}
              {profileData?.role === 'candidate' && (
                <>
                  <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                        <input
                          type="text"
                          name="headline"
                          value={profileData?.headline || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          placeholder="e.g., Senior React Developer"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={profileData?.bio || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={profileData?.location || ''}
                          onChange={handleInputChange}
                          disabled={!editing}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                        <input
                          type="text"
                          value={profileData?.skills?.join(', ') || ''}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            skills: e.target.value.split(',').map(s => s.trim())
                          }))}
                          disabled={!editing}
                          placeholder="React, Node.js, MongoDB"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              {editing && (
                <div className="border-t pt-6">
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
