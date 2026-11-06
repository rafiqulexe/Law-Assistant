import React from 'react';
import { Link } from 'react-router-dom';
import { BellRing, ArrowRight } from 'lucide-react';
import { useLawUpdates, formatDate, describeChange } from '@/lib/lawUpdates';

// Bold strip at the bottom of every page with the most recent law change.
export default function LawUpdatesBanner() {
  const { data } = useLawUpdates(1);
  const latest = data?.updates?.[0];
  if (!latest) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-amber-500 text-slate-950 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 text-sm">
        <BellRing className="h-4 w-4 flex-shrink-0" />
        <p className="flex-1 min-w-0 truncate">
          <span className="font-extrabold uppercase tracking-wide mr-2">Recent update</span>
          <span className="font-bold">{latest.title}</span>
          <span className="hidden sm:inline"> - {describeChange(latest)} on {formatDate(latest.detected_at)}</span>
        </p>
        <Link
          to="/LawUpdates"
          className="flex items-center gap-1 font-bold whitespace-nowrap hover:underline"
        >
          All updates <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
