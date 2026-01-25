import Link from 'next/link';

export default function JobCard({ job }) {
  const matchingScore = job.matchingScore || 'N/A';
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            <Link href={`/jobs/${job.id}`}>
              {job.title}
            </Link>
          </h3>
          <p className="text-sm text-gray-600">{job.companyName}</p>
        </div>
        {matchingScore !== 'N/A' && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {matchingScore}% Match
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          {job.experienceLevel}
        </span>
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
          {job.location?.city || 'Remote'}
        </span>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            {job.salaryMin && job.salaryMax && (
              <p className="text-sm font-semibold text-gray-900">
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
              </p>
            )}
          </div>
          <Link 
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
