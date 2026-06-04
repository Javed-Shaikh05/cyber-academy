import Link from 'next/link'
import { Shield, Terminal, Lock, Zap, Users, Award } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen cyber-grid flex flex-col">

      {/* ── NAV ── */}
      <nav className="border-b border-[var(--cyber-border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[var(--cyber-green)]" style={{ filter: 'drop-shadow(0 0 6px #00ff41)' }} />
          <span className="font-mono font-bold text-lg tracking-wider text-[var(--cyber-green)]" style={{ textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
            CYBER<span className="text-white">ACADEMY</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="cyber-btn text-xs px-4 py-2">
            Login
          </Link>
          <Link href="/signup" className="cyber-btn cyber-btn-primary text-xs px-4 py-2">
            Enroll →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
        {/* Status badge */}
        <div className="flex items-center gap-2 mb-6 px-3 py-1.5 border border-[var(--cyber-border)] text-xs font-mono">
          <span className="w-2 h-2 bg-[var(--cyber-green)] rounded-full pulse-glow" />
          <span className="text-[var(--cyber-green)] uppercase tracking-wider">System Online — Recruiting Defenders</span>
        </div>

        {/* Headline with glitch */}
        <h1
          className="glitch-text text-3xl sm:text-5xl lg:text-6xl font-mono font-bold mb-4 text-white leading-tight"
          data-text="LEARN TO DEFEND."
        >
          LEARN TO DEFEND.
        </h1>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold mb-6">
          <span className="gradient-text">Cybersecurity from Zero.</span>
        </h2>

        <p className="text-sm sm:text-base text-[#7aad7a] max-w-xl mb-8 leading-relaxed">
          A structured, beginner-friendly cybersecurity curriculum. No prior experience needed.
          Learn real defensive concepts, practice with AI, and build skills that matter.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link href="/signup" className="cyber-btn cyber-btn-primary text-sm px-8 py-3">
            Start Training →
          </Link>
          <Link href="/login" className="cyber-btn text-sm px-8 py-3">
            Access Terminal
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
          {[
            { value: '7', label: 'Phases' },
            { value: '55+', label: 'Lessons' },
            { value: '100%', label: 'Free' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl sm:text-3xl font-mono font-bold text-[var(--cyber-green)]" style={{ textShadow: '0 0 12px rgba(0,255,65,0.5)' }}>
                {s.value}
              </p>
              <p className="text-xs text-[#5a8a5a] uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto w-full">
        <p className="text-center text-xs font-mono text-[#5a8a5a] uppercase tracking-widest mb-8">
          &gt; Core Modules
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Terminal, title: 'AI Security Mentor', desc: 'Ask questions, get explanations, learn at your pace — 6 mentor personalities.' },
            { icon: Shield, title: 'Structured Curriculum', desc: '7 phases from foundations to Security Operations — built for beginners.' },
            { icon: Lock, title: 'Exam Mode', desc: 'Timed, graded exams to test your knowledge under real pressure.' },
            { icon: Zap, title: 'Flashcards & MCQs', desc: 'Active recall sessions that lock concepts into memory fast.' },
            { icon: Award, title: 'XP & Ranks', desc: 'Earn XP, level up, and unlock badges as you progress.' },
            { icon: Users, title: 'Defensive Focus', desc: 'Conceptual, ethical, defensive security — the right way to learn.' },
          ].map((f) => (
            <div key={f.title} className="glass glass-hover p-5">
              <f.icon className="w-5 h-5 text-[var(--cyber-green)] mb-3" style={{ filter: 'drop-shadow(0 0 6px #00ff41)' }} />
              <h3 className="text-sm font-mono font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-[#7aad7a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-[var(--cyber-border)] px-4 py-12 text-center">
        <p className="text-sm font-mono text-[var(--cyber-green)] mb-3 uppercase tracking-wider">
          &gt; Ready to begin?
        </p>
        <h3 className="text-xl sm:text-2xl font-mono font-bold text-white mb-5">
          Start your security training now.
        </h3>
        <Link href="/signup" className="cyber-btn cyber-btn-primary text-sm px-8 py-3 inline-block">
          Enroll Free →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--cyber-border)] px-6 py-4 flex items-center justify-between text-xs font-mono text-[#3a6a3a]">
        <span>CYBERACADEMY // DEFENSIVE SECURITY TRAINING</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[var(--cyber-green)] rounded-full pulse-glow" />
          SECURE
        </span>
      </footer>
    </main>
  )
}