import React, { useState } from 'react';
import { Check, Clock, GitBranch, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, Terminal, Activity, FileWarning, Bug } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// ─── Bug Type Badge Colors ────────────────────────────────────────────────
const BUG_TYPE_STYLES: Record<string, string> = {
  SYNTAX:        'bg-rose-500/10 border-rose-500/30 text-rose-400',
  INDENTATION:   'bg-amber-500/10 border-amber-500/30 text-amber-400',
  DEPENDENCY:    'bg-purple-500/10 border-purple-500/30 text-purple-400',
  LINTING:       'bg-sky-500/10 border-sky-500/30 text-sky-400',
  TYPE:          'bg-orange-500/10 border-orange-500/30 text-orange-400',
  TEST_FAILURE:  'bg-red-500/10 border-red-500/30 text-red-400',
  TIMEOUT:       'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  LOGIC:         'bg-blue-500/10 border-blue-500/30 text-blue-400',
  SECURITY:      'bg-red-900/20 border-red-900/40 text-red-400',
  UNKNOWN:       'bg-slate-500/10 border-slate-500/30 text-slate-400',
};

function getBugTypeStyle(type: string) {
  return BUG_TYPE_STYLES[type] || BUG_TYPE_STYLES.UNKNOWN;
}

// ─── Interfaces ───────────────────────────────────────────────────────────
interface RunSummary {
  repoUrl: string;
  branchName: string;
  totalFailures: number;
  fixesApplied: number;
  status: 'passed' | 'failed';
  duration: string;
}

interface DetectedFailure {
  file: string;
  bugType: string;
  line: string;
  errorMessage: string;
  status: 'fixed' | 'detected';
  branch: string;
  commitHash: string;
}

interface FixItem {
  file: string;
  type: string;
  line: number;
  message: string;
  status: 'fixed' | 'failed';
}

interface TimelineNode {
  timestamp: string;
  status: 'pass' | 'fail';
  iteration: string;
}

interface ScoreData {
  base: number;
  speedBonus: number;
  commitPenalty: number;
  total: number;
}

interface ResultsScreenProps {
  summary: RunSummary;
  detectedFailures: DetectedFailure[];
  fixes: FixItem[];
  timeline: TimelineNode[];
  logs: string[];
  score?: ScoreData;
  onBack?: () => void;
}

