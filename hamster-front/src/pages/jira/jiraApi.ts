/**
 * Jira API service
 * All communication uses: GET/POST {{server}}/api/v0/jira/issue
 * Authorization: Bearer {{token}}
 * Replace BASE_URL and getToken() with your actual server URL and auth token
 */

import type { JiraIssueResult, JiraIssueDetail, JiraIssueCreateRequest } from './jiraTypes';
import { MOCK_ISSUES } from './mockData';

const BASE_URL = '/api/v0'; // Replace with actual server URL

function getToken(): string {
  // Replace with actual token retrieval logic (e.g., from localStorage or auth context)
  return localStorage.getItem('auth_token') || 'YOUR_AUTH_TOKEN_HERE';
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

// Simulate network delay for mock responses
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchIssueList(): Promise<JiraIssueResult[]> {
  try {
    const response = await fetch(`${BASE_URL}/jira/issue`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch {
    // Return mock data when API is unavailable
    await delay(300);
    return MOCK_ISSUES;
  }
}

export async function fetchIssueDetail(issueKey: string): Promise<JiraIssueDetail> {
  try {
    const response = await fetch(`${BASE_URL}/jira/issue/${issueKey}`, {
      method: 'GET',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch {
    // Return mock data when API is unavailable
    await delay(200);
    const found = MOCK_ISSUES.find((i) => i.issueKey === issueKey);
    if (!found) throw new Error(`Issue ${issueKey} not found`);
    return found;
  }
}

export async function createIssue(data: JiraIssueCreateRequest): Promise<JiraIssueResult> {
  const response = await fetch(`${BASE_URL}/jira/issue`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return await response.json();
}
