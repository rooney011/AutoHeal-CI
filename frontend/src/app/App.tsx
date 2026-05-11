import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from './components/Layout';
import { LandingScreen } from './components/Screen1_Landing';
import { RunningScreen } from './components/Screen2_Running';
import { ResultsScreen } from './components/Screen3_Results';
import { Step } from './components/ui/StepIndicator';
import {
  startAgent,
  pollStatus,
  mapResultsToProps,
  inferStepsFromStatus,
  AgentResults,
  RunStatus,
} from './api';

type Screen = 'landing' | 'running' | 'results';

const POLL_INTERVAL_MS = 2000;

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [runData, setRunData] = useState({ repoUrl: '' });
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<Step[]>(inferStepsFromStatus('idle', null));
  const [agentResults, setAgentResults] = useState<AgentResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  }, []);

  // ── Polling logic ──────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const statusRes = await pollStatus();
        const status = statusRes.status;
        setRunStatus(status);
        setSteps(inferStepsFromStatus(status, null));

        if (status === 'done' && statusRes.result && !('error' in statusRes.result)) {
          clearInterval(pollRef.current!);
          const results = statusRes.result as AgentResults;
          setAgentResults(results);
          addLog(`✅ Run complete. Success=${results.success}. Score=${results.score.total}`);
          setTimeout(() => setScreen('results'), 800);
        }

        if (status === 'error') {
          clearInterval(pollRef.current!);
          const errMsg = statusRes.result && 'error' in statusRes.result
            ? statusRes.result.error
            : 'Unknown error from agent.';
          setError(errMsg);
          addLog(`❌ Agent error: ${errMsg}`);
          setTimeout(() => setScreen('results'), 1200);
        }

      } catch (e) {
        addLog(`⚠️ Poll failed: ${e instanceof Error ? e.message : 'Network error'}`);
      }
    }, POLL_INTERVAL_MS);
  }, [addLog]);

  // ── Stop polling on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  // ── Running screen log stream (status updates) ────────────────────────────
  useEffect(() => {
    if (screen === 'running') {
      addLog('Connecting to AutoHeal backend...');
      addLog(`Target repo: ${runData.repoUrl}`);
      addLog('Agent started. Waiting for updates...');
    }
  }, [screen]);

  // ── Handle start ───────────────────────────────────────────────────────────
  const handleStart = async (data: { repoUrl: string }) => {
    setRunData(data);
    setLogs([]);
    setError(null);
    setAgentResults(null);
    setScreen('running');
    setSteps(inferStepsFromStatus('running', null));
    setRunStatus('running');

    // Parse owner/repo from URL
    let github_owner = '';
    let github_repo = '';
    try {
      const urlParts = data.repoUrl.replace(/\.git$/, '').split('/');
      github_repo = urlParts[urlParts.length - 1];
      github_owner = urlParts[urlParts.length - 2];
    } catch {}

    try {
      await startAgent({
        repo_url: data.repoUrl,
        github_owner,
        github_repo,
        enable_ci_polling: true,
        enable_push: false,
      });
      addLog('Agent accepted. Run in progress...');
      startPolling();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to start agent';
      addLog(`❌ ${msg}`);
      setError(msg);
      setTimeout(() => setScreen('landing'), 2000);
    }
  };

  // ── Reset to landing ───────────────────────────────────────────────────────
  const handleReset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setScreen('landing');
    setRunData({ repoUrl: '' });
    setLogs([]);
    setError(null);
    setAgentResults(null);
    setRunStatus('idle');
    setSteps(inferStepsFromStatus('idle', null));
  };

  // ── Results props ──────────────────────────────────────────────────────────
  const getResultProps = () => {
    if (agentResults) {
      return mapResultsToProps(agentResults);
    }
    // Fallback if error (show empty state)
    return {
      summary: {
        repoUrl: runData.repoUrl || '—',
        branchName: '—',
        totalFailures: 0,
        fixesApplied: 0,
        status: 'failed' as const,
        duration: '—',
      },
      detectedFailures: [],
      fixes: [],
      timeline: [],
      score: { base: 0, speedBonus: 0, commitPenalty: 0, total: 0 },
    };
  };

  const resultProps = getResultProps();

  return (
    <Layout>
      {screen === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}

      {screen === 'running' && (
        <RunningScreen steps={steps} logs={logs} />
      )}

      {screen === 'results' && (
        <ResultsScreen
          summary={resultProps.summary}
          detectedFailures={resultProps.detectedFailures}
          fixes={resultProps.fixes}
          timeline={resultProps.timeline}
          logs={logs}
          score={resultProps.score}
          onBack={handleReset}
        />
      )}
    </Layout>
  );
}
