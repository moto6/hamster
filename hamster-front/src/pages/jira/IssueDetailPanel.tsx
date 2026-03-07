import type {JiraIssueDetail} from './jiraTypes';
import {GitHubIcon, IssueTypeIcon, PriorityIcon} from './IssueIcons';
import {ChevronDown, ChevronRight, ChevronUp, Maximize2, Upload} from "lucide-react";

interface Props {
    issue: JiraIssueDetail;
    currentIndex: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
    onOpenFull: () => void;
}

function StatusBadge({status}: { status: string | null }) {
    if (!status) return null;
    const s = status.toUpperCase();
    const styles: Record<string, string> = {
        OPEN: 'bg-[#0052CC] text-white',
        IN_PROGRESS: 'bg-blue-400 text-white',
        RESOLVED: 'bg-green-600 text-white',
        CLOSED: 'bg-gray-500 text-white',
        REOPENED: 'bg-orange-500 text-white',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[s] || 'bg-gray-400 text-white'}`}>
      {s.replace('_', ' ')}
    </span>
    );
}

function AvatarCircle({name, size = 24}: { name: string; size?: number }) {
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#4BADE8', '#904EE2', '#63BA3C', '#FF7A00', '#E5493A'];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <span
            className="inline-flex items-center justify-center rounded-full text-white text-xs flex-shrink-0"
            style={{width: size, height: size, backgroundColor: color, fontSize: size * 0.38}}
        >
      {initials}
    </span>
    );
}

function SectionHeader({title, open, onToggle}: { title: string; open: boolean; onToggle: () => void }) {
    return (
        <button
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2 hover:opacity-70"
            onClick={onToggle}
        >
            <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={`transition-transform ${open ? '' : '-rotate-90'}`}
            />
            {title}
        </button>
    );
}

export function IssueDetailPanel({issue, currentIndex, total, onPrev, onNext, onOpenFull}: Props) {
    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Panel top bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{currentIndex} of {total}</span>
                    <button
                        onClick={onPrev}
                        disabled={currentIndex <= 1}
                        className="p-0.5 hover:bg-accent rounded disabled:opacity-30"
                    >
                        <ChevronUp size={16} strokeWidth={1.5}/>
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentIndex >= total}
                        className="p-0.5 hover:bg-accent rounded disabled:opacity-30"
                    >
                        <ChevronDown size={16} strokeWidth={1.5}/>
                    </button>
                    <button onClick={onOpenFull} className="p-0.5 hover:bg-accent rounded" title="Open full view">
                        <Maximize2 size={14} strokeWidth={1.5}/>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-sm hover:bg-accent">
                        <Upload size={14} strokeWidth={1.5}/>
                        Export
                        <ChevronDown size={14} strokeWidth={1.5}/>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Breadcrumb + Title */}
                <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                        <IssueTypeIcon type={issue.issueType} size={20}/>
                        <button
                            className="text-[#0052CC] hover:underline">{issue.projectName || issue.projectKey}</button>
                        <ChevronRight size={14} strokeWidth={1.5}/>
                        <span className="text-[#0052CC] hover:underline cursor-pointer">{issue.issueKey}</span>
                    </div>
                    <h2 className="text-lg" style={{fontWeight: 600, lineHeight: 1.4}}>
                        {issue.summary}
                    </h2>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-[1fr_220px] gap-0">
                    {/* Left column */}
                    <div className="px-6 py-4 border-r border-border">
                        {/* Details */}
                        <div className="mb-5">
                            <SectionHeader title="Details" open={true} onToggle={() => {
                            }}/>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm ml-4">
                                {/* Left col */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Type:</span>
                                        <span className="flex items-center gap-1.5">
                      <IssueTypeIcon type={issue.issueType} size={14}/>
                      <span>{issue.issueType.charAt(0) + issue.issueType.slice(1).toLowerCase()}</span>
                    </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Priority:</span>
                                        <span className="flex items-center gap-1.5">
                      <PriorityIcon priority={issue.priority || ''} size={14}/>
                      <span>{issue.priority ? issue.priority.charAt(0) + issue.priority.slice(1).toLowerCase() : '—'}</span>
                    </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span
                                            className="text-muted-foreground w-28 flex-shrink-0">Affects Version/s:</span>
                                        <span>{issue.affectsVersions?.length ? issue.affectsVersions.map(v => v.name).join(', ') : 'None'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Component/s:</span>
                                        <span>
                      {issue.components ? (
                          <span className="text-[#0052CC] hover:underline cursor-pointer">{issue.components}</span>
                      ) : 'None'}
                    </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Labels:</span>
                                        <span>
                      {issue.labels ? (
                          <span
                              className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs text-foreground">
                          {issue.labels}
                        </span>
                      ) : 'None'}
                    </span>
                                    </div>
                                </div>
                                {/* Right col */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-24 flex-shrink-0">Status:</span>
                                        <StatusBadge status={issue.status}/>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-24 flex-shrink-0">Resolution:</span>
                                        <span>{issue.resolution || 'Unresolved'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-muted-foreground w-24 flex-shrink-0">Fix Version/s:</span>
                                        <span>
                      {issue.fixVersions?.length ? (
                          <span className="text-[#0052CC] hover:underline cursor-pointer">
                          {issue.fixVersions.map(v => v.name).join(', ')}
                        </span>
                      ) : 'None'}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-5">
                            <SectionHeader title="Description" open={true} onToggle={() => {
                            }}/>
                            <div className="text-sm text-foreground ml-4 leading-relaxed">
                                {issue.description ||
                                    <span className="text-muted-foreground italic">No description provided.</span>}
                            </div>
                        </div>

                        {/* Issue Links */}
                        {issue.issueLinks && issue.issueLinks.length > 0 && (
                            <div className="mb-5">
                                <SectionHeader title="Issue Links" open={true} onToggle={() => {
                                }}/>
                                <div className="ml-4 text-sm">
                                    {Array.from(new Set(issue.issueLinks.map(l => l.type))).map((linkType) => (
                                        <div key={linkType} className="mb-3">
                                            <div className="text-muted-foreground mb-1.5">{linkType}</div>
                                            {issue.issueLinks.filter(l => l.type === linkType).map((link) => (
                                                <div key={link.issueKey}
                                                     className="flex items-center gap-2 py-1.5 border-b border-border last:border-b-0">
                                                    {link.url ? (
                                                        <>
                                                            <GitHubIcon size={14}/>
                                                            <span
                                                                className="text-[#0052CC] hover:underline cursor-pointer">{link.summary}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PriorityIcon priority={link.priority} size={14}/>
                                                            <span
                                                                className="text-[#0052CC] hover:underline cursor-pointer">{link.issueKey}</span>
                                                            <span
                                                                className="text-muted-foreground flex-1 truncate">{link.summary.replace(link.issueKey + ' ', '')}</span>
                                                            {link.status === 'RESOLVED' && (
                                                                <span
                                                                    className="px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">RESOLVED</span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Activity */}
                        <div className="mb-5">
                            <SectionHeader title="Activity" open={true} onToggle={() => {
                            }}/>
                            <div className="ml-4">
                                <div className="flex items-center gap-4 mb-3 border-b border-border pb-2">
                                    {['All', 'Comments', 'Work Log', 'History', 'Activity', 'Transitions'].map((tab, i) => (
                                        <button
                                            key={tab}
                                            className={`text-sm pb-2 -mb-2 border-b-2 ${i === 1 ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-foreground hover:text-[#0052CC]'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                {issue.comments && issue.comments.length > 0 ? (
                                    issue.comments.map((comment) => (
                                        <div key={comment.id}
                                             className="flex gap-3 py-3 border-b border-border last:border-b-0">
                                            <AvatarCircle name={comment.author} size={24}/>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className="text-sm font-medium text-[#0052CC] hover:underline cursor-pointer">{comment.author}</span>
                                                    <span className="text-xs text-muted-foreground">
                            added a comment - {new Date(comment.date).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                          </span>
                                                </div>
                                                <p className="text-sm text-foreground">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground py-3 italic">No comments yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right column: People + Dates */}
                    <div className="px-4 py-4">
                        {/* People */}
                        <div className="mb-5">
                            <SectionHeader title="People" open={true} onToggle={() => {
                            }}/>
                            <div className="space-y-2.5 text-sm ml-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Assignee:</span>
                                    {issue.assignee ? (
                                        <span className="flex items-center gap-1.5">
                      <AvatarCircle name={issue.assignee} size={20}/>
                      <span className="text-[#0052CC] hover:underline cursor-pointer">{issue.assignee}</span>
                    </span>
                                    ) : <span className="text-muted-foreground">Unassigned</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Reporter:</span>
                                    {issue.reporter ? (
                                        <span className="flex items-center gap-1.5">
                      <AvatarCircle name={issue.reporter} size={20}/>
                      <span className="text-[#0052CC] hover:underline cursor-pointer">{issue.reporter}</span>
                    </span>
                                    ) : <span className="text-muted-foreground">—</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Votes:</span>
                                    <span className="flex items-center gap-1.5">
                    <span
                        className="w-4 h-4 rounded bg-gray-200 text-xs flex items-center justify-center">{issue.votes ?? 0}</span>
                    <button className="text-[#0052CC] hover:underline text-xs">Vote for this issue</button>
                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Watchers:</span>
                                    <span className="flex items-center gap-1.5">
                    <span
                        className="w-4 h-4 rounded bg-gray-200 text-xs flex items-center justify-center">{issue.watchers ?? 0}</span>
                    <button className="text-[#0052CC] hover:underline text-xs">Start watching this issue</button>
                  </span>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div>
                            <SectionHeader title="Dates" open={true} onToggle={() => {
                            }}/>
                            <div className="space-y-2 text-sm ml-1">
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Created:</span>
                                    <span>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '—'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Updated:</span>
                                    <span>{issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}