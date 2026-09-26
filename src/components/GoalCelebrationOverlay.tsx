/**
 * Goal Celebration Overlay
 * Visual banner with fireworks flare, scorer name, shot speed,
 * and slow-motion celebration flair.
 */

import React from 'react';
import { MatchStats } from '../game/GameManager';
import { SuperstarProfile } from '../game/superstars';
import { Trophy, Flame, Play, Star } from 'lucide-react';
import { UCLPlayerCard } from './UCLPlayerCard';
import { WorldCupBallEdition } from '../game/worldCupBall2026';

interface GoalCelebrationOverlayProps {
  stats: MatchStats | null;
  onDismiss: () => void;
  selectedStar?: SuperstarProfile;
  ballEdition?: WorldCupBallEdition;
}

export const GoalCelebrationOverlay: React.FC<GoalCelebrationOverlayProps> = ({
  stats,
  onDismiss,
  selectedStar,
  ballEdition = 'trionda_official',
}) => {
  if (!stats?.isGoalScored) return null;

  const scorerName = selectedStar ? `${selectedStar.nameAr} (#${selectedStar.jerseyNumber})` : (stats.goalScorer || 'الكابتن #9');

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center p-3 sm:p-4">
      {/* Golden explosive backdrop burst */}
      <div className="absolute inset-0 bg-radial from-amber-500/25 via-slate-950/50 to-slate-950/90 animate-pulse pointer-events-none" />

      {/* Main Celebration Banner Card with 120 OVR Card */}
      <div className="relative pointer-events-auto flex flex-col items-center bg-slate-950/95 border-2 border-amber-400/90 p-5 sm:p-7 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.7)] backdrop-blur-2xl max-w-xl w-full text-center animate-bounce">
        {/* UCL 120 OVR Floating Superstar Card */}
        {selectedStar && (
          <div className="mb-3 -mt-10 transform scale-90 sm:scale-100 hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
            <UCLPlayerCard player={selectedStar} size="sm" isHolographic={true} />
          </div>
        )}

        {/* Huge Goal Text */}
        <h1 className="font-chakra font-black text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tracking-wider drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)]">
          هــــــدف أسطــــوري!
        </h1>
        <p className="font-chakra tracking-widest text-base sm:text-lg text-yellow-300/90 font-bold mt-0.5">
          GOOOOOOOAL!
        </p>

        {/* Match Scoreboard Update (Large Numbers: "تكبير الرقم") */}
        <div className="mt-3 flex items-center justify-center gap-5 bg-slate-900/90 px-6 py-2.5 rounded-2xl border-2 border-amber-500/40 w-full shadow-lg">
          <div className="flex items-center gap-3">
            <span className="font-black text-amber-400 text-base sm:text-lg">النسر الذهبي</span>
            <span className="font-chakra font-black text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">{stats.homeScore}</span>
          </div>
          <span className="text-slate-500 font-bold text-2xl">:</span>
          <div className="flex items-center gap-3">
            <span className="font-chakra font-black text-3xl sm:text-4xl text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]">{stats.awayScore}</span>
            <span className="font-black text-red-400 text-base sm:text-lg">الصقر الملكي</span>
          </div>
        </div>

        {/* Details: Scorer and Shot Speed */}
        <div className="mt-3 flex items-center justify-center gap-5 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <span>⚽ الهداف:</span>
            <span className="text-white font-black">{scorerName}</span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <Flame className="w-4 h-4" />
            <span>السرعة:</span>
            <span className="font-mono text-white font-black">{stats.shotSpeedKmh} كم/س</span>
          </div>
        </div>

        {/* 2026 World Cup Ball Badge in Goal Screen */}
        <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 px-3.5 py-1 rounded-full">
          <span>⚽ هدف بكرة كأس العالم 2026:</span>
          <span className="font-chakra text-white font-extrabold">
            {ballEdition === 'trionda_final' ? 'TRIONDA FINAL الذهبية 🏆' : 'TRIONDA تريوندا الرسمية 🍁🦅⭐'}
          </span>
        </div>

        {/* Kickoff countdown note or manual skip */}
        <button
          onClick={onDismiss}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm transition-transform active:scale-95 shadow-lg cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>متابعة المباراة (سنترة فورية)</span>
        </button>
      </div>
    </div>
  );
};
