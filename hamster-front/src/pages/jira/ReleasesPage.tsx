import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import type { JiraReleaseVersion } from './jiraTypes';
import { MOCK_RELEASES, MOCK_ISSUES } from './mockData';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Released: 'bg-green-100 text-green-700 border border-green-200',
    Unreleased: 'bg-blue-50 text-[#0052CC] border border-blue-200',
    Archived: 'bg-gray-100 text-gray-500 border border-gray-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function getIssueCountForVersion(versionName: string): { open: number; resolved: number; total: number } {
  const matching = MOCK_ISSUES.filter(
    (i) => i.fixVersions?.some((v) => v.name === versionName)
  );
  const resolved = matching.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  return { open: matching.length - resolved, resolved, total: matching.length };
}

export function ReleasesPage() {
  const [filter, setFilter] = useState<'all' | 'Released' | 'Unreleased' | 'Archived'>('all');

  const filtered = MOCK_RELEASES.filter((r) => filter === 'all' || r.status === filter);
  const sorted = [...filtered].sort((a, b) => b.name.localeCompare(a.name));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border flex-shrink-0">
        <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Releases</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0052CC] text-white rounded text-sm hover:bg-blue-700 transition-colors">
          <Plus size={14} strokeWidth={1.5} />
          Create version
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-8 py-2 border-b border-border flex-shrink-0">
        {(['all', 'Unreleased', 'Released', 'Archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              filter === f
                ? 'bg-[#E9F2FF] text-[#0052CC] font-semibold'
                : 'text-foreground hover:bg-accent'
            }`}
          >
            {f === 'all' ? 'All versions' : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-background border-b border-border z-10">
            <tr>
              <th className="text-left px-8 py-3 text-muted-foreground font-semibold">Version</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-28">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-36">Start date</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-36">Release date</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-48">Progress</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Description</th>
              <th className="text-right px-8 py-3 text-muted-foreground font-semibold w-24"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-12 italic">
                  No releases found.
                </td>
              </tr>
            ) : (
              sorted.map((release) => (
                <ReleaseRow key={release.id} release={release} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReleaseRow({ release }: { release: JiraReleaseVersion }) {
  const counts = getIssueCountForVersion(release.name);
  const progressPct = counts.total > 0 ? Math.round((counts.resolved / counts.total) * 100) : 0;

  return (
    <tr className="border-b border-border hover:bg-accent/30 transition-colors">
      <td className="px-8 py-3">
        <button className="text-[#0052CC] hover:underline font-semibold">{release.name}</button>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={release.status} />
      </td>
      <td className="px-4 py-3 text-foreground">{formatDate(release.startDate)}</td>
      <td className="px-4 py-3 text-foreground">{formatDate(release.releaseDate)}</td>
      <td className="px-4 py-3">
        {counts.total > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{progressPct}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {counts.open > 0 && <span>{counts.open} open</span>}
              {counts.open > 0 && counts.resolved > 0 && <span> · </span>}
              {counts.resolved > 0 && <span>{counts.resolved} done</span>}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">No issues</span>
        )}
      </td>
      <td className="px-4 py-3 text-foreground">{release.description || ''}</td>
      <td className="px-8 py-3 text-right">
        <button className="text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown size={16} strokeWidth={1.5} />
        </button>
      </td>
    </tr>
  );
}
