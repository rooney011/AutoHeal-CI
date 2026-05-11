/**
 * api.ts — Backend API service layer
 * Wraps all AutoHeal backend endpoints.
 * Frontend never computes logic — only displays.
 */

const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000';

// ─── Types (mirror backend schemas) ───────────────────────────────────────────

export type RunStatus = 'idle' | 'running' | 'done' | 'error';

export interface RunAgentRequest {
  repo_url: string;
  github_owner?: string;
  github_repo?: string;
  enable_ci_polling?: boolean;
  enable_push?: boolean;
}

/** Exact enum values from backend BugType. Never compute — read from API. */
export type BugType =
  | 'LINTING'
  | 'SYNTAX'
  | 'INDENTATION'
  | 'TYPE'
  | 'TEST_FAILURE'
  | 'TIMEOUT'
  | 'DEPENDENCY'
  | 'UNKNOWN';

export interface FailureItem {
  file: string;
  test_id: string;
  line: string | number;
  error_message: string;
  raw_output?: string;
  bug_type: BugType;
}

/** One attempt in the fix retry loop. Backend-only field 'reason' is not exposed. */
export interface IterationRecord {
  attempt: number;
  passed: boolean;
  duration_s: number;
}

export interface FixItem {
  failure: FailureItem;
  /** MUST start with 'ai-agent/' */
  branch: string;
  /** MUST start with 'fix:' */
  commit_message: string;
  retry_count: number;
  iterations: IterationRecord[];
}

export type CIConclusion = 'success' | 'failure' | 'cancelled' | 'skipped' | 'timeout';

export interface CITimelineNode {
  iteration: number;
  branch: string;
  passed: boolean;
  conclusion: CIConclusion;
  /** ISO 8601 UTC datetime */
  started_at: string;
  /** ISO 8601 UTC datetime */
  completed_at: string;
  ci_url?: string;
}

export interface ScoreBreakdown {
  total: number;
  breakdown: {
    base: number;
    speed_bonus: number;
    commit_penalty: number;
  };
}

export interface AgentResults {
  run_id: string;
  timestamp: string;
  repo: string;
  branch: string;
  success: boolean;
  time_taken_seconds: number;
  iterations: number;
  commit_count: number;
  score: ScoreBreakdown;
  failures: FailureItem[];
  fixes: FixItem[];
  ci_timeline: CITimelineNode[];
}

export interface StatusResponse {
  status: RunStatus;
  run_id: string | null;
  result: AgentResults | { error: string } | null;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export async function startAgent(req: RunAgentRequest): Promise<{ status: string; message: string }> {
  const res = await fetch(`${BASE_URL}/run-agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to start agent');
  }
  return res.json();
}

export async function pollStatus(): Promise<StatusResponse> {
  const res = await fetch(`${BASE_URL}/status`);
  if (!res.ok) throw new Error('Failed to poll status');
  return res.json();
}

export async function getLatestResults(): Promise<AgentResults | null> {
  const res = await fetch(`${BASE_URL}/results/latest`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch results');
  return res.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

/** Fetch the machine-readable API schema/contract from the backend. */
export async function getSchema(): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE_URL}/schema`);
  if (!res.ok) throw new Error('Failed to fetch schema');
  return res.json();
}

// ─── Data Mappers (backend → frontend props) ──────────────────────────────────

export function mapResultsToProps(results: AgentResults) {
  const summary = {
    repoUrl: results.repo,
    branchName: results.fixes[0]?.branch || results.branch,
    totalFailures: results.failures.length,
    fixesApplied: results.fixes.filter(f =>
      f.iterations.some(i => i.passed)
    ).length,
    status: results.success ? 'passed' as const : 'failed' as const,
    duration: `${results.time_taken_seconds}s`,
  };

  // Map ALL detected failures from the backend
  const detectedFailures = results.failures.map(f => {
    // Check if this failure was fixed
    const matchingFix = results.fixes.find(fix => fix.failure.file === f.file);
    const wasFixed = matchingFix ? matchingFix.iterations.some(i => i.passed) : false;
    return {
      file: f.file,
      bugType: f.bug_type,
      line: typeof f.line === 'string' ? f.line : String(f.line || '—'),
      errorMessage: f.error_message,
      status: wasFixed ? 'fixed' as const : 'detected' as const,
      branch: matchingFix?.branch || '—',
      commitHash: matchingFix?.commit_message || '—',
    };
  });

  const fixes = results.fixes.map(f => ({
    file: f.failure.file,
    type: f.failure.bug_type,
    line: typeof f.failure.line === 'string'
      ? parseInt(f.failure.line) || 0
      : f.failure.line,
    message: f.failure.error_message,
    status: f.iterations.some(i => i.passed) ? 'fixed' as const : 'failed' as const,
    branch: f.branch,
    commitMessage: f.commit_message,
  }));

  const timeline = results.ci_timeline.map((node, i) => ({
    timestamp: new Date(node.started_at).toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    }),
    status: node.passed ? 'pass' as const : 'fail' as const,
    iteration: String(node.iteration ?? i + 1),
  }));

  const score = {
    base: results.score.breakdown.base,
    speedBonus: results.score.breakdown.speed_bonus,
    commitPenalty: results.score.breakdown.commit_penalty,
    total: results.score.total,
  };

  return { summary, detectedFailures, fixes, timeline, score };
}

export function inferStepsFromStatus(status: RunStatus, result: AgentResults | null) {
  // Derive step progress from what we know about the run state
  const makeStep = (id: string, label: string, s: 'pending' | 'active' | 'complete') =>
    ({ id, label, status: s });

  if (status === 'idle') {
    return [
      makeStep('1', 'Cloning repository', 'pending'),
      makeStep('2', 'Discovering tests', 'pending'),
      makeStep('3', 'Running tests', 'pending'),
      makeStep('4', 'Applying fixes', 'pending'),
      makeStep('5', 'Monitoring CI/CD', 'pending'),
    ];
  }

  if (status === 'running') {
    // Show all steps as active since we don't have granular progress yet
    return [
      makeStep('1', 'Cloning repository', 'complete'),
      makeStep('2', 'Discovering tests', 'complete'),
      makeStep('3', 'Running tests', 'active'),
      makeStep('4', 'Applying fixes', 'pending'),
      makeStep('5', 'Monitoring CI/CD', 'pending'),
    ];
  }

  if (status === 'done' && result) {
    return [
      makeStep('1', 'Cloning repository', 'complete'),
      makeStep('2', 'Discovering tests', 'complete'),
      makeStep('3', 'Running tests', 'complete'),
      makeStep('4', 'Applying fixes', 'complete'),
      makeStep('5', 'Monitoring CI/CD', 'complete'),
    ];
  }

  return [];
}
