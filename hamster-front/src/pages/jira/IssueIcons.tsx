import type {IssueType} from './jiraTypes';

// Issue type icon
export function IssueTypeIcon({type, size = 16}: { type: IssueType; size?: number }) {
    const s = size;
    switch (type) {
        case 'TASK':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="2" fill="#4BADE8"/>
                    <path d="M3.5 8L6.5 11L12.5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            );
        case 'BUG':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#E5493A"/>
                    <circle cx="8" cy="8" r="3.5" fill="white"/>
                </svg>
            );
        case 'STORY':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="2" fill="#63BA3C"/>
                    <path d="M5 3L11 8L5 13" fill="white"/>
                </svg>
            );
        case 'EPIC':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="2" fill="#904EE2"/>
                    <path d="M8 2L10.5 6.5H14L10.5 9.5L12 14L8 11L4 14L5.5 9.5L2 6.5H5.5L8 2Z" fill="white"/>
                </svg>
            );
        case 'IMPROVEMENT':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="2" fill="#4BADE8"/>
                    <path d="M8 11V5M5 8L8 5L11 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            );
        case 'INITIATIVE':
        default:
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="2" fill="#FF7A00"/>
                    <circle cx="8" cy="8" r="3.5" fill="white"/>
                </svg>
            );
    }
}

// Priority icon
export function PriorityIcon({priority, size = 16}: { priority: string; size?: number }) {
    const s = size;
    const p = priority?.toUpperCase();
    switch (p) {
        case 'BLOCKER':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#E5493A"/>
                    <rect x="4.5" y="7" width="7" height="2" rx="1" fill="white"/>
                </svg>
            );
        case 'CRITICAL':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L15 14H1L8 1Z" fill="#E5493A"/>
                    <path d="M8 5.5V9.5M8 11V11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        case 'MAJOR':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L13 12H3L8 2Z" fill="#FF7A00"/>
                </svg>
            );
        case 'MINOR':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <path d="M8 14L3 4H13L8 14Z" fill="#4BADE8"/>
                </svg>
            );
        case 'TRIVIAL':
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="#979797" strokeWidth="1.5" fill="none"/>
                    <path d="M8 5V10M6 8L8 10L10 8" stroke="#979797" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        default:
            return (
                <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" fill="#979797"/>
                </svg>
            );
    }
}

// GitHub icon
export function GitHubIcon({size = 16}: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
            <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
    );
}
