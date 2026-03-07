// Jira TypeScript interfaces matching the backend API contract

export type IssueType = 'EPIC' | 'INITIATIVE' | 'TASK' | 'BUG' | 'STORY' | 'IMPROVEMENT';
export type Priority = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'TRIVIAL';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';

export interface JiraReleaseVersion {
    id: string;
    name: string;
    status: 'Unreleased' | 'Released' | 'Archived';
    startDate?: string;
    releaseDate?: string;
    description?: string;
}

export interface JiraIssueResult {
    issueId: string;
    issueKey: string;
    issueType: IssueType;
    summary: string;
    status: string | null;
    priority: string | null;
    releaseVersions: JiraReleaseVersion[];
    resolution: string | null;
    assignee: string | null;
    reporter: string | null;
    creator: string | null;
    projectKey: string | null;
    projectName: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    resolvedAt: string | null;
    components: string | null;
    labels: string | null;
    customProjectType: string | null;
    dateOfFirstResponse: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
    createdDt: string | null;
    updatedDt: string | null;
}

export interface JiraIssueCreateRequest {
    issue_type: string;
    parentIssueKey?: string;
    summary: string;
    status: string;
    priority: string;
    assignee: string;
    reporter: string;
    creator: string;
    labels: string[];
    startDate: string;
    endDate: string;
    description: string;
}

export interface JiraComponent {
    id: string;
    name: string;
    status: 'ACTIVE' | 'ARCHIVED';
    issueCount: number;
    lead: string | null;
    leadAvatar: string | null;
    description: string | null;
    defaultAssignee: string;
}

export interface IssueLink {
    type: 'fixes' | 'links to' | 'is blocked by' | 'duplicates' | 'relates to';
    issueKey: string;
    summary: string;
    priority: string;
    status: string;
    url?: string;
}

export interface ActivityComment {
    id: string;
    author: string;
    authorAvatar: string | null;
    date: string;
    content: string;
}

export interface JiraIssueDetail extends JiraIssueResult {
    issueLinks: IssueLink[];
    comments: ActivityComment[];
    votes: number;
    watchers: number;
    fixVersions: JiraReleaseVersion[];
    affectsVersions: JiraReleaseVersion[];
}
