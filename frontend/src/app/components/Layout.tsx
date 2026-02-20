import React from 'react';
import { cn } from './ui/GlassCard';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#060608] text-[#E5E7EB] font-sans antialiased selection:bg-[#446592]/30 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#446592]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-[#0D98BA]/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Grid texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <main className={cn("relative z-10 max-w-[1200px] mx-auto px-4 py-10 md:px-6 md:py-16", className)}>
        {children}
      </main>
    </div>
  );
}
