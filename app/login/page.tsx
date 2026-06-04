"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen cyber-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-8 h-8 text-[var(--cyber-green)]" style={{ filter: 'drop-shadow(0 0 8px #00ff41)' }} />
            <span className="font-mono font-bold text-2xl tracking-wider" style={{ color: '#00ff41', textShadow: '0 0 12px rgba(0,255,65,0.5)' }}>
              CYBER<span className="text-white">ACADEMY</span>
            </span>
          </div>
          <p className="text-xs font-mono text-[#5a8a5a] uppercase tracking-widest">
            &gt; Secure Access Terminal
          </p>
        </div>

        {/* Form card */}
        <div className="glass glow-green p-6 sm:p-8">
          <h1 className="text-2xl font-mono font-bold mb-1">
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p className="text-gray-400 mb-6 text-sm font-mono">
            {isSignUp ? "Initialize new operator profile" : "Authenticate to continue"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[rgba(0,255,65,0.5)] transition font-mono"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[rgba(0,255,65,0.5)] transition font-mono"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn cyber-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="w-full mt-6 text-sm font-mono text-gray-400 hover:text-white transition"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "New here? Create account"}
          </button>
        </div>
      </div>
    </main>
  );
}
