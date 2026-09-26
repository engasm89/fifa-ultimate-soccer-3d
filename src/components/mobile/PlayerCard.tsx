import React from 'react';
import { motion } from 'motion/react';
import { Player, getPlayerSkillBoost, SkillBoost, getCleanPlayerImage } from '../../data/players';
import { Star, Flame, Zap, Crosshair, Shield, Compass, Sparkles, Award } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  onlyImage?: boolean;
  onUpgrade?: () => void;
  canUpgrade?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  size = 'md', 
  onlyImage = false,
  onUpgrade,
  canUpgrade = false
}) => {
  const rating = player.rating;
  const rank = player.rank || 0;
  const skill = getPlayerSkillBoost(player);
  const isGoldSkill = skill?.type === 'gold';
  
  const sizeClasses = {
    sm: 'w-20 h-32 xs:w-24 xs:h-36 sm:w-28 sm:h-40',
    md: 'w-[220px] h-[330px] sm:w-[300px] sm:h-[450px]',
    lg: 'w-[280px] h-[410px] sm:w-[350px] sm:h-[520px]'
  };

  const renderSkillIcon = (category: SkillBoost['category'], className: string = "w-3 h-3") => {
    switch (category) {
      case 'shooting':
        return <Flame className={className} />;
      case 'pace':
        return <Zap className={className} />;
      case 'dribbling':
        return <Sparkles className={className} />;
      case 'defending':
        return <Shield className={className} />;
      case 'passing':
        return <Compass className={className} />;
      case 'gk':
        return <Award className={className} />;
      case 'physical':
        return <Crosshair className={className} />;
      default:
        return <Zap className={className} />;
    }
  };

  if (onlyImage) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, zIndex: 10 }}
        className={`${sizeClasses[size]} relative overflow-hidden shadow-2xl group rounded-xl bg-slate-950 border border-slate-700/50`}
      >
        {/* Red & Blue Split Background */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="flex-1 bg-gradient-to-br from-red-600/30 to-red-950/40" />
          <div className="flex-1 bg-gradient-to-bl from-blue-600/30 to-blue-950/40" />
        </div>
        
        {/* Central Energy Glow */}
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />

        <img 
          src={getCleanPlayerImage(player)} 
          alt={player.name}
          className="w-full h-full object-contain object-bottom group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallback = getCleanPlayerImage(player);
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
        />

        {/* Top-Left: Rating & Position */}
        <div className="absolute top-1 left-1.5 z-20 flex flex-col items-center bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10">
          <span className="text-[11px] sm:text-xs font-black text-yellow-400 leading-none">
            {rating}
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold text-white/90 leading-none mt-0.5">
            {player.detailedPosition || player.position}
          </span>
        </div>

        {/* Top-Right (على يمين اللاعب): Skill Boost Badge (Only if rating >= 118) */}
        {skill && (
          <div className="absolute top-1 right-1.5 z-20 flex flex-col items-end">
            <div className={`flex items-center space-x-0.5 px-1 py-0.5 rounded shadow-lg border backdrop-blur-sm ${
              isGoldSkill 
                ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 text-yellow-950 border-yellow-200 shadow-[0_0_10px_rgba(245,158,11,0.8)]' 
                : 'bg-gradient-to-b from-slate-100 via-gray-200 to-slate-400 text-slate-900 border-white shadow-[0_0_10px_rgba(203,213,225,0.7)]'
            }`}>
              {renderSkillIcon(skill.category, "w-2.5 h-2.5")}
              <span className="text-[9px] font-black leading-none tracking-tight">+{skill.level}</span>
            </div>
            <span className={`text-[7px] font-bold px-1 rounded-sm mt-0.5 shadow ${
              isGoldSkill ? 'bg-amber-500/90 text-yellow-950' : 'bg-slate-600/90 text-slate-100'
            }`}>
              {isGoldSkill ? 'ذهب' : 'فضة'}
            </span>
          </div>
        )}
        
        {/* Bottom Rank Gems */}
        <div className="absolute bottom-1 left-1.5 flex space-x-0.5 z-20">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full border-[0.5px] border-white/30 ${
                i < rank ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)]' : 'bg-black/50'
              }`} 
            />
          ))}
        </div>

        {/* Upgrade Button Overlay */}
        {onUpgrade && canUpgrade && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onUpgrade();
            }}
            className="absolute bottom-1 right-1.5 z-30 bg-yellow-500 text-black p-1 rounded shadow-lg hover:scale-110 active:scale-90 transition-transform"
          >
            <Star size={10} fill="currentColor" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02, zIndex: 50 }}
      className={`${sizeClasses[size]} relative flex flex-col transition-all duration-500 group select-none`}
    >
      {/* Red & Blue Clash Card Shield Design */}
      <div 
        className="absolute inset-0 z-0 bg-slate-950 shadow-[0_0_40px_rgba(239,68,68,0.3),0_0_40px_rgba(59,130,246,0.3)] overflow-hidden border-2 border-slate-700/60 rounded-2xl"
        style={{
          clipPath: 'polygon(0% 8%, 50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%)',
        }}
      >
        {/* Red & Blue Split Background */}
        <div className="absolute inset-0 flex">
          {/* Left Side: Crimson Red */}
          <div className="flex-1 bg-gradient-to-br from-red-700/50 via-red-900/60 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.4),transparent_70%)]" />
            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-red-400/40 shadow-[0_0_10px_rgba(239,68,68,1)]" />
          </div>

          {/* Right Side: Electric Royal Blue */}
          <div className="flex-1 bg-gradient-to-bl from-blue-700/50 via-blue-900/60 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.4),transparent_70%)]" />
            <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-blue-400/40 shadow-[0_0_10px_rgba(59,130,246,1)]" />
          </div>
        </div>

        {/* Central Energy Lightning Seam */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-white/30 via-cyan-300/20 to-transparent blur-[2px] pointer-events-none" />

        {/* Dynamic Shiny Diagonal Laser Streaks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`streak-${i}`}
              animate={{ 
                x: ['-150%', '250%'],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 3.5 + i, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 1.8
              }}
              className="absolute w-[200%] h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[35deg] blur-[1px]"
            />
          ))}
        </div>

        {/* Tactical Polygon Carbon Texture Overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      {/* Top Banner: Dual Red & Blue Energy Crest */}
      <div className="absolute top-3 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <div className="flex items-center space-x-1 px-3 py-0.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md shadow-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]" />
          <span className="text-[9px] font-black tracking-widest text-white/90 uppercase">RED & BLUE CLASH</span>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,1)]" />
        </div>
      </div>

      {/* Left Side (أعلى اليسار): Rating, Position & Country Flag */}
      <div className={`absolute ${size === 'sm' ? 'top-6 left-2' : 'top-10 left-5 sm:left-7'} z-40 flex flex-col items-center select-none`}>
        {/* OVR Rating */}
        <motion.span 
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`${size === 'sm' ? 'text-lg' : 'text-3xl sm:text-5xl'} font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-yellow-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-tighter`}
        >
          {rating}
        </motion.span>

        {/* Position */}
        <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs sm:text-sm'} font-black uppercase text-red-200 tracking-wider drop-shadow-md`}>
          {player.detailedPosition || player.position}
        </span>

        {/* Thin Divider */}
        <div className="w-6 sm:w-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent my-1 sm:my-1.5" />

        {/* Country Flag */}
        <img 
          src={`https://flagcdn.com/w80/${
            player.nation.toLowerCase() === 'portugal' ? 'pt' : 
            player.nation.toLowerCase() === 'argentina' ? 'ar' : 
            player.nation.toLowerCase() === 'france' ? 'fr' : 
            player.nation.toLowerCase() === 'brazil' ? 'br' : 
            player.nation.toLowerCase() === 'england' ? 'gb-eng' : 
            player.nation.toLowerCase() === 'norway' ? 'no' : 
            player.nation.toLowerCase() === 'belgium' ? 'be' : 
            player.nation.toLowerCase() === 'netherlands' ? 'nl' : 
            player.nation.toLowerCase() === 'egypt' ? 'eg' : 
            player.nation.toLowerCase() === 'poland' ? 'pl' : 
            player.nation.toLowerCase() === 'croatia' ? 'hr' : 
            player.nation.toLowerCase() === 'spain' ? 'es' : 'pt'
          }.png`}
          alt={player.nation}
          className={`${size === 'sm' ? 'w-4 h-3' : 'w-7 h-5 sm:w-9 sm:h-6'} shadow-md border border-white/30 rounded-sm object-cover`}
        />
      </div>

      {/* Right Side (على يمين اللاعب): SKILL INDICATOR (Only for rating >= 118) + Club Crest */}
      <div className={`absolute ${size === 'sm' ? 'top-6 right-2' : 'top-10 right-5 sm:right-7'} z-40 flex flex-col items-end select-none`}>
        {skill && (
          <>
            {/* The Skill Boost Badge */}
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2 py-1 rounded-lg border shadow-xl backdrop-blur-md transition-transform ${
                isGoldSkill 
                  ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 text-yellow-950 border-yellow-200 shadow-[0_0_15px_rgba(245,158,11,0.7)]' 
                  : 'bg-gradient-to-b from-slate-100 via-gray-200 to-slate-400 text-slate-900 border-white shadow-[0_0_15px_rgba(203,213,225,0.7)]'
              }`}
            >
              {/* Skill Icon */}
              <div className={`${isGoldSkill ? 'text-yellow-950' : 'text-slate-900'}`}>
                {renderSkillIcon(skill.category, size === 'sm' ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5")}
              </div>

              {/* Skill Level */}
              <span className={`${size === 'sm' ? 'text-xs' : 'text-sm sm:text-base'} font-black tracking-tight leading-none`}>
                +{skill.level}
              </span>
            </motion.div>

            {/* Skill Type & Arabic Name Pill (Visible on md and lg) */}
            {size !== 'sm' && (
              <div className="flex flex-col items-end mt-1.5">
                <div className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-md flex items-center space-x-1 ${
                  isGoldSkill 
                    ? 'bg-amber-500/90 text-amber-950 border border-amber-300/60' 
                    : 'bg-slate-300/90 text-slate-950 border border-white/60'
                }`}>
                  <span>{isGoldSkill ? 'مهارة ذهبية' : 'مهارة فضية'}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-white/90 mt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-right">
                  {skill.nameAr}
                </span>
              </div>
            )}

            {/* Compact Label for 'sm' */}
            {size === 'sm' && (
              <span className={`text-[8px] font-black px-1 rounded-sm mt-0.5 shadow ${
                isGoldSkill ? 'bg-amber-500 text-yellow-950' : 'bg-slate-400 text-slate-950'
              }`}>
                {isGoldSkill ? 'ذهب' : 'فضة'}
              </span>
            )}
          </>
        )}

        {/* Club Crest */}
        <div className={`${skill ? 'mt-2' : ''} ${size === 'sm' ? 'w-5 h-5' : 'w-8 h-8 sm:w-11 sm:h-11'} bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center p-1 shadow-lg`}>
          <img 
            src={`https://cdn.sofifa.net/teams/${
              player.club === 'Inter Miami' ? '112893' : 
              player.club === 'Al Nassr' ? '112139' : 
              player.club === 'Real Madrid' ? '243' : 
              player.club === 'Arsenal' ? '1' : 
              player.club === 'Borussia Dortmund' ? '22' : 
              player.club === 'Man Utd' ? '11' : 
              player.club === 'RB Leipzig' ? '112172' : 
              player.club === 'Newcastle Utd' ? '13' : 
              player.club === 'Man City' ? '10' : 
              player.club === 'Liverpool' ? '9' : 
              player.club === 'Barcelona' ? '241' : 
              player.club === 'Bayern Munich' ? '21' : 
              player.club === 'Atletico Madrid' ? '240' : 
              player.club === 'Inter Milan' ? '44' : 
              player.club === 'AC Milan' ? '47' : 
              player.club === 'PSG' ? '73' : 
              player.club === 'Al Hilal' ? '112393' : 
              player.club === 'FC Porto' ? '236' : 
              player.club === 'Chelsea' ? '5' : '1'
            }/60.png`}
            alt={player.club}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Player Image - Center Stage */}
      <div className={`relative w-full ${size === 'sm' ? 'h-[95px] mt-8' : 'h-[250px] sm:h-[320px] mt-16'} z-20 flex justify-center items-end`}>
        <motion.img 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          src={getCleanPlayerImage(player)} 
          alt={player.name}
          className="max-w-[125%] max-h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const fallback = getCleanPlayerImage(player);
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
        />
        
        {/* Subtle Shine Flare */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-xl">
          <motion.div 
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 opacity-30"
          />
        </div>
      </div>

      {/* Bottom Plate: Player Name & Stars */}
      <div className={`absolute ${size === 'sm' ? 'bottom-2' : 'bottom-5 sm:bottom-6'} left-2 right-2 z-40 flex flex-col items-center`}>
        {/* Name Banner with Red & Blue Split Border */}
        <div className="w-[90%] py-0.5 sm:py-1 px-2 rounded-lg bg-slate-950/90 border border-slate-700/80 backdrop-blur-md shadow-2xl flex flex-col items-center">
          <span className={`${size === 'sm' ? 'text-[9px]' : 'text-xs sm:text-base'} font-black text-white tracking-wider text-center truncate w-full drop-shadow`}>
            {player.name}
          </span>

          {/* Rank Gems */}
          <div className="flex space-x-1 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border-[0.5px] border-white/40 ${
                  i < rank ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]' : 'bg-slate-800'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Upgrade Button when accessible */}
        {onUpgrade && canUpgrade && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onUpgrade();
            }}
            className="mt-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-yellow-950 rounded text-[9px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center space-x-1"
          >
            <Star size={10} fill="currentColor" />
            <span>ترقية الكرت</span>
          </button>
        )}
      </div>

      {/* Red & Blue Outer Aura on Hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20 blur-xl pointer-events-none -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
    </motion.div>
  );
};
