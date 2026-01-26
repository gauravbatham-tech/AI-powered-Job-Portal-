import Link from 'next/link';

export default function JobCard({ job }) {
  const score = job.matchingScore;

  return (
    <div className="glass glass-hover p-4 sm:p-5 lg:p-6 flex flex-col h-full">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job.id}`}
            className="text-base sm:text-lg font-semibold hover:text-indigo-400 transition line-clamp-2"
          >
            {job.title}
          </Link>
          <p className="text-xs sm:text-sm muted truncate">{job.companyName}</p>
        </div>

        {score && (
          <div className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-400/30 flex-shrink-0">
            {score}% Match
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-xs sm:text-sm muted line-clamp-2 mb-4 flex-grow">
        {job.description}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 truncate">
          {job.experienceLevel}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 truncate">
          {job.location?.city || 'Remote'}
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-2 border-t border-white/10 pt-4 mt-auto">
        <div className="text-xs sm:text-sm font-semibold truncate">
          {job.salaryMin && job.salaryMax && (
            <>
              ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
            </>
          )}
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs sm:text-sm whitespace-nowrap"
        >
          View →
        </Link>
      </div>

    </div>
  );
}
