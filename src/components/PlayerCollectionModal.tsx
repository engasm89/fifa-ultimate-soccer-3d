/**
 * Player Collection Modal
 * Displays the player collection with 3D-compatible cards
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Diamond } from 'lucide-react';
import { PlayerCard3D } from './PlayerCard3D';
import { Player } from '../data/players';

interface PlayerCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  gems: number;
  onPlayerSelect?: (player: Player) => void;
}

export const PlayerCollectionModal: React.FC<PlayerCollectionModalProps> = ({
  isOpen,
  onClose,
  players,
  gems,
  onPlayerSelect
}) => {
  if (!isOpen) return null;

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[80vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">مجموعة اللاعبين</h2>
                <p className="text-sm text-slate-400">{players.length} لاعب في مجموعتك</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Currency Display */}
          <div className="flex items-center justify-center gap-4 p-3 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-500/30">
              <Diamond className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span className="text-sm font-bold text-white">{gems.toLocaleString()} جوهرة</span>
            </div>
          </div>

          {/* Player Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {sortedPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400 font-semibold">لا يوجد لاعبون في مجموعتك</p>
                <p className="text-slate-500 text-sm mt-2">افتح بعض الباكات للحصول على لاعبين</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {sortedPlayers.map((player) => (
                  <div key={player.id} onClick={() => onPlayerSelect?.(player)}>
                    <PlayerCard3D
                      player={player}
                      size="sm"
                      show3DEffects={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-between items-center">
            <p className="text-xs text-slate-400">
              انقر على اللاعب لاستخدامه في المباراة
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};