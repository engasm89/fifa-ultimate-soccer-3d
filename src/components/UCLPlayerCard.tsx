/**
 * UEFA Champions League 120 OVR Special Edition Trading Card
 * High-definition holographic gold & midnight blue design
 * Featuring authentic starball patterns, player stats, and luxury shimmer.
 */

import React from 'react';
import { SuperstarProfile } from '../game/superstars';
import { Sparkles, Zap, Award } from 'lucide-react';

interface UCLPlayerCardProps {
  player: SuperstarProfile;
  size?: 'sm' | 'md' | 'lg';
  isHolographic?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const UCLPlayerCard: React.FC<UCLPlayerCardProps> = ({
  player,
  size = 'md',
  isHolographic = true,
  onSelect,
  isSelected = false,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const widthClass = isSm ? 'w-36 h-52' : isLg ? 'w-64 h-96' : 'w-48 h-72';

  return (
    <div
      onClick={onSelect}
      className={`relative ${widthClass} rounded-2xl select-none cursor-pointer transition-all duration-300 transform group ${
        isSelected
          ? 'scale-105 ring-4 ring-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.8)]'
          : 'hover:scale-102 hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]'
      }`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Outer Metallic Gold / Platinum Card Border */}
      <div className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 shadow-2xl">
        {/* Inner Card Body with Deep Champions League Blue */}
        <div className="relative w-full h-full rounded-[13px] bg-gradient-to-b from-[#0a1835] via-[#051026] to-[#020612] overflow-hidden flex flex-col justify-between p-2.5 text-white">
          {/* Champions League Starball Background Grid Overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Shimmer / Holographic Light Beam */}
          {isHolographic && (
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/15 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full duration-1000 transition-transform" />
          )}

          {/* UCL Star Crest watermark at center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none font-black text-6xl text-amber-300 select-none">
            ⭐
          </div>

          {/* Card Top: OVR, Position, Nation & Club */}
          <div className="relative z-10 flex items-start justify-between">
            {/* Left: 120 OVR + Position */}
            <div className="flex flex-col items-center leading-none">
              <span className="font-chakra font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {player.rating}
              </span>
              <span className="font-chakra font-bold text-xs sm:text-sm text-amber-300 tracking-wider">
                {player.position}
              </span>
              <div className="w-5 h-[1.5px] bg-amber-400/40 my-1" />
              <span className="text-sm" title={player.flag}>
                {player.flag}
              </span>
            </div>

            {/* Right: UCL Stars Badge */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/40 text-[9px] font-chakra font-black text-amber-300">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>UCL 120</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 font-bold">#{player.jerseyNumber}</span>
            </div>
          </div>

          {/* Player Portrait & Aura Illustration */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-1">
            {/* Glowing Backlight Ring */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-md opacity-50 absolute"
              style={{ backgroundColor: player.themeColor }}
            />

            {/* Stylized Illustrated Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-amber-400/80 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
              {player.avatarEmoji}
            </div>

            {/* Special Skill Tag */}
            <div className="mt-1 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-700/80 text-[9px] text-amber-300 font-bold truncate max-w-[90%]">
              <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="truncate">{player.traits.specialSkill.split('(')[0]}</span>
            </div>
          </div>

          {/* Card Bottom: Player Name & Stats Grid */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Player Name */}
            <div className="w-full text-center py-0.5 border-b border-amber-400/40 mb-1">
              <h4 className="font-chakra font-black text-sm sm:text-base text-amber-300 tracking-wider truncate">
                {player.nameEn.toUpperCase()}
              </h4>
              <span className="text-[10px] text-slate-300 font-bold font-sans">{player.nameAr}</span>
            </div>

            {/* 6 Core FUT Stats */}
            <div className="w-full grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] font-chakra font-bold">
              <div className="flex items-center justify-between px-1">
                <span className="text-amber-400">{player.stats.PAC}</span>
                <span className="text-slate-400 text-[9px]">PAC</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-amber-400">{player.stats.DRI}</span>
                <span className="text-slate-400 text-[9px]">DRI</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-amber-400">{player.stats.SHO}</span>
                <span className="text-slate-400 text-[9px]">SHO</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-amber-400">{player.stats.DEF}</span>
                <span className="text-slate-400 text-[9px]">DEF</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-amber-400">{player.stats.PAS}</span>
                <span className="text-slate-400 text-[9px]">PAS</span>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-amber-400">{player.stats.PHY}</span>
                <span className="text-slate-400 text-[9px]">PHY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
