'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resumeService } from '@/services';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';

export default function UploadResumePage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    if (
      ![
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(f.type)
    ) {
      setError('Only PDF or Word documents allowed');
      return;
    }

    setError('');
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setError('');

      const text = await file.text();

      await resumeService.uploadResume({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        resumeText: text,
      });

      setSuccess('Resume processed successfully');

      setTimeout(() => {
        router.push('/resumes');
      }, 1500);
    } catch {
      setError('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['candidate']}>

      <div className="min-h-screen ai-bg px-6 py-14">

        <div className="max-w-3xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">
              Upload Resume
            </h1>
            <p className="muted">
              Our AI reads your resume like a recruiter — not a keyword bot.
            </p>
          </div>

          {/* STATUS */}
          {error && (
            <div className="glass p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="glass p-4 mb-6 text-green-400">
              {success}
            </div>
          )}

          {/* UPLOAD */}
          <form onSubmit={handleSubmit} className="glass p-10 space-y-8">

            <label
              htmlFor="resume"
              className="block border border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-indigo-400 transition"
            >
              <input
                id="resume"
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

              <p className="text-lg font-semibold mb-2">
                {file ? file.name : 'Select your resume file'}
              </p>

              <p className="text-sm muted">
                PDF or Word · Max 5MB
              </p>
            </label>

            {file && (
              <div className="text-sm muted text-center">
                Size: {(file.size / 1024).toFixed(1)} KB
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold disabled:opacity-50"
            >
              {loading ? 'Analyzing resume...' : 'Upload & Analyze'}
            </button>
          </form>

          {/* WHAT HAPPENS */}
          <div className="glass p-8 mt-10 space-y-3 text-sm muted">
            <p>• AI extracts skills, experience, education</p>
            <p>• Profile score is generated automatically</p>
            <p>• Jobs are ranked by actual fit</p>
            <p>• Recruiters see structured insights</p>
          </div>

        </div>
      </div>

    </ProtectedRoute>
  );
}
