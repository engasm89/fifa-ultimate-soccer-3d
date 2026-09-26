import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Diamond, Coins } from 'lucide-react';
import { Player, PLAYERS } from '../../data/players';
import { PlayerCard } from './PlayerCard';

interface PackOpenerProps {
  onPlayerFound: (player: Player) => void;
  gems: number;
  pounds: number;
  packsOpened: number;
  onSpendGems: (amount: number) => void;
  onSpendPounds: (amount: number) => void;
}

export const PackOpener: React.FC<PackOpenerProps> = ({ onPlayerFound, gems, pounds, packsOpened, onSpendGems, onSpendPounds }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedPlayer, setRevealedPlayer] = useState<Player | null>(null);
  const [bulkPlayers, setBulkPlayers] = useState<Player[]>([]);

    const openPack = (count: number = 1, currency: 'gems' | 'pounds' = 'gems') => {
    if (isOpening) return;
    const costPerPack = currency === 'gems' ? 1000 : 50000;
    const totalCost = costPerPack * count;
    
    if (currency === 'gems' && gems < totalCost) return;
    if (currency === 'pounds' && pounds < totalCost) return;

    if (currency === 'gems') onSpendGems(totalCost);
    else onSpendPounds(totalCost);

    setIsOpening(true);
    setRevealedPlayer(null);
    setBulkPlayers([]);

    // Simulate opening delay
    setTimeout(() => {
      const foundPlayers: Player[] = [];
      
      for (let i = 0; i < count; i++) {
        const currentPackNumber = packsOpened + i + 1;
        const isGuaranteedLegend = currentPackNumber % 100 === 0;
        
        let availablePlayers = PLAYERS;

        if (isGuaranteedLegend) {
          // Every 100 packs -> Guaranteed high rated CR7 or LEGEND
          availablePlayers = PLAYERS.filter(p => p.rating >= 117);
        } else {
          // Weighted distribution for non-guaranteed packs
          const rand = Math.random();
          if (rand < 0.05) {
            availablePlayers = PLAYERS.filter(p => p.rating >= 117);
          } else if (rand < 0.20) {
            availablePlayers = PLAYERS.filter(p => p.rating === 115);
          } else if (rand < 0.40) {
            availablePlayers = PLAYERS.filter(p => p.rating === 113);
          } else if (rand < 0.70) {
            availablePlayers = PLAYERS.filter(p => p.rating === 112);
          } else {
            availablePlayers = PLAYERS.filter(p => p.rating <= 111);
          }
        }

        // Fallback if filter returns empty
        if (availablePlayers.length === 0) availablePlayers = PLAYERS;

        const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        
        // Ensure CR7 is granted at 100 if not found
        let playerToGive = randomPlayer;
        if (isGuaranteedLegend) {
          const cr7 = PLAYERS.find(p => p.id === 'sk-2' || p.name.includes('RONALDO'));
          if (cr7) playerToGive = cr7;
        }

        foundPlayers.push(playerToGive);
        
        if (count === 1) {
          setRevealedPlayer(playerToGive);
          onPlayerFound(playerToGive);
        } else {
          onPlayerFound(playerToGive);
        }
      }

      if (count > 1) {
        setBulkPlayers(foundPlayers);
      }
      
      setIsOpening(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] space-y-12 p-8 relative overflow-hidden bg-[#001a2a]">
      {/* Portuguese Split Background */}
      <div className="absolute inset-0 flex pointer-events-none opacity-10">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* Legends Silhouettes in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-30">
        <motion.img 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.5 }}
          src="https://cdn.sofifa.net/players/019/043/24_300.png"
          className="absolute -left-20 bottom-0 h-[80%] filter grayscale"
        />
        <motion.img 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.5 }}
          src="https://cdn.sofifa.net/players/001/040/24_300.png"
          className="absolute -right-20 bottom-0 h-[80%] filter grayscale scale-x-[-1]"
        />
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {!revealedPlayer && bulkPlayers.length === 0 ? (
          <div className="flex flex-col items-center space-y-8 z-10">
            {/* Title Section */}
            <div className="text-center">
              <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-black italic tracking-tighter bg-gradient-to-r from-green-400 via-white to-red-500 bg-clip-text text-transparent mb-2"
              >
                التحديث البرتغالي عراق أقوياء
              </motion.h2>
              <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">PORTUGUESE UPDATE • IRAQ STRONG</p>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-12 md:space-y-0 md:space-x-16">
            {/* Currency Info on the Side - Portuguese Style */}
            <div className="flex flex-col space-y-4 items-center md:items-end">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="glass-morphism p-6 rounded-[2rem] border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)] w-56 relative group bg-white/80"
              >
                <div className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-2 text-center">GEMS BALANCE</div>
                <div className="text-3xl font-black flex items-center justify-center space-x-3 text-gray-900">
                  <Diamond size={24} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" fill="currentColor" />
                  <span className="tracking-tighter">{gems.toLocaleString()}</span>
                </div>
              </motion.div>


              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="glass-morphism p-6 rounded-[2rem] border-red-600/30 shadow-[0_0_50px_rgba(220,38,38,0.15)] w-56 relative group"
              >
                <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-2 text-center">POUNDS BALANCE</div>
                <div className="text-3xl font-black flex items-center justify-center space-x-3 text-gray-900">
                  <Coins size={24} className="text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" fill="currentColor" />
                  <span className="tracking-tighter">{pounds.toLocaleString()}</span>
                </div>
              </motion.div>
              
              <div className="flex flex-col space-y-2">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/40 backdrop-blur-md p-4 rounded-[1.5rem] border border-green-500/10 w-56 text-center"
                >
                  <div className="text-[9px] font-black text-gray-900/40 uppercase tracking-[0.2em] mb-1">PACK COST</div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Diamond size={14} className="text-green-500" fill="currentColor" />
                      <span className="text-sm font-black text-gray-900">1,000</span>
                    </div>
                    <div className="text-gray-900/20 font-bold">OR</div>
                    <div className="flex items-center space-x-1">
                      <Coins size={14} className="text-red-500" fill="currentColor" />
                      <span className="text-sm font-black text-gray-900">50K</span>
                    </div>
                  </div>
                </motion.div>
              </div>


              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-green-500/5 backdrop-blur-md p-6 rounded-[2rem] border border-green-500/20 w-56 text-center group hover:bg-green-500/10 transition-colors"
              >
                <div className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-2">PROGRESS</div>
                <div className="text-3xl font-black text-gray-900 tracking-tighter">{packsOpened} <span className="text-sm text-gray-900/40 font-bold">/ 100</span></div>
                <div className="mt-3 h-1.5 w-full bg-gray-900/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (packsOpened / 100) * 100)}%` }}
                    className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  />
                </div>
              </motion.div>


              {/* Bulk Open Button */}
              <div className="flex flex-col space-y-3">
                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={gems >= 100000 ? { scale: 1.05, boxShadow: '0 0 30px rgba(34,197,94,0.5)' } : {}}
                  whileTap={gems >= 100000 ? { scale: 0.95 } : {}}
                  onClick={() => openPack(100, 'gems')}
                  disabled={isOpening || gems < 100000}
                  className="w-56 py-4 bg-gradient-to-r from-green-700 via-green-500 to-green-600 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] uppercase tracking-widest text-[10px] disabled:opacity-30 disabled:grayscale relative overflow-hidden group"
                >
                  <span className="relative z-10">{gems < 100000 ? 'NEED 100K GEMS' : 'OPEN 100 (GEMS)'}</span>
                </motion.button>


                <motion.button
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={pounds >= 5000000 ? { scale: 1.05, boxShadow: '0 0 30px rgba(220,38,38,0.5)' } : {}}
                  whileTap={pounds >= 5000000 ? { scale: 0.95 } : {}}
                  onClick={() => openPack(100, 'pounds')}
                  disabled={isOpening || pounds < 5000000}
                  className="w-56 py-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] uppercase tracking-widest text-[10px] disabled:opacity-30 disabled:grayscale relative overflow-hidden group"
                >
                  <span className="relative z-10">{pounds < 5000000 ? 'NEED 5M POUNDS' : 'OPEN 100 (POUNDS)'}</span>
                </motion.button>
              </div>
            </div>

            {/* Main Premium Badge - Portuguese Style */}
            <div className="flex flex-col space-y-4">
              <motion.div
                whileHover={gems >= 1000 ? { scale: 1.05, rotateY: 10 } : {}}
                whileTap={gems >= 1000 ? { scale: 0.95 } : {}}
                onClick={() => openPack(1, 'gems')}
                className={`w-72 h-[220px] bg-gradient-to-br from-green-600 via-white to-red-600 rounded-[2.5rem] cursor-pointer flex flex-col items-center justify-center border-4 border-white shadow-[0_0_60px_rgba(34,197,94,0.3)] relative overflow-hidden group ${gems < 1000 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
              >
                {/* Glowing Lines Decor */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Top: Gold Lines */}
                  <div className="absolute top-4 left-0 w-full flex flex-col space-y-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(34,197,94,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-full h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-full h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" />
                  </div>

                  {/* Bottom: Gold Lines */}
                  <div className="absolute bottom-4 left-0 w-full flex flex-col space-y-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-full h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-full h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(34,197,94,1)]" />
                  </div>
                </div>

                <div className="z-20 flex flex-col items-center space-y-2">
                  <div className="relative">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/FIFA_World_Cup_Trophy.svg/512px-FIFA_World_Cup_Trophy.svg.png" 
                      alt="World Cup" 
                      className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -top-2 -right-2 bg-[#001a2a] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-yellow-500/20">
                      2027
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">FC</span>
                    <h3 className="text-2xl font-black italic text-white tracking-tighter uppercase">GEMS PACK</h3>
                    <p className="font-black text-[10px] tracking-[0.2em] text-white/80 uppercase">1,000 GEMS</p>
                  </div>
                </div>

                {isOpening && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                    <div className="text-green-600 font-black text-xs animate-pulse italic uppercase tracking-widest">OPENING PACK...</div>
                  </div>
                )}
              </motion.div>

              <motion.div
                whileHover={pounds >= 50000 ? { scale: 1.05, rotateY: 10 } : {}}
                whileTap={pounds >= 50000 ? { scale: 0.95 } : {}}
                onClick={() => openPack(1, 'pounds')}
                className={`w-72 h-[220px] bg-gradient-to-br from-green-600 via-white to-red-600 rounded-[2.5rem] cursor-pointer flex flex-col items-center justify-center border-4 border-white shadow-[0_0_60px_rgba(220,38,38,0.3)] relative overflow-hidden group ${pounds < 50000 ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
              >
                {/* Glowing Lines Decor */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Top: 2 Blue + 1 Purple */}
                  <div className="absolute top-4 left-0 w-full flex flex-col space-y-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-full h-[2px] bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)]" />
                  </div>

                  {/* Bottom: 1 Purple + 2 Blue */}
                  <div className="absolute bottom-4 left-0 w-full flex flex-col space-y-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} className="w-full h-[2px] bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                  </div>
                </div>

                <div className="z-20 flex flex-col items-center space-y-2">
                  <div className="relative">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/FIFA_World_Cup_Trophy.svg/512px-FIFA_World_Cup_Trophy.svg.png" 
                      alt="World Cup" 
                      className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20">
                      2027
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">FC</span>
                    <h3 className="text-2xl font-black italic text-white tracking-tighter uppercase">POUNDS PACK</h3>
                    <p className="font-black text-[10px] tracking-[0.2em] text-white/80 uppercase">50,000 POUNDS</p>
                  </div>
                </div>
                {isOpening && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-red-600 rounded-full animate-spin" />
                    <div className="text-green-600 font-black text-xs animate-pulse italic uppercase tracking-widest">OPENING PACK...</div>
                  </div>
                )}
              </motion.div>

            </div>
          </div>
        </div>
        ) : revealedPlayer ? (
          <motion.div
            key="revealed"
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            className="flex flex-col items-center space-y-12 z-10"
          >
            {/* Stadium Reveal Lighting */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-white/20 to-transparent blur-[150px] rounded-full" 
              />
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="text-center relative z-10">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="inline-block px-6 py-2 bg-brand-yellow text-black font-black italic uppercase tracking-[0.3em] text-xs rounded-full mb-6 shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              >
                STADIUM REVEAL
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-7xl font-black italic uppercase tracking-tighter text-white mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                NEW LEGEND!
              </motion.h2>
              <p className="text-green-600 font-black uppercase tracking-[0.8em] text-sm opacity-60 italic">PORTUGUESE EDITION</p>
            </div>

            <div className="relative group">
              {/* Portuguese Split Explosion Effect Background */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.8, 1.4] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] flex overflow-hidden rounded-full blur-[100px] -z-10"
              >
                <div className="w-1/2 h-full bg-green-600/30" />
                <div className="w-1/2 h-full bg-red-600/30" />
              </motion.div>
              <motion.div
                animate={{ rotateY: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlayerCard player={revealedPlayer} size="lg" />
              </motion.div>
              
              {/* Camera Flash Effect */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-[-100px] bg-white z-50 pointer-events-none rounded-full blur-3xl"
              />
            </div>

            <motion.button
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.1, boxShadow: '0 0 50px rgba(234,179,8,0.4)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRevealedPlayer(null)}
              className="px-20 py-6 bg-gradient-to-r from-green-600 to-red-600 text-white font-black rounded-2xl transition-all uppercase tracking-[0.4em] italic text-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
            >
              COLLECT PLAYER
            </motion.button>

          </motion.div>
        ) : (
          <motion.div
            key="bulk-revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center space-y-8 z-10 w-full max-w-6xl"
          >
            <div className="text-center">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent">100 PACKS OPENED!</h2>
              <p className="text-white/40 font-bold uppercase tracking-widest mt-2">Check out your new rare players</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
              {bulkPlayers.map((player, idx) => (
                <motion.div
                  key={`${player.id}-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.01 }}
                >
                  <PlayerCard player={player} size="sm" />
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBulkPlayers([])}
              className="px-16 py-5 bg-gradient-to-r from-green-600 to-green-700 text-white font-black rounded-2xl transition-all uppercase tracking-[0.2em] italic text-lg shadow-lg"
            >
              ADD ALL TO BOX
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
