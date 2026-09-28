/**
 * 3D-Compatible Player Card Component
 * Integrates mobile simulator player cards with the 3D game UI
 */

import React from 'react';
import { motion } from 'motion/react';
import { Player, getCleanPlayerImage } from '../data/players';
import { SuperstarProfile } from '../game/superstars';
import { playerToSuperstar } from '../data/playerBridge';
import { Star } from 'lucide-react';

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

  const isSeasonStar = superstar.rating >= 113;
  const stats = [
    ['سر', superstar.stats.PAC], ['سد', superstar.stats.SHO], ['مر', superstar.stats.PAS],
    ['مرغ', superstar.stats.DRI], ['دف', superstar.stats.DEF], ['بد', superstar.stats.PHY],
  ];

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
      {/* Season-star card: dark navy, gold frame, luminous stadium rays. */}
      <div className={`absolute inset-0 bg-gradient-to-br ${isSeasonStar ? 'from-[#100d2c] via-[#25205a] to-[#090a1f]' : getRatingColor(superstar.rating)}`} />
      <div className="absolute inset-[3px] rounded-[10px] border border-yellow-200/80 shadow-[inset_0_0_0_2px_rgba(128,84,20,.8),inset_0_0_24px_rgba(250,204,21,.2)]" />
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_10%,rgba(250,204,21,.55),transparent_27%),linear-gradient(120deg,transparent_35%,rgba(250,204,21,.22)_36%,transparent_44%),linear-gradient(55deg,transparent_43%,rgba(250,204,21,.18)_44%,transparent_52%)]" />
      
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

      {/* Card hierarchy follows a collector-card layout: rating, portrait, identity and stats. */}
      <div className="relative z-10 h-full p-2 text-[#ffe58a]">
        <div className="absolute left-3 top-3 leading-none"><div className="text-xl font-black tracking-tighter text-yellow-200 drop-shadow">{superstar.rating}</div><div className="mt-0.5 text-[8px] font-black text-yellow-100">{superstar.position}</div></div>
        <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border border-yellow-200/80 bg-yellow-400/20"><Star className="h-2.5 w-2.5 fill-yellow-200 text-yellow-200" /></div>
        <div className="absolute left-1/2 top-7 h-[57%] w-[82%] -translate-x-1/2 overflow-hidden rounded-b-[40%] border-b border-yellow-200/50 bg-gradient-to-t from-[#17143f] via-transparent to-transparent">
          <img src={getCleanPlayerImage(player as Player)} alt={superstar.nameEn} className="h-full w-full object-contain object-bottom drop-shadow-[0_8px_8px_rgba(0,0,0,.75)]" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
        </div>
        <div className="absolute bottom-9 left-2 right-2 text-center"><p className="truncate text-[7px] font-black tracking-[.12em] text-yellow-100">نجم الموسم</p><h3 className="truncate text-[9px] font-black uppercase text-yellow-100 drop-shadow">{superstar.nameEn}</h3></div>
        <div className="absolute bottom-2 left-2 right-2 grid grid-cols-3 gap-x-1 gap-y-0.5 border-t border-yellow-200/50 pt-1 text-center">{stats.map(([label, value]) => <div key={label as string} className="leading-none"><span className="block text-[6px] font-bold text-yellow-100/80">{label}</span><span className="text-[8px] font-black text-yellow-200">{value as number}</span></div>)}</div>
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

    </motion.div>
  );
};
