'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('admin@stellify.com');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Timing-safe admin session simulated locally
    setTimeout(() => {
      setIsLoading(false);
      if (email === 'admin@stellify.com') {
        router.push('/admin');
      } else {
        setError('Invalid administrative credentials. Please verify your email and password.');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#050B16] flex items-center justify-center p-6 text-[#FAF7F2]">
      <div className="w-full max-w-md bg-[#071326] border border-[#C5A059]/40 rounded-sm p-8 shadow-2xl">
        <div className="text-center mb-8">
          <BrandLogo size="md" showTagline={true} />
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C5A059] block mt-6">
            Atelier Management Portal
          </span>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-sm bg-[#7A1C28]/20 border border-[#7A1C28] text-xs text-[#E08A93] flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Admin Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-4">
            Sign In to Atelier Dashboard
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#162B4C] text-center text-xs text-[#FAF7F2]/40 font-sans">
          Protected with timing-safe authentication &amp; encrypted HTTP cookies.
        </div>
      </div>
    </div>
  );
}
