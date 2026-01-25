import Link from 'next/link';

export default function JobCard({ job }) {
  const score = job.matchingScore;

  return (
    <div className="glass glass-hover p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link
            href={`/jobs/${job.id}`}
            className="text-lg font-semibold hover:text-indigo-400 transition"
          >
            {job.title}
          </Link>
          <p className="text-sm muted">{job.companyName}</p>
        </div>

        {score && (
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-400/30">
            {score}% Match
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <p className="text-sm muted line-clamp-2 mb-5">
        {job.description}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10">
          {job.experienceLevel}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10">
          {job.location?.city || 'Remote'}
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center border-t border-white/10 pt-4">
        <div className="text-sm font-semibold">
          {job.salaryMin && job.salaryMax && (
            <>
              ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
            </>
          )}
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm"
        >
          View →
        </Link>
      </div>

    </div>
  );
}
