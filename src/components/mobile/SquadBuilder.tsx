import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { Player } from '../../data/players';
import { PlayerCard } from './PlayerCard';

interface SquadBuilderProps {
  squad: (Player | null)[];
  onRemove: (index: number) => void;
  onAdd: (index: number) => void;
  selectedSlot: number | null;
  onUpgrade?: (playerId: string) => void;
  gems?: number;
}

import { FootballField } from './FootballField';

export const SquadBuilder: React.FC<SquadBuilderProps> = ({ 
  squad, 
  onRemove, 
  onAdd, 
  selectedSlot,
  onUpgrade,
  gems = 0
}) => {
  const positions = ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW'];

  const renderSlot = (idx: number) => (
    <div key={idx} className="relative group">
      <AnimatePresence mode="wait">
        {squad[idx] ? (
          <motion.div
            key={squad[idx]!.id}
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative cursor-pointer"
            onClick={() => onRemove(idx)}
          >
            <PlayerCard 
              player={squad[idx]!} 
              size="sm" 
              onUpgrade={() => onUpgrade?.(squad[idx]!.id)}
              canUpgrade={(squad[idx]!.rank || 0) < 5 && gems >= 100}
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20">
              <X size={14} className="text-white" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            layout
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(234,179,8,0.05)' }}
            onClick={() => onAdd(idx)}
            className={`w-20 h-32 xs:w-24 xs:h-36 sm:w-28 sm:h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all backdrop-blur-sm ${
              selectedSlot === idx 
                ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                : 'border-yellow-500/20 bg-yellow-500/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
              selectedSlot === idx ? 'bg-yellow-500/20 border-yellow-500' : 'bg-yellow-500/5 border-yellow-500/20'
            }`}>
              <Plus size={16} className={selectedSlot === idx ? "text-yellow-500" : "text-yellow-600/40"} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              selectedSlot === idx ? 'text-yellow-500' : 'text-yellow-600/40'
            }`}>{positions[idx]}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-8">
      {/* Tactical Pitch Container */}
      <FootballField vertical className="w-full shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
        {/* Squad Grid */}
        <div className="absolute inset-0 grid grid-rows-4 gap-1 sm:gap-4 p-2 sm:p-10 z-10">
          {/* Forwards (LW, ST, RW) */}
          <div className="flex justify-around items-center">
            {[8, 9, 10].map(renderSlot)}
          </div>

          {/* Midfielders (CM, CM, CM) */}
          <div className="flex justify-around items-center">
            {[5, 6, 7].map(renderSlot)}
          </div>

          {/* Defenders (LB, CB, CB, RB) */}
          <div className="flex justify-around items-center px-4">
            {[1, 2, 3, 4].map(renderSlot)}
          </div>

          {/* Goalkeeper (GK) */}
          <div className="flex justify-center items-center">
            {[0].map(renderSlot)}
          </div>
        </div>

        {/* Squad Stats Overlay */}
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex justify-between items-end z-20">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 sm:px-8 sm:py-5 rounded-xl sm:rounded-[2rem] border border-yellow-500/10 shadow-xl">
            <div className="text-[7px] sm:text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-1">TEAM RATING</div>
            <div className="text-xl sm:text-4xl font-black italic text-gray-900 tracking-tighter">
              {Math.round(squad.reduce((acc, p) => acc + (p?.rating || 0), 0) / 11) || 0}
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 sm:px-8 sm:py-5 rounded-xl sm:rounded-[2rem] border border-yellow-500/10 shadow-xl">
            <div className="text-[7px] sm:text-[10px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-1">CHEMISTRY</div>
            <div className="text-xl sm:text-4xl font-black italic text-gray-900 tracking-tighter">100</div>
          </div>
        </div>
      </FootballField>
    </div>
  );
};
