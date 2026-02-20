import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: string;
}

export function GlassCard({ children, className, padding = 'p-8', ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "bg-white/[0.12] backdrop-blur-[20px] border border-white/[0.15] rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.25)]",
        padding,
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
