'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/services';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState(user);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await userService.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        headline: profileData.headline,
        bio: profileData.bio,
        location: profileData.location,
        skills: profileData.skills,
      });

      setEditing(false);
      setSuccess('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen ai-bg flex items-center justify-center muted text-sm sm:text-base">
          Loading...
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>

      <div className="min-h-screen ai-bg px-4 sm:px-6 py-6 sm:py-12">

        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="glass p-4 sm:p-6 lg:p-8 mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
              <p className="muted text-xs sm:text-sm">
                Manage your professional identity
              </p>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="px-4 sm:px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm sm:text-base flex-shrink-0"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* MESSAGES */}
          {error && (
            <div className="glass p-4 mb-6 text-red-400 text-xs sm:text-sm rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="glass p-4 mb-6 text-green-400 text-xs sm:text-sm rounded-xl">
              {success}
            </div>
          )}

          {/* BASIC INFO */}
          <div className="glass p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 space-y-4 sm:space-y-5">
            <h2 className="text-lg sm:text-xl font-semibold">Basic Information</h2>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                name="firstName"
                value={profileData?.firstName || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="First name"
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />

              <input
                name="lastName"
                value={profileData?.lastName || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Last name"
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* CONTACT */}
          <div className="glass p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 space-y-4 sm:space-y-5">
            <h2 className="text-lg sm:text-xl font-semibold">Contact</h2>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                value={profileData?.email || ''}
                disabled
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl opacity-50 text-sm sm:text-base"
              />

              <input
                name="phone"
                value={profileData?.phone || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Phone number"
                className="bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* CANDIDATE INFO */}
          {profileData?.role === 'candidate' && (
            <div className="glass p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold">Professional Profile</h2>

              <input
                name="headline"
                value={profileData?.headline || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Professional headline"
                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />

              <textarea
                name="bio"
                rows="3"
                value={profileData?.bio || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Short bio"
                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />

              <input
                name="location"
                value={profileData?.location || ''}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Location"
                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />

              <input
                value={profileData?.skills?.join(', ') || ''}
                onChange={(e) =>
                  setProfileData(p => ({
                    ...p,
                    skills: e.target.value.split(',').map(s => s.trim())
                  }))
                }
                disabled={!editing}
                placeholder="Skills (comma separated)"
                className="w-full bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl disabled:opacity-50 focus:outline-none focus:border-indigo-400 text-sm sm:text-base"
              />
            </div>
          )}

          {/* SAVE */}
          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 sm:py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold disabled:opacity-50 transition text-sm sm:text-base"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}

        </div>
      </div>

    </ProtectedRoute>
  );
}
