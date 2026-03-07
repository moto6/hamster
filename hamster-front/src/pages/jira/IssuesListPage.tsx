import {useEffect, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router';
import {ArrowDownUp, ChevronDown, ExternalLink} from 'lucide-react';
import type {JiraIssueDetail} from './jiraTypes';
import {fetchIssueList} from './jiraApi';
import {IssueTypeIcon} from './IssueIcons';
import {IssueDetailPanel} from './IssueDetailPanel';

type SortOrder = 'priority' | 'created' | 'updated' | 'key';

const SORT_LABELS: Record<SortOrder, string> = {
    priority: 'Order by Priority',
    created: 'Order by Created',
    updated: 'Order by Updated',
    key: 'Order by Key',
};

const PRIORITY_ORDER: Record<string, number> = {
    BLOCKER: 0, CRITICAL: 1, MAJOR: 2, MINOR: 3, TRIVIAL: 4,
};

export function IssuesListPage() {
    const {projectKey = 'KAFKA', issueKey: paramIssueKey} = useParams<{
        projectKey: string;
        issueKey?: string;
    }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [issues, setIssues] = useState<JiraIssueDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(
        paramIssueKey || null
    );
    const [selectedIssue, setSelectedIssue] = useState<JiraIssueDetail | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('priority');
    const [sortDesc, setSortDesc] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    // const [detailLoading, setDetailLoading] = useState(false);

    const filter = searchParams.get('filter') || 'allopenissues';

    useEffect(() => {
        loadIssues();
    }, []);

    useEffect(() => {
        if (paramIssueKey) {
            setSelectedIssueKey(paramIssueKey);
        }
    }, [paramIssueKey]);

    useEffect(() => {
        if (selectedIssueKey && issues.length > 0) {
            const found = issues.find((i) => i.issueKey === selectedIssueKey) || null;
            setSelectedIssue(found);
        }
    }, [selectedIssueKey, issues]);

    async function loadIssues() {
        setLoading(true);
        try {
            const data = await fetchIssueList();
            setIssues(data as JiraIssueDetail[]);
            // Auto-select first if none selected
            if (!selectedIssueKey && data.length > 0) {
                const first = data[0];
                setSelectedIssueKey(first.issueKey);
                setSelectedIssue(first as JiraIssueDetail);
            }
        } finally {
            setLoading(false);
        }
    }

    function handleSelectIssue(issue: JiraIssueDetail) {
        setSelectedIssueKey(issue.issueKey);
        setSelectedIssue(issue);
        navigate(`/jira/projects/${projectKey}/issues/${issue.issueKey}?filter=${filter}`, {replace: true});
    }

    function getSortedIssues(): JiraIssueDetail[] {
        return [...issues].sort((a, b) => {
            let cmp = 0;
            if (sortOrder === 'priority') {
                cmp = (PRIORITY_ORDER[a.priority?.toUpperCase() ?? ''] ?? 99) -
                    (PRIORITY_ORDER[b.priority?.toUpperCase() ?? ''] ?? 99);
            } else if (sortOrder === 'created') {
                cmp = (a.createdAt || '').localeCompare(b.createdAt || '');
            } else if (sortOrder === 'updated') {
                cmp = (a.updatedAt || '').localeCompare(b.updatedAt || '');
            } else if (sortOrder === 'key') {
                cmp = a.issueKey.localeCompare(b.issueKey);
            }
            return sortDesc ? -cmp : cmp;
        });
    }

    const sortedIssues = getSortedIssues();
    const selectedIndex = selectedIssueKey
        ? sortedIssues.findIndex((i) => i.issueKey === selectedIssueKey)
        : -1;

    function handlePrevIssue() {
        if (selectedIndex > 0) handleSelectIssue(sortedIssues[selectedIndex - 1]);
    }

    function handleNextIssue() {
        if (selectedIndex < sortedIssues.length - 1) handleSelectIssue(sortedIssues[selectedIndex + 1]);
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between px-6 py-3 border-b border-border bg-background flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl" style={{fontSize: '20px', fontWeight: 600}}>Open issues</h1>
                    <button className="flex items-center gap-1 text-sm text-[#0052CC] hover:underline">
                        Switch filter
                        <ChevronDown size={14} strokeWidth={1.5}/>
                    </button>
                </div>
                <button className="text-sm text-[#0052CC] hover:underline flex items-center gap-1">
                    View all issues and filters
                    <ExternalLink size={12} strokeWidth={1.5}/>
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Issue List Panel */}
                <div className="w-[280px] flex-shrink-0 border-r border-border flex flex-col bg-background">
                    {/* Sort controls */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border flex-shrink-0">
                        <div className="relative flex-1">
                            <button
                                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-border rounded text-sm bg-background hover:bg-accent w-full justify-between"
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                <span className="text-foreground truncate">{SORT_LABELS[sortOrder]}</span>
                                <ChevronDown size={14} strokeWidth={1.5}
                                             className="text-muted-foreground flex-shrink-0"/>
                            </button>
                            {showSortMenu && (
                                <div
                                    className="absolute top-full left-0 mt-1 bg-background border border-border rounded shadow-lg z-20 w-48">
                                    {(Object.keys(SORT_LABELS) as SortOrder[]).map((key) => (
                                        <button
                                            key={key}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${sortOrder === key ? 'text-[#0052CC]' : 'text-foreground'}`}
                                            onClick={() => {
                                                setSortOrder(key);
                                                setShowSortMenu(false);
                                            }}
                                        >
                                            {SORT_LABELS[key]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="p-1.5 border border-border rounded hover:bg-accent flex-shrink-0"
                            onClick={() => setSortDesc(!sortDesc)}
                            title={sortDesc ? 'Ascending' : 'Descending'}
                        >
                            <ArrowDownUp size={16} strokeWidth={1.5} className="text-muted-foreground"/>
                        </button>
                    </div>

                    {/* Issue list */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                Loading issues...
                            </div>
                        ) : (
                            sortedIssues.map((issue) => (
                                <button
                                    key={issue.issueKey}
                                    className={`w-full text-left px-3 py-2.5 border-b border-border hover:bg-accent/50 transition-colors ${
                                        selectedIssueKey === issue.issueKey
                                            ? 'bg-blue-50 border-l-2 border-l-[#0052CC]'
                                            : 'border-l-2 border-l-transparent'
                                    }`}
                                    onClick={() => handleSelectIssue(issue)}
                                >
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <IssueTypeIcon type={issue.issueType} size={14}/>
                                        <span className="text-xs text-[#0052CC] hover:underline">{issue.issueKey}</span>
                                    </div>
                                    <div className="text-xs text-foreground line-clamp-2 pl-0.5">
                                        {issue.summary}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Issue Detail Panel */}
                <div className="flex-1 overflow-hidden">
                    {selectedIssue ? (
                        <IssueDetailPanel
                            issue={selectedIssue}
                            currentIndex={selectedIndex + 1}
                            total={sortedIssues.length}
                            onPrev={handlePrevIssue}
                            onNext={handleNextIssue}
                            onOpenFull={() =>
                                navigate(`/jira/browse/${selectedIssue.issueKey}`)
                            }
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            Select an issue to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}