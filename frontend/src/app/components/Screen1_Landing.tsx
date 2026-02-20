import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Terminal, Zap, Shield, GitBranch } from 'lucide-react';
import { Label } from "./ui/label";

interface LandingScreenProps {
  onStart: (data: { repoUrl: string; teamName: string; leaderName: string }) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateGitUrl = (url: string) => {
    const gitUrlRegex = /^(?:https?:\/\/|git@).*(?:\.git|\/)$/;
    return gitUrlRegex.test(url);
  };

  const handleRepoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRepoUrl(value);
    if (value && !validateGitUrl(value)) {
      setValidationError('Please enter a valid Git repository URL (e.g., ends in .git)');
    } else {
      setValidationError('');
    }
  };

  const isValid = repoUrl.length > 0 && teamName.length > 0 && leaderName.length > 0 && !validationError;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-[800px] mx-auto gap-8">

      {/* Hero Section */}
      <div className="text-center space-y-3 mb-4 px-4">
        {/* Icon */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#446592]/20 rounded-xl blur-xl" />
            <div className="relative p-4 bg-gradient-to-br from-[#446592]/20 to-[#446592]/5 rounded-xl border border-[#446592]/20 backdrop-blur-sm">
              <Terminal className="w-10 h-10 text-[#60a5fa]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-[#94A3B8] bg-clip-text text-transparent">
          AutoHeal-CI
        </h1>
        <p className="text-[#64748B] font-mono text-xs tracking-[0.2em] uppercase">
          Autonomous CI/CD Healing Agent
        </p>

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {[
            { icon: Zap, label: 'AI-Powered' },
            { icon: Shield, label: 'Auto-Fix' },
            { icon: GitBranch, label: 'Git Integrated' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[#64748B]">
              <Icon className="w-3 h-3" />
              <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form Card */}
      <GlassCard className="w-full flex flex-col gap-6" padding="p-6 md:p-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="repo-url">GitHub Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/organization/repo.git"
              value={repoUrl}
              onChange={handleRepoUrlChange}
              className={`font-mono text-sm ${validationError ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
            />
            {validationError && (
              <p className="text-xs text-red-400 font-mono">{validationError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="e.g. Heart Pirates"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leader-name">Team Leader Name</Label>
              <Input
                id="leader-name"
                placeholder="e.g. Arjun Sarkar"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => onStart({ repoUrl, teamName, leaderName })}
            disabled={!isValid}
            className="w-full text-base bg-gradient-to-r from-[#446592] to-[#3a5a85] hover:from-[#3a5a85] hover:to-[#324F7B] disabled:from-[#2a3a4f] disabled:to-[#2a3a4f] text-white border-transparent rounded-lg font-semibold transition-all shadow-lg shadow-[#446592]/10 hover:shadow-[#446592]/20 py-3"
          >
            INITIALIZE AGENT
          </Button>

          <p className="text-center text-[#4b5563] font-mono text-[10px] mt-5 uppercase tracking-widest">
            System operates autonomously &middot; Do not interrupt
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