export function ResultsScreen({ summary, detectedFailures, fixes, timeline, logs, score, onBack }: ResultsScreenProps) {
  const scoreData = score ?? { base: 0, speedBonus: 0, commitPenalty: 0, total: 0 };
  const [logsExpanded, setLogsExpanded] = useState(false);

  const scoreColor = scoreData.total >= 80 ? 'text-emerald-400' :
                     scoreData.total >= 40 ? 'text-amber-400' : 'text-white';

  return (
    <div className="flex flex-col w-full gap-5 max-w-[1200px] mx-auto pb-20 font-sans">

      {/* ── BACK BUTTON ────────────────────────────────────────────────── */}
      {onBack && (
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors w-fit mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-wider">New Analysis</span>
        </button>
      )}

      {/* ── SECTION 1: SYSTEM SUMMARY ──────────────────────────────────── */}
      <div className="backdrop-blur-md bg-[#17171a]/80 border border-white/[0.06] rounded-lg w-full overflow-hidden shadow-2xl shadow-black/20">
        <div className="flex flex-col md:flex-row w-full divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">

          {/* Left Column: Repo Details */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[#6b7280] text-[10px] font-bold tracking-[1.5px] uppercase">Repository URL</span>
              <a href={summary.repoUrl} target="_blank" rel="noopener noreferrer"
                 className="text-[#60a5fa] text-sm font-normal break-all hover:text-[#93c5fd] transition-colors">
                {summary.repoUrl}
              </a>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[#6b7280] text-[10px] font-bold tracking-[1.5px] uppercase">Active Branch</span>
              <div className="bg-[#1a1d24] border border-white/[0.08] rounded-md px-3 py-1.5 inline-flex w-fit items-center gap-2">
                <GitBranch className="w-3 h-3 text-[#6b7280]" />
                <span className="text-[#d1d5db] text-xs font-mono">{summary.branchName}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Status & Metrics */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
            <div className="flex justify-between md:justify-start md:gap-10 lg:gap-14">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-wider">Failures</span>
                <span className="text-[#ef4444] text-3xl font-bold leading-none tabular-nums">{String(summary.totalFailures).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-wider">Fixes</span>
                <span className="text-[#10b981] text-3xl font-bold leading-none tabular-nums">{String(summary.fixesApplied).padStart(2, '0')}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-wider">Analysis Time</span>
                <span className="text-[#e5e7eb] text-3xl font-bold leading-none tabular-nums">{summary.duration}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[#6b7280] text-[10px] font-bold uppercase tracking-wider">Operation Status</span>
              <div className={cn(
                     "flex items-center gap-2.5 px-4 py-2 rounded-md border w-fit",
                     summary.status === 'passed'
                       ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                       : "bg-red-500/5 border-red-500/20 text-red-400"
                   )}>
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse",
                  summary.status === 'passed' ? "bg-emerald-400" : "bg-red-400"
                )} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {summary.status === 'passed' ? 'All Tests Passing' : 'Validation Failed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: SCORE ANALYSIS ──────────────────────────────────── */}
      <div className="backdrop-blur-md bg-[#17171a]/80 border border-white/[0.06] rounded-lg p-6 md:p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col md:flex-row gap-8 items-center">

          {/* Left: Score Breakdown */}
          <div className="flex-1 w-full flex flex-col gap-5">
            <h3 className="text-[#9ca3af] text-[10px] font-bold tracking-[1.5px] uppercase flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Score Breakdown
            </h3>

            <div className="flex gap-8 md:gap-12 w-full">
              <div className="flex flex-col gap-1">
                <span className="text-[#6b7280] text-[10px] uppercase font-bold tracking-wider">Base Score</span>
                <span className="text-[#e5e7eb] text-2xl font-mono font-bold tabular-nums">{scoreData.base}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#6b7280] text-[10px] uppercase font-bold tracking-wider">
                  Speed Bonus <span className="text-[#60a5fa] normal-case tracking-normal opacity-70">(&lt; 5m)</span>
                </span>
                <span className="text-[#60a5fa] text-2xl font-mono font-bold tabular-nums">
                  {scoreData.speedBonus > 0 ? `+${scoreData.speedBonus}` : scoreData.speedBonus}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#6b7280] text-[10px] uppercase font-bold tracking-wider">
                  Penalty <span className="text-[#f87171] normal-case tracking-normal opacity-70">(-2 / commit &gt; 20)</span>
                </span>
                <span className="text-[#f87171] text-2xl font-mono font-bold tabular-nums">{scoreData.commitPenalty}</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex gap-0.5 h-2 w-full rounded-full overflow-hidden bg-white/[0.03]">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-700" style={{ width: `${Math.min(scoreData.base, 100) * 0.7}%` }} />
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full transition-all duration-700" style={{ width: `${Math.max(scoreData.speedBonus, 0) * 2}%` }} />
              {scoreData.commitPenalty < 0 && (
                <div className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-700" style={{ width: `${Math.min(Math.abs(scoreData.commitPenalty) * 2, 30)}%` }} />
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-28 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          {/* Right: Final Score */}
          <div className="flex flex-col items-center md:items-end justify-center min-w-[160px]">
             <span className="text-[#9ca3af] text-[10px] font-bold text-right uppercase mb-2 tracking-wider">Final Score</span>
             <span className={cn("text-6xl md:text-7xl font-black tracking-tighter leading-none", scoreColor)}>
               {scoreData.total}
             </span>
          </div>

        </div>
      </div>

      {/* ── SECTION 3: DETECTED FAILURES ───────────────────────────────── */}
      <div className="backdrop-blur-md bg-[#17171a]/80 border border-white/[0.06] rounded-lg overflow-hidden shadow-2xl shadow-black/20">
        <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2">
           <FileWarning className="w-3.5 h-3.5 text-[#9ca3af]" />
           <h3 className="text-[#9ca3af] text-[10px] font-bold tracking-[1.5px] uppercase">Detected Failures</h3>
           <span className="ml-auto text-[10px] font-mono text-[#6b7280]">{detectedFailures.length} found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-black/30">
              <tr>
                <th className="px-6 py-3.5 text-[#6b7280] text-[10px] font-bold tracking-[1.2px] uppercase border-b border-white/[0.04] w-[40%]">File Reference</th>
                <th className="px-6 py-3.5 text-[#6b7280] text-[10px] font-bold tracking-[1.2px] uppercase border-b border-white/[0.04] w-[15%]">Bug Type</th>
                <th className="px-6 py-3.5 text-[#6b7280] text-[10px] font-bold tracking-[1.2px] uppercase border-b border-white/[0.04] w-[10%]">Line</th>
                <th className="px-6 py-3.5 text-[#6b7280] text-[10px] font-bold tracking-[1.2px] uppercase border-b border-white/[0.04] w-[20%]">Error</th>
                <th className="px-6 py-3.5 text-[#6b7280] text-[10px] font-bold tracking-[1.2px] uppercase border-b border-white/[0.04] w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {detectedFailures.map((f, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-[#d1d5db] text-xs font-mono">{f.file}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-bold uppercase border",
                      getBugTypeStyle(f.bugType)
                    )}>
                      {f.bugType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#9ca3af] text-xs font-mono">{f.line || '—'}</td>
                  <td className="px-6 py-4 text-[#9ca3af] text-xs truncate max-w-[200px]" title={f.errorMessage}>
                    {f.errorMessage.split('\n')[0].slice(0, 60)}{f.errorMessage.length > 60 ? '...' : ''}
                  </td>
                  <td className="px-6 py-4">
                     {f.status === 'fixed' ? (
                       <div className="flex items-center gap-1.5 text-emerald-400">
                         <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                         <span className="text-[10px] font-bold uppercase">Fixed</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 text-amber-400">
                         <Bug className="w-3.5 h-3.5" strokeWidth={2.5} />
                         <span className="text-[10px] font-bold uppercase">Detected</span>
                       </div>
                     )}
                  </td>
                </tr>
              ))}
              {detectedFailures.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#4b5563] text-xs font-mono">
                    No failures detected in this run.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 4: EXECUTION TIMELINE ──────────────────────────────── */}
      {timeline.length > 0 && (
        <div className="backdrop-blur-md bg-[#17171a]/80 border border-white/[0.06] rounded-lg p-6 shadow-2xl shadow-black/20">
          <h3 className="text-[#9ca3af] text-[10px] font-bold tracking-[1.5px] uppercase mb-6 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Execution Timeline
          </h3>

          <div className="flex items-start gap-4 overflow-x-auto pb-2">
             {timeline.map((node, index) => (
               <div key={index} className="flex flex-col gap-2 min-w-[130px] border-l-2 border-white/[0.06] pl-4 py-1 relative">
                 <div className={cn(
                   "absolute left-[-5px] top-3 w-2 h-2 rounded-full ring-2 ring-[#17171a]",
                   node.status === 'pass' ? "bg-emerald-400" : "bg-red-400"
                 )} />
                 <div className="flex items-center gap-2 mb-1">
                   <span className={cn(
                     "text-xs font-bold uppercase font-mono",
                     node.status === 'pass' ? "text-emerald-400" : "text-red-400"
                   )}>
                     {node.status === 'pass' ? 'PASS' : 'FAIL'}
                   </span>
                 </div>

                 <div className="flex flex-col gap-0.5">
                   <span className="text-[10px] text-[#6b7280] font-mono tracking-wide uppercase">Iteration {node.iteration}</span>
                   <span className="text-xs text-[#d1d5db] font-mono">{node.timestamp}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* ── SECTION 5: AGENT LOGS ──────────────────────────────────────── */}
      <div className="backdrop-blur-md bg-[#17171a]/80 border border-white/[0.06] rounded-lg overflow-hidden shadow-2xl shadow-black/20">
         <div
            className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors"
            onClick={() => setLogsExpanded(!logsExpanded)}
         >
           <h3 className="text-[#9ca3af] text-[10px] font-bold tracking-[1.5px] uppercase flex items-center gap-2">
             <Terminal className="w-3.5 h-3.5" />
             System Decision Log
           </h3>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-mono text-[#4b5563]">{logs.length} entries</span>
             {logsExpanded ? <ChevronUp className="w-4 h-4 text-[#6b7280]" /> : <ChevronDown className="w-4 h-4 text-[#6b7280]" />}
           </div>
         </div>

         {logsExpanded && (
           <div className="p-4 font-mono text-[11px] bg-[#0a0b0e] leading-relaxed">
             <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
               {logs.length > 0 ? logs.map((log, i) => (
                 <div key={i} className="flex gap-3 text-[#d1d5db] border-l-2 border-white/[0.04] pl-3 hover:bg-white/[0.02] py-1 rounded-r">
                   <span className="text-[#3b3f4a] shrink-0 font-medium select-none tabular-nums">
                     {String(i + 1).padStart(3, '0')}
                   </span>
                   <span className={cn(
                     "break-all",
                     log.includes('✅') ? "text-emerald-400" :
                     log.includes('❌') ? "text-red-400" :
                     log.includes('⚠') ? "text-amber-400" :
                     "text-[#d1d5db]"
                   )}>
                     {log}
                   </span>
                 </div>
               )) : (
                 <div className="text-[#4b5563] text-center py-6">
                   No logs captured.
                 </div>
               )}
             </div>
           </div>
         )}
      </div>

      {/* ── BACK TO START BUTTON (bottom) ──────────────────────────────── */}
      {onBack && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#94A3B8] hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15] transition-all text-sm font-mono uppercase tracking-wider"
          >
            Run New Analysis
          </button>
        </div>
      )}

    </div>
  );
}
