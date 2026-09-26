import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, X, Target } from 'lucide-react';

interface TrainingModeProps {
  onFinish: (gems: number, pounds: number) => void;
  onClose: () => void;
}

import { FootballField } from './FootballField';

export const TrainingMode: React.FC<TrainingModeProps> = ({ onFinish, onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    const spawn = setInterval(() => {
      setTargets(prev => [
        ...prev,
        { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 }
      ]);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(spawn);
    };
  }, [timeLeft]);

  const hitTarget = (id: number) => {
    setScore(prev => prev + 1);
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#1a1a1e] rounded-[3rem] border-4 border-white/10 overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30">
          <div className="bg-brand-cyan px-6 py-3 rounded-2xl font-black italic text-2xl text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]">SCORE: {score}</div>
          <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
            <Timer size={24} className="text-brand-yellow" />
            <span className="font-mono font-bold text-2xl text-white">{timeLeft}s</span>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-xl border border-white/10">
            <X size={28} className="text-white" />
          </button>
        </div>

        {/* Training Ground */}
        <FootballField className="w-full h-full">
          <AnimatePresence>
            {targets.map(target => (
              <motion.button
                key={target.id}
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => hitTarget(target.id)}
                className="absolute w-20 h-20 -ml-10 -mt-10 flex items-center justify-center z-20"
                style={{ left: `${target.x}%`, top: `${target.y}%` }}
              >
                <div className="w-full h-full bg-red-600 rounded-full border-4 border-white shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full border-4 border-red-600 flex items-center justify-center">
                    <Target size={20} className="text-red-600" />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </FootballField>

        {/* Game Over Screen */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="relative mb-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/FIFA_World_Cup_Trophy.svg/512px-FIFA_World_Cup_Trophy.svg.png" 
                  alt="World Cup" 
                  className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border-2 border-white/20">
                  2027
                </div>
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">TRAINING COMPLETE</h2>
              <p className="text-white/60 mb-8 font-bold uppercase tracking-widest">TARGETS HIT: {score}</p>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                <div className="text-sm text-white/40 uppercase font-black mb-1">REWARD</div>
                <div className="flex flex-col space-y-2">
                  <div className="text-3xl font-black text-cyan-400 flex items-center justify-center space-x-2">
                    <span>💎</span>
                    <span>200 GEMS</span>
                  </div>
                  <div className="text-3xl font-black text-yellow-500 flex items-center justify-center space-x-2">
                    <span>🪙</span>
                    <span>1,000 POUNDS</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onFinish(200, 1000)}
                className="px-12 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-full transition-all shadow-2xl uppercase tracking-widest"
              >
                COLLECT REWARDS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
