import { useState } from 'react';
import { Search } from 'lucide-react';
import type { JiraComponent } from './jiraTypes';
import { MOCK_COMPONENTS } from './mockData';

function AvatarCircle({ name, size = 20 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#4BADE8', '#904EE2', '#63BA3C', '#FF7A00', '#E5493A'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: Math.floor(size * 0.38) }}
    >
      {initials}
    </span>
  );
}

export function ComponentsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'ACTIVE' | 'ARCHIVED'>('all');

  const filtered = MOCK_COMPONENTS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="px-8 py-5 border-b border-border flex-shrink-0">
        <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Components</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-8 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 border border-border rounded px-2.5 py-1.5 bg-background w-56">
          <Search size={14} strokeWidth={1.5} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Quick Filters:</span>
          <button
            onClick={() => setFilter(filter === 'ACTIVE' ? 'all' : 'ACTIVE')}
            className={`text-sm px-2 py-0.5 rounded hover:bg-accent transition-colors ${
              filter === 'ACTIVE' ? 'text-[#0052CC] font-semibold' : 'text-foreground'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter(filter === 'ARCHIVED' ? 'all' : 'ARCHIVED')}
            className={`text-sm px-2 py-0.5 rounded hover:bg-accent transition-colors ${
              filter === 'ARCHIVED' ? 'text-[#0052CC] font-semibold' : 'text-foreground'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-background border-b border-border z-10">
            <tr>
              <th className="text-left px-8 py-3 text-muted-foreground font-semibold w-48">Component</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-28">Status</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-36">Issues</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-48">Lead</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Description</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-40">Default assignee</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted-foreground py-12 italic">
                  No components found.
                </td>
              </tr>
            ) : (
              filtered.map((component) => (
                <ComponentRow key={component.id} component={component} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComponentRow({ component }: { component: JiraComponent }) {
  return (
    <tr className="border-b border-border hover:bg-accent/30 transition-colors">
      <td className="px-8 py-3">
        <button className="text-[#0052CC] hover:underline text-left">{component.name}</button>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide ${
            component.status === 'ACTIVE'
              ? 'bg-[#E9F2FF] text-[#0052CC] border border-[#CCE0FF]'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}
        >
          {component.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <button className="text-[#0052CC] hover:underline">
          {component.issueCount.toLocaleString()} Issues
        </button>
      </td>
      <td className="px-4 py-3">
        {component.lead ? (
          <span className="flex items-center gap-2">
            <AvatarCircle name={component.lead} size={20} />
            <span className="text-foreground">{component.lead}</span>
          </span>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <span className="text-foreground">{component.description || ''}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-foreground">{component.defaultAssignee}</span>
      </td>
    </tr>
  );
}
