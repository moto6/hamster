import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router';
import {ChevronDown, ChevronRight, Upload} from 'lucide-react';
import type {JiraIssueDetail} from './jiraTypes';
import {fetchIssueDetail} from './jiraApi';
import {GitHubIcon, IssueTypeIcon, PriorityIcon} from './IssueIcons';

function StatusBadge({status}: { status: string | null }) {
    if (!status) return null;
    const s = status.toUpperCase().replace('_', ' ');
    const styles: Record<string, string> = {
        OPEN: 'bg-[#0052CC] text-white',
        'IN PROGRESS': 'bg-blue-400 text-white',
        RESOLVED: 'bg-green-600 text-white',
        CLOSED: 'bg-gray-500 text-white',
        REOPENED: 'bg-orange-500 text-white',
    };
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[s] || 'bg-gray-400 text-white'}`}>
      {s}
    </span>
    );
}

function AvatarCircle({name, size = 24}: { name: string; size?: number }) {
    const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#4BADE8', '#904EE2', '#63BA3C', '#FF7A00', '#E5493A'];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <span
            className="inline-flex items-center justify-center rounded-full text-white flex-shrink-0"
            style={{width: size, height: size, backgroundColor: color, fontSize: Math.floor(size * 0.38)}}
        >
      {initials}
    </span>
    );
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function Section({title, children, defaultOpen = true}: SectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="mb-6">
            <button
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-3 hover:opacity-70"
                onClick={() => setOpen(!open)}
            >
                <ChevronDown
                    size={14}
                    strokeWidth={1.5}
                    className={`transition-transform ${open ? '' : '-rotate-90'}`}
                />
                {title}
            </button>
            {open && children}
        </div>
    );
}

export function IssueDetailPage() {
    const {issueKey} = useParams<{ issueKey: string }>();
    // const navigate = useNavigate();
    const [issue, setIssue] = useState<JiraIssueDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('Comments');

    useEffect(() => {
        if (!issueKey) return;
        loadIssue(issueKey);
    }, [issueKey]);

    async function loadIssue(key: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchIssueDetail(key);
            setIssue(data);
        } catch (error) {
            setError(`Could not load issue ${key} , ${error}`);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Loading issue...
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="flex items-center justify-center h-full text-sm text-red-500">
                {error || 'Issue not found'}
            </div>
        );
    }

    const projectKey = issue.projectKey || 'KAFKA';

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2">
                    <IssueTypeIcon type={issue.issueType} size={24}/>
                    <div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-0.5">
                            <Link
                                to={`/jira/projects/${projectKey}/issues`}
                                className="text-[#0052CC] hover:underline px-1 py-0.5 bg-blue-50 rounded"
                            >
                                {issue.projectName || projectKey}
                            </Link>
                            <ChevronRight size={14} strokeWidth={1.5}/>
                            <span className="text-foreground">{issue.issueKey}</span>
                        </div>
                        <h1 style={{fontSize: '20px', fontWeight: 600, lineHeight: 1.3}}>{issue.summary}</h1>
                    </div>
                </div>
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-sm hover:bg-accent flex-shrink-0">
                    <Upload size={14} strokeWidth={1.5}/>
                    Export
                    <ChevronDown size={14} strokeWidth={1.5}/>
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-[1fr_280px] min-h-full">
                    {/* Left column */}
                    <div className="px-8 py-6 border-r border-border">
                        {/* Details */}
                        <Section title="Details">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm ml-5">
                                {/* Left */}
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-32 flex-shrink-0">Type:</span>
                                        <span className="flex items-center gap-1.5">
                      <IssueTypeIcon type={issue.issueType} size={14}/>
                                            {issue.issueType.charAt(0) + issue.issueType.slice(1).toLowerCase()}
                    </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-32 flex-shrink-0">Priority:</span>
                                        <span className="flex items-center gap-1.5">
                      <PriorityIcon priority={issue.priority || ''} size={14}/>
                                            {issue.priority ? issue.priority.charAt(0) + issue.priority.slice(1).toLowerCase() : '—'}
                    </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span
                                            className="text-muted-foreground w-32 flex-shrink-0">Affects Version/s:</span>
                                        <span>{issue.affectsVersions?.length ? issue.affectsVersions.map(v => v.name).join(', ') : 'None'}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-32 flex-shrink-0">Component/s:</span>
                                        {issue.components ? (
                                            <span
                                                className="text-[#0052CC] hover:underline cursor-pointer">{issue.components}</span>
                                        ) : <span>None</span>}
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-32 flex-shrink-0">Labels:</span>
                                        {issue.labels ? (
                                            <span
                                                className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                        {issue.labels}
                      </span>
                                        ) : <span>None</span>}
                                    </div>
                                </div>
                                {/* Right */}
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Status:</span>
                                        <StatusBadge status={issue.status}/>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Resolution:</span>
                                        <span style={{fontWeight: 600}}>{issue.resolution || 'Unresolved'}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-28 flex-shrink-0">Fix Version/s:</span>
                                        {issue.fixVersions?.length ? (
                                            <span className="text-[#0052CC] hover:underline cursor-pointer">
                        {issue.fixVersions.map(v => v.name).join(', ')}
                      </span>
                                        ) : <span>None</span>}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Description */}
                        <Section title="Description">
                            <div className="text-sm text-foreground ml-5 leading-relaxed">
                                {issue.description ||
                                    <span className="text-muted-foreground italic">No description provided.</span>}
                            </div>
                        </Section>

                        {/* Issue Links */}
                        {issue.issueLinks && issue.issueLinks.length > 0 && (
                            <Section title="Issue Links">
                                <div className="ml-5 text-sm">
                                    {Array.from(new Set(issue.issueLinks.map(l => l.type))).map((linkType) => (
                                        <div key={linkType} className="mb-4">
                                            <div className="text-muted-foreground mb-2">{linkType}</div>
                                            {issue.issueLinks.filter(l => l.type === linkType).map((link) => (
                                                <div
                                                    key={link.issueKey}
                                                    className="flex items-center gap-2 py-2 border-b border-border last:border-b-0"
                                                >
                                                    {link.url ? (
                                                        <>
                                                            <GitHubIcon size={16}/>
                                                            <a href={link.url}
                                                               className="text-[#0052CC] hover:underline">{link.summary}</a>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PriorityIcon priority={link.priority} size={14}/>
                                                            <span
                                                                className="text-[#0052CC] hover:underline cursor-pointer">{link.issueKey}</span>
                                                            <span
                                                                className="text-foreground flex-1">{link.summary}</span>
                                                            {link.status === 'RESOLVED' && (
                                                                <span
                                                                    className="px-2 py-0.5 bg-green-600 text-white text-xs rounded font-semibold">
                                  RESOLVED
                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {/* Activity */}
                        <Section title="Activity">
                            <div className="ml-5">
                                <div className="flex items-center gap-5 border-b border-border pb-2 mb-4">
                                    {['All', 'Comments', 'Work Log', 'History', 'Activity', 'Transitions'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`text-sm pb-2 -mb-2 border-b-2 transition-colors ${
                                                activeTab === tab
                                                    ? 'border-[#0052CC] text-[#0052CC]'
                                                    : 'border-transparent text-foreground hover:text-[#0052CC]'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                {issue.comments && issue.comments.length > 0 ? (
                                    issue.comments.map((comment) => (
                                        <div key={comment.id}
                                             className="flex gap-3 py-3 border-b border-border last:border-b-0">
                                            <AvatarCircle name={comment.author} size={28}/>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <button
                                                        className="text-sm text-[#0052CC] hover:underline">{comment.author}</button>
                                                    <span className="text-xs text-muted-foreground">
                            added a comment -{' '}
                                                        {new Date(comment.date).toLocaleString('en-GB', {
                                                            day: '2-digit', month: 'short', year: '2-digit',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                          </span>
                                                </div>
                                                <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground italic py-3">No activity yet.</div>
                                )}
                            </div>
                        </Section>
                    </div>

                    {/* Right column */}
                    <div className="px-6 py-6">
                        {/* People */}
                        <Section title="People">
                            <div className="space-y-3 text-sm ml-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Assignee:</span>
                                    {issue.assignee ? (
                                        <span className="flex items-center gap-2">
                      <AvatarCircle name={issue.assignee} size={22}/>
                      <span className="text-[#0052CC] hover:underline cursor-pointer">{issue.assignee}</span>
                    </span>
                                    ) : <span className="text-muted-foreground">Unassigned</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Reporter:</span>
                                    {issue.reporter ? (
                                        <span className="flex items-center gap-2">
                      <AvatarCircle name={issue.reporter} size={22}/>
                      <span className="text-[#0052CC] hover:underline cursor-pointer">{issue.reporter}</span>
                    </span>
                                    ) : <span className="text-muted-foreground">—</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Votes:</span>
                                    <span
                                        className="w-5 h-5 rounded bg-gray-200 text-xs flex items-center justify-center">{issue.votes ?? 0}</span>
                                    <button className="text-[#0052CC] hover:underline text-xs">Vote for this issue
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Watchers:</span>
                                    <span
                                        className="w-5 h-5 rounded bg-gray-200 text-xs flex items-center justify-center">{issue.watchers ?? 0}</span>
                                    <button className="text-[#0052CC] hover:underline text-xs">Start watching this
                                        issue
                                    </button>
                                </div>
                            </div>
                        </Section>

                        {/* Dates */}
                        <Section title="Dates">
                            <div className="space-y-2.5 text-sm ml-4">
                                <div className="flex gap-3">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Created:</span>
                                    <span>
                    {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleString('en-GB', {
                            day: '2-digit', month: 'short', year: '2-digit',
                            hour: '2-digit', minute: '2-digit'
                        })
                        : '—'}
                  </span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-muted-foreground w-20 flex-shrink-0">Updated:</span>
                                    <span>
                    {issue.updatedAt
                        ? new Date(issue.updatedAt).toLocaleString('en-GB', {
                            day: '2-digit', month: 'short', year: '2-digit',
                            hour: '2-digit', minute: '2-digit'
                        })
                        : '—'}
                  </span>
                                </div>
                                {issue.resolvedAt && (
                                    <div className="flex gap-3">
                                        <span className="text-muted-foreground w-20 flex-shrink-0">Resolved:</span>
                                        <span>
                      {new Date(issue.resolvedAt).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', year: '2-digit',
                          hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}
