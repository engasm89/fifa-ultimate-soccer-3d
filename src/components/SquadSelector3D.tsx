/**
 * Squad Selector for 3D Gameplay
 * Simplified squad builder integrated with 3D game system
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Trophy, Shield } from 'lucide-react';
import { Player } from '../data/players';
import { PlayerCard3D } from './PlayerCard3D';

interface SquadSelector3DProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onStartMatch: (squad: Player[]) => void;
}

export const SquadSelector3D: React.FC<SquadSelector3DProps> = ({
  isOpen,
  onClose,
  players,
  onStartMatch
}) => {
  const [selectedSquad, setSelectedSquad] = useState<(Player | null)[]>(new Array(5).fill(null));
  const formation = ['GK', 'DEF', 'MID', 'MID', 'FWD'];

  const handlePlayerSelect = (player: Player, slotIndex: number) => {
    const newSquad = [...selectedSquad];
    newSquad[slotIndex] = player;
    setSelectedSquad(newSquad);
  };

  const handleRemovePlayer = (slotIndex: number) => {
    const newSquad = [...selectedSquad];
    newSquad[slotIndex] = null;
    setSelectedSquad(newSquad);
  };

  const canStartMatch = selectedSquad.filter(p => p !== null).length >= 3;

  const getTeamRating = () => {
    const validPlayers = selectedSquad.filter(p => p !== null) as Player[];
    if (validPlayers.length === 0) return 0;
    const totalRating = validPlayers.reduce((sum, p) => sum + p.rating, 0);
    return Math.round(totalRating / validPlayers.length);
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-5xl max-h-[85vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">اختيار التشكيلة</h2>
                <p className="text-sm text-slate-400">اختر 5 لاعبين للمباراة ثلاثية الأبعاد</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">تقييم الفريق: {getTeamRating()}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="flex h-[60vh]">
            {/* Formation Display */}
            <div className="w-1/2 p-6 border-r border-slate-700 bg-slate-800/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                التشكيلة الحالية
              </h3>
              
              <div className="space-y-3">
                {formation.map((position, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center font-black text-white text-xs">
                        {position}
                      </div>
                      
                      {selectedSquad[idx] ? (
                        <div className="flex-1 flex items-center gap-3">
                          <PlayerCard3D
                            player={selectedSquad[idx]!}
                            size="sm"
                            show3DEffects={false}
                          />
                          <button
                            onClick={() => handleRemovePlayer(idx)}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                          >
                            <X size={14} className="text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 text-center text-slate-500 text-sm py-2">
                          اختر لاعباً
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Player Selection */}
            <div className="w-1/2 p-6 overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">اللاعبون المتاحون</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {players.slice(0, 20).map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      const emptySlot = selectedSquad.findIndex(p => p === null);
                      if (emptySlot !== -1) {
                        handlePlayerSelect(player, emptySlot);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <PlayerCard3D
                      player={player}
                      size="sm"
                      show3DEffects={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-between items-center">
            <p className="text-xs text-slate-400">
              {selectedSquad.filter(p => p !== null).length}/5 لاعبين مختارين
            </p>
            <button
              onClick={() => {
                const validPlayers = selectedSquad.filter(p => p !== null) as Player[];
                if (validPlayers.length >= 3) {
                  onStartMatch(validPlayers);
                  onClose();
                }
              }}
              disabled={!canStartMatch}
              className={`px-6 py-2 font-bold rounded-lg transition-colors ${
                canStartMatch
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              بدء المباراة ثلاثية الأبعاد
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};