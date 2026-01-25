'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resumeService } from '@/services/index';
import { ProtectedRoute } from '@/hooks/ProtectedRoute';

export default function UploadResumePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
        setError('Only PDF and Word documents are supported');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // In a real application, you would upload to cloud storage (S3, etc.)
      // For now, we'll read the file as text
      const text = await file.text();

      await resumeService.uploadResume({
        fileName: file.name,
        fileUrl: `/uploads/${file.name}`, // This would be the cloud URL
        fileSize: file.size,
        mimeType: file.type,
        resumeText: text
      });

      setSuccess('Resume uploaded successfully!');
      setFile(null);
      
      setTimeout(() => {
        router.push('/resumes');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['candidate']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Resume</h1>
            <p className="text-gray-600 mb-8">Upload your resume to apply for jobs and let AI match it with opportunities</p>

            {error && <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">{error}</div>}
            {success && <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-input"
                />
                
                <label htmlFor="resume-input" className="cursor-pointer">
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {file ? file.name : 'Drop your resume here or click to select'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </label>
              </div>

              {file && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">
                    Selected: <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-sm text-blue-700">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </form>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Your resume will be parsed and analyzed by our AI</li>
                <li>✓ Skills, experience, and education will be extracted</li>
                <li>✓ You can use this resume to apply for jobs</li>
                <li>✓ Recruiters will see your AI-generated matching score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
