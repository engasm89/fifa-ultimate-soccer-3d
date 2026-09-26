import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Zap, Swords, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { PLAYERS, getCleanPlayerImage } from '../../data/players';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return prev + Math.random() * 4 + 1.5;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Red legend: Cristiano Ronaldo (Titan Red #7)
  const redLegend = PLAYERS.find(p => p.id === 'cr7-titan-123') || PLAYERS[0];
  // Blue legend: Messi or Figo (Titan Blue #4.5)
  const blueLegend = PLAYERS.find(p => p.id === 'messi-goat-123') || PLAYERS.find(p => p.id === 'legend-figo') || PLAYERS[1];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Background Split: Red (الأحمر) to Blue (الأزرق) */}
      <div className="absolute inset-0 flex pointer-events-none">
        {/* Red Side (Left) */}
        <div className="flex-1 bg-gradient-to-br from-red-950 via-red-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(239,68,68,0.4),transparent_70%)]" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
          
          {/* Subtle Hexagon / Pitch Grid texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Red Legend Cutout (CR7 #7) */}
          <motion.div 
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 0.85 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 -left-10 sm:left-4 w-48 sm:w-80 md:w-96 max-h-[75vh] flex items-end pointer-events-none"
          >
            <img 
              src={getCleanPlayerImage(redLegend)}
              alt="Titan Red Legend"
              className="w-full h-auto object-contain drop-shadow-[0_0_45px_rgba(239,68,68,0.7)]"
              referrerPolicy="no-referrer"
            />
            {/* Number 7 Badge */}
            <div className="absolute top-12 left-6 bg-red-600/40 border border-red-500/60 rounded-xl px-3 py-1 backdrop-blur-md hidden sm:flex items-center space-x-1.5">
              <Flame size={16} className="text-red-400 fill-red-400" />
              <span className="text-xs font-black text-white tracking-wider">الجانب 7 (سبعة)</span>
            </div>
          </motion.div>
        </div>

        {/* Blue Side (Right) */}
        <div className="flex-1 bg-gradient-to-bl from-blue-950 via-blue-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.4),transparent_70%)]" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Blue Legend Cutout (Messi/Figo #4.5) */}
          <motion.div 
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 0.85 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute bottom-0 -right-10 sm:right-4 w-48 sm:w-80 md:w-96 max-h-[75vh] flex items-end pointer-events-none"
          >
            <img 
              src={getCleanPlayerImage(blueLegend)}
              alt="Titan Blue Legend"
              className="w-full h-auto object-contain drop-shadow-[0_0_45px_rgba(59,130,246,0.7)]"
              referrerPolicy="no-referrer"
            />
            {/* Number 4.5 Badge */}
            <div className="absolute top-12 right-6 bg-blue-600/40 border border-blue-500/60 rounded-xl px-3 py-1 backdrop-blur-md hidden sm:flex items-center space-x-1.5">
              <Zap size={16} className="text-blue-400 fill-blue-400" />
              <span className="text-xs font-black text-white tracking-wider">الجانب 4.5 (أربعة ونصف)</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Center Energy Collision Rift */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-transparent via-cyan-300 to-transparent blur-[1px] z-10 opacity-70" />
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white z-10 opacity-90 shadow-[0_0_20px_#ffffff]" />
      
      {/* Floating clash sparks */}
      <motion.div 
        animate={{ y: ['-50%', '150%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-40 bg-gradient-to-b from-yellow-300/40 via-white to-transparent blur-md z-10 pointer-events-none"
      />

      {/* TOP HEADER: Version & Event Pill */}
      <div className="relative z-30 pt-8 sm:pt-10 flex flex-col items-center px-4 w-full text-center">
        {/* The requested 1/2 Four and a half Seven Pill */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-white/20 rounded-full backdrop-blur-xl shadow-2xl mb-3"
        >
          <div className="flex items-center space-x-1 text-red-400 font-black text-xs sm:text-sm">
            <span>7</span>
            <span className="text-white/60">سبعة</span>
          </div>
          <span className="text-yellow-400 font-black text-xs px-1">⚔️</span>
          <div className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-[11px] sm:text-xs font-black text-yellow-300">
            1\2
          </div>
          <span className="text-yellow-400 font-black text-xs px-1">⚔️</span>
          <div className="flex items-center space-x-1 text-blue-400 font-black text-xs sm:text-sm">
            <span>4.5</span>
            <span className="text-white/60">أربعة ونصف</span>
          </div>
        </motion.div>

        {/* Update Title: تحديث لون الأحمر للأزرق */}
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] text-white"
        >
          <span className="bg-gradient-to-r from-red-500 via-amber-300 to-blue-400 bg-clip-text text-transparent">
            تحديث لون الأحمر للأزرق
          </span>
        </motion.h1>

        {/* Subtitle tag */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-1.5 text-[11px] sm:text-xs font-bold text-white/80 uppercase tracking-wider"
        >
          <span className="text-red-400">RED TO BLUE UPDATE</span>
          <span className="text-white/40">•</span>
          <span className="text-amber-300">الفصل 1/2</span>
          <span className="text-white/40">•</span>
          <span className="text-blue-400">أربعة ونصف 4.5 / 7 سبعة</span>
        </motion.div>
      </div>

      {/* CENTER: FC 27 LOGO & BADGE */}
      <div className="relative z-30 flex flex-col items-center justify-center my-auto px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          {/* Animated Glow Halo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 bg-gradient-to-r from-red-600/30 via-purple-600/20 to-blue-600/30 rounded-full blur-2xl"
          />

          {/* FC 27 Emblem */}
          <div className="relative flex items-center justify-center mb-4">
            <h2 className="text-7xl sm:text-8xl md:text-9xl font-black italic tracking-tighter flex drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
              <span className="text-red-500 pr-2 sm:pr-3">FC</span>
              <span className="text-blue-500 pl-2 sm:pl-3 border-l-4 border-white/40">27</span>
            </h2>
          </div>

          {/* Dual badges: 7 سبعة & 4.5 أربعة ونصف */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Flame size={14} className="text-red-400" />
              <span className="text-[11px] sm:text-xs font-black text-red-200">الجانب 7 • سبعة</span>
            </div>

            <div className="px-2.5 py-1 bg-yellow-500/20 border border-yellow-400/50 rounded-lg text-[11px] font-black text-yellow-300">
              1\2
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 bg-blue-600/30 border border-blue-500/50 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Zap size={14} className="text-blue-400" />
              <span className="text-[11px] sm:text-xs font-black text-blue-200">الجانب 4.5 • أربعة ونصف</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM: PROGRESS BAR & STATUS */}
      <div className="relative z-30 pb-10 sm:pb-12 w-full max-w-lg px-6 flex flex-col items-center">
        {/* Status text with requested update name */}
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Sparkles size={16} className="text-yellow-400 animate-spin" />
          <p className="text-xs sm:text-sm font-black text-white tracking-wide">
            <span>جارِ تحميل </span>
            <span className="text-red-400">تحديث لون الأحمر </span>
            <span className="text-yellow-400 font-mono">1\2 (4.5 • 7) </span>
            <span className="text-blue-400">للأزرق...</span>
          </p>
          <Sparkles size={16} className="text-yellow-400 animate-spin" />
        </div>

        {/* Progress Bar with Red to Blue clash gradient */}
        <div className="w-full h-4 sm:h-5 bg-black/80 rounded-full p-0.5 sm:p-1 border-2 border-white/30 overflow-hidden backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.9)] relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-blue-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: "easeOut" }}
          />
          {/* Shiny overlay highlight */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-full" />
        </div>

        {/* Percentage & Connection Info */}
        <div className="w-full flex justify-between items-center mt-2.5 px-1 tabular-nums">
          <span className="text-[10px] font-black text-white/60 tracking-widest uppercase flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400 inline" />
            تحديث لون الأحمر للأزرق • 1\2 أربعة ونصف سبعة
          </span>
          <span className="text-sm font-black text-white drop-shadow-md">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

