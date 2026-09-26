/**
 * 3D-Compatible Player Card Component
 * Integrates mobile simulator player cards with the 3D game UI
 */

import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../data/players';
import { SuperstarProfile } from '../game/superstars';
import { playerToSuperstar } from '../data/playerBridge';
import { Star, Trophy, Shield, Zap } from 'lucide-react';

interface PlayerCard3DProps {
  player: Player | SuperstarProfile;
  size?: 'sm' | 'md' | 'lg';
  show3DEffects?: boolean;
  onClick?: () => void;
}

export const PlayerCard3D: React.FC<PlayerCard3DProps> = ({
  player,
  size = 'md',
  show3DEffects = true,
  onClick
}) => {
  // Convert Player to SuperstarProfile if needed
  const superstar = 'id' in player && typeof player.id === 'string' && 
    ['mbappe', 'ronaldo', 'haaland', 'messi', 'neymar'].includes(player.id) 
    ? player as SuperstarProfile 
    : playerToSuperstar(player as Player);

  const sizeClasses = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 120) return 'from-yellow-400 to-amber-600';
    if (rating >= 115) return 'from-amber-400 to-orange-600';
    if (rating >= 110) return 'from-emerald-400 to-green-600';
    if (rating >= 100) return 'from-blue-400 to-indigo-600';
    return 'from-gray-400 to-slate-600';
  };

  const getCardStyle = () => {
    if (!show3DEffects) return {};
    
    return {
      transform: 'perspective(1000px) rotateY(5deg) rotateX(5deg)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(251, 191, 36, 0.3), 0 0 60px rgba(251, 191, 36, 0.1)'
    };
  };

  return (
    <motion.div
      whileHover={show3DEffects ? { 
        scale: 1.05, 
        rotateY: 0, 
        rotateX: 0,
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(251, 191, 36, 0.5)'
      } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden cursor-pointer transition-all duration-300`}
      style={getCardStyle()}
    >
      {/* Card Background with Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRatingColor(superstar.rating)} opacity-90`} />
      
      {/* 3D Shimmer Effect */}
      {show3DEffects && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer" 
             style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)' }} />
      )}

      {/* Floating Particles for High-Rated Players */}
      {show3DEffects && superstar.rating >= 115 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ 
                opacity: 0,
                scale: 0
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>
      )}

      {/* Player Image Area */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur rounded-lg px-2 py-1 border border-white/20">
          <span className="text-lg font-black text-white">{superstar.rating}</span>
        </div>

        {/* Player Avatar/Emoji */}
        <div className="text-4xl mb-2 filter drop-shadow-lg">
          {superstar.avatarEmoji}
        </div>

        {/* Player Name */}
        <div className="text-center">
          <h3 className="text-white font-black text-xs uppercase truncate drop-shadow-md">
            {superstar.nameEn}
          </h3>
          <p className="text-white/80 text-[8px] font-semibold truncate">
            {superstar.club}
          </p>
        </div>

        {/* Position Badge */}
        <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur rounded px-1.5 py-0.5">
          <span className="text-white font-black text-[10px]">{superstar.position}</span>
        </div>
      </div>

      {/* Special Effects for High-Rated Players */}
      {superstar.rating >= 115 && show3DEffects && (
        <>
          <div className="absolute top-0 right-0 w-8 h-8">
            <Star className="text-yellow-300 fill-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-xl blur-xl -z-10" />
        </>
      )}

      {/* Stats Preview (Hover) */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur opacity-0 hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center p-2">
        <div className="grid grid-cols-2 gap-1 text-[8px]">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-white font-bold">PAC {superstar.stats.PAC}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-red-400" />
            <span className="text-white font-bold">SHO {superstar.stats.SHO}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-white font-bold">DEF {superstar.stats.DEF}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-purple-400" />
            <span className="text-white font-bold">DRI {superstar.stats.DRI}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};