import React, { useEffect, useRef } from 'react';
import { cn } from './GlassCard';

interface LogViewerProps {
  logs: string[];
  className?: string;
}

export function LogViewer({ logs, className }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className={cn("glass-card overflow-hidden rounded-xl border border-white/10 bg-[#0B1220]/50", className)}>
      <div 
        ref={scrollRef}
        className="h-full overflow-y-auto p-4 font-mono text-sm space-y-1 custom-scrollbar"
      >
        {logs.map((log, i) => (
          <div key={i} className="text-[#94A3B8] break-all leading-relaxed hover:bg-white/[0.02] -mx-2 px-2 rounded transition-colors">
            <span className="text-[#64748B] mr-3 select-none">
              [{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
            </span>
            <span className={cn(
              log.toLowerCase().includes('fail') || log.toLowerCase().includes('error') ? "text-[#E2424A]" :
              log.toLowerCase().includes('success') || log.toLowerCase().includes('done') ? "text-[#16A34A]" :
              log.toLowerCase().includes('warn') ? "text-[#FFD481]" :
              "text-[#E5E7EB]"
            )}>
              {log}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-[#64748B] italic">Waiting for agent to start...</div>
        )}
      </div>
    </div>
  );
}
