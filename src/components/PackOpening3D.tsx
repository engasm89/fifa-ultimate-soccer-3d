/**
 * 3D Pack Opening Component
 * Integrates mobile simulator pack opening with 3D visual effects
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Sparkles, Diamond, Coins, X, Trophy } from 'lucide-react';
import { Player } from '../data/players';
import { PlayerCard3D } from './PlayerCard3D';
import { PLAYERS } from '../data/players';

interface PackOpening3DProps {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  pounds: number;
  onSpendGems: (amount: number) => void;
  onSpendPounds: (amount: number) => void;
  onPlayerFound: (player: Player) => void;
}

type PackType = 'bronze' | 'silver' | 'gold' | 'premium';

export const PackOpening3D: React.FC<PackOpening3DProps> = ({
  isOpen,
  onClose,
  gems,
  pounds,
  onSpendGems,
  onSpendPounds,
  onPlayerFound
}) => {
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openedPlayer, setOpenedPlayer] = useState<Player | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const packs = [
    {
      type: 'bronze' as PackType,
      name: 'باكة برونزية',
      cost: 100,
      currency: 'gems' as const,
      color: 'from-amber-700 to-amber-900',
      minRating: 75,
      maxRating: 85,
      icon: <Package className="w-8 h-8 text-amber-400" />
    },
    {
      type: 'silver' as PackType,
      name: 'باكة فضية',
      cost: 250,
      currency: 'gems' as const,
      color: 'from-slate-400 to-slate-600',
      minRating: 80,
      maxRating: 90,
      icon: <Sparkles className="w-8 h-8 text-slate-300" />
    },
    {
      type: 'gold' as PackType,
      name: 'باكة ذهبية',
      cost: 500,
      currency: 'gems' as const,
      color: 'from-yellow-400 to-amber-600',
      minRating: 85,
      maxRating: 95,
      icon: <Diamond className="w-8 h-8 text-yellow-400 fill-yellow-400" />
    },
    {
      type: 'premium' as PackType,
      name: 'باكة بريميوم',
      cost: 50000,
      currency: 'pounds' as const,
      color: 'from-purple-500 to-pink-600',
      minRating: 90,
      maxRating: 120,
      icon: <Trophy className="w-8 h-8 text-purple-400" />
    }
  ];

  const openPack = async (pack: typeof packs[0]) => {
    if (pack.currency === 'gems' && gems < pack.cost) return;
    if (pack.currency === 'pounds' && pounds < pack.cost) return;

    setSelectedPack(pack.type);
    setIsOpening(true);

    // Deduct cost
    if (pack.currency === 'gems') {
      onSpendGems(pack.cost);
    } else {
      onSpendPounds(pack.cost);
    }

    // Simulate opening delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get random player based on pack tier
    const eligiblePlayers = PLAYERS.filter(
      p => p.rating >= pack.minRating && p.rating <= pack.maxRating
    );
    const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];

    setOpenedPlayer(randomPlayer);
    onPlayerFound(randomPlayer);
    setIsOpening(false);
    setShowCelebration(true);

    // Auto-hide celebration after 4 seconds
    setTimeout(() => {
      setShowCelebration(false);
      setOpenedPlayer(null);
      setSelectedPack(null);
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Package className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">متجر الباكات</h2>
                <p class="text-sm text-slate-400">افتح الباكات للحصول على لاعبين جدد</p>
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
            <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-500/30">
              <Coins className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="text-sm font-bold text-white">{pounds.toLocaleString()} عملة</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {isOpening ? (
              <div className="flex flex-col items-center justify-center py-20 relative">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mb-6"
                >
                  <Package className="w-full h-full text-amber-400" />
                </motion.div>
                <p className="text-xl font-bold text-white animate-pulse">جاري فتح الباكة...</p>
                <p className="text-slate-400 mt-2">تحليل الاحتمالات واختيار اللاعب</p>
                
                {/* Enhanced 3D particle effects during opening */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                      initial={{ 
                        opacity: 0,
                        scale: 0,
                        x: '50%',
                        y: '50%'
                      }}
                      animate={{
                        x: [null, (Math.random() - 0.5) * 200 + '%'],
                        y: [null, (Math.random() - 0.5) * 200 + '%'],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 0.5
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : showCelebration && openedPlayer ? (
              <div className="flex flex-col items-center justify-center py-10 relative">
                {/* 3D Celebration Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                      initial={{ 
                        opacity: 0,
                        scale: 0,
                        x: '50%',
                        y: '50%'
                      }}
                      animate={{
                        x: [null, (Math.random() - 0.5) * 300 + '%'],
                        y: [null, (Math.random() - 0.5) * 300 + '%'],
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 0.3
                      }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mb-6 relative z-10"
                >
                  <PlayerCard3D
                    player={openedPlayer}
                    size="lg"
                    show3DEffects={true}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center relative z-10"
                >
                  <h3 className="text-2xl font-black text-white mb-2">🎉 حصلت على لاعب جديد!</h3>
                  <p className="text-amber-400 font-bold text-lg">{openedPlayer.name} - OVR {openedPlayer.rating}</p>
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {packs.map((pack) => {
                  const canAfford = pack.currency === 'gems' ? gems >= pack.cost : pounds >= pack.cost;
                  
                  return (
                    <motion.button
                      key={pack.type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openPack(pack)}
                      disabled={!canAfford}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        canAfford
                          ? `bg-gradient-to-br ${pack.color} hover:shadow-2xl cursor-pointer`
                          : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-black/30 rounded-full">
                          {pack.icon}
                        </div>
                        <h3 className="text-lg font-black text-white">{pack.name}</h3>
                        <div className="flex items-center gap-2">
                          {pack.currency === 'gems' ? (
                            <Diamond className="w-4 h-4 text-blue-300 fill-blue-300" />
                          ) : (
                            <Coins className="w-4 h-4 text-red-300 fill-red-300" />
                          )}
                          <span className="text-white font-bold">{pack.cost.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-white/70">
                          OVR {pack.minRating}-{pack.maxRating}
                        </p>
                      </div>
                      {!canAfford && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">غير كافي</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 text-center">
            <p className="text-xs text-slate-400">
              احتمالات الحصول على لاعبين عالي المستوى تزيد مع الباكات الأغلى
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};