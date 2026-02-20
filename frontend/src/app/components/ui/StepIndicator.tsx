import React from 'react';
import { cn } from './GlassCard';
import { Check, Circle, Loader2 } from 'lucide-react';

export type StepStatus = 'pending' | 'active' | 'complete';

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-4 group">
          <div className="relative flex items-center justify-center">
            {index !== steps.length - 1 && (
              <div className={cn(
                "absolute top-8 left-1/2 w-0.5 h-full -translate-x-1/2 transition-colors duration-500",
                step.status === 'complete' ? "bg-[#16A34A]/30" : "bg-slate-700/50"
              )} style={{ height: '24px' }} />
            )}
            
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border",
              step.status === 'complete' ? "bg-[#16A34A]/20 border-[#16A34A] text-[#16A34A]" :
              step.status === 'active' ? "bg-[#446592]/20 border-[#446592] text-[#446592] animate-pulse shadow-[0_0_15px_rgba(68,101,146,0.3)]" :
              "bg-slate-800 border-slate-700 text-[#64748B]"
            )}>
              {step.status === 'complete' ? (
                <Check className="w-4 h-4" />
              ) : step.status === 'active' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
          </div>
          
          <span className={cn(
            "text-base font-medium transition-colors duration-300",
            step.status === 'complete' ? "text-[#16A34A]" :
            step.status === 'active' ? "text-[#E5E7EB]" :
            "text-[#64748B]"
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
