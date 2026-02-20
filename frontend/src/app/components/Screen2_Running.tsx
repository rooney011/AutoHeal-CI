import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { StepIndicator, Step } from './ui/StepIndicator';
import { LogViewer } from './ui/LogViewer';
import { Loader2, Cpu } from 'lucide-react';

interface RunningScreenProps {
  steps: Step[];
  logs: string[];
}

export function RunningScreen({ steps, logs }: RunningScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-[800px] mx-auto gap-8">

      {/* Header with pulse animation */}
      <div className="flex items-center gap-4 mb-4 px-4 text-center md:text-left">
        <div className="relative">
          <div className="absolute inset-0 bg-[#0D98BA]/20 rounded-lg blur-lg animate-pulse" />
          <div className="relative p-3 bg-[#0D98BA]/10 rounded-lg border border-[#0D98BA]/20">
            <Cpu className="w-6 h-6 text-[#0D98BA]" />
          </div>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#E5E7EB]">
            Agent Analyzing Repository
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Loader2 className="w-3 h-3 text-[#0D98BA] animate-spin" />
            <span className="text-xs text-[#64748B] font-mono uppercase tracking-wide">Processing</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <GlassCard className="w-full flex flex-col gap-8" padding="p-6 md:p-8">

        {/* Steps */}
        <div className="w-full">
          <StepIndicator steps={steps} />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

        {/* Live Logs */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] uppercase tracking-widest font-mono font-bold border-b border-white/5 pb-2">
            <span>Execution Log Stream</span>
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <LogViewer logs={logs} className="h-[240px] font-mono text-xs" />
        </div>

      </GlassCard>
    </div>
  );
}
