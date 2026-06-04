"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, Flame, Award, X } from "lucide-react";

interface XPResult {
  xp_earned: number;
  streak?: number;
  streak_bonus?: number;
  leveled_up?: boolean;
  new_rank?: { name: string; emoji: string; level: number };
  new_badges?: Array<{ name: string; emoji: string; description: string }>;
}

let externalShow: ((result: XPResult) => void) | null = null;

export function showXP(result: XPResult) {
  if (externalShow) externalShow(result);
}

export default function XPToast() {
  const [current, setCurrent] = useState<XPResult | null>(null);
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => setCurrent(null), 300);
  }, []);

  useEffect(() => {
    externalShow = (r: XPResult) => {
      setCurrent(r);
      setVisible(true);
    };
    return () => {
      externalShow = null;
    };
  }, []);

  useEffect(() => {
    if (visible && current) {
      const timer = setTimeout(() => dismiss(), 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, current, dismiss]);

  if (!current) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50 animate-slide-in-up">
      <div className="space-y-2">
        {/* XP earned */}
        <div
          className="flex items-center gap-3 px-4 py-3 border font-mono relative"
          style={{ background: 'rgba(0,255,65,0.08)', borderColor: 'rgba(0,255,65,0.35)', boxShadow: '0 0 20px rgba(0,255,65,0.2)' }}
        >
          <button
            onClick={dismiss}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-3 pr-5">
            <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(0,255,65,0.15)' }}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#00ff41' }} />
            </div>
            <div className="min-w-0">
              <span className="font-mono font-bold text-lg" style={{ color: '#00ff41', textShadow: '0 0 8px rgba(0,255,65,0.6)' }}>
                +{current.xp_earned} XP
              </span>
              {current.streak_bonus && current.streak_bonus > 0 && (
                <p className="text-xs text-orange-400 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {current.streak}-day streak (+
                  {current.streak_bonus})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Level up */}
        {current.leveled_up && current.new_rank && (
          <div className="glass glow-cyan p-3 sm:p-4 border border-cyan-400/40">
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl">
                {current.new_rank.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-cyan-400 uppercase tracking-wider">
                  Level Up!
                </p>
                <p className="font-bold gradient-text">
                  {current.new_rank.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        {current.new_badges?.map((b, i) => (
          <div key={i} className="glass p-3 sm:p-4 border border-yellow-400/40">
            <div className="flex items-center gap-3">
              <div className="text-2xl sm:text-3xl shrink-0">
                {b.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3" /> Badge Unlocked
                </p>
                <p className="font-bold">{b.name}</p>
                <p className="text-xs text-gray-400">{b.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
