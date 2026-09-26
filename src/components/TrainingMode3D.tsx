/**
 * 3D Training Mode Component
 * Simplified training mini-game integrated with 3D game system
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Trophy, Zap, Play, RotateCcw } from 'lucide-react';

interface TrainingMode3DProps {
  isOpen: boolean;
  onClose: () => void;
  onFinish: (earnedGems: number, earnedPounds: number) => void;
}

export const TrainingMode3D: React.FC<TrainingMode3DProps> = ({
  isOpen,
  onClose,
  onFinish
}) => {
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; hit: boolean }>>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      endGame();
    }
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isActive && targets.length < 3) {
      const timer = setTimeout(() => {
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80 + 10, // 10-90%
          y: Math.random() * 60 + 20, // 20-80%
          hit: false
        };
        setTargets(prev => [...prev, newTarget]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, targets]);

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setGameOver(false);
  };

  const endGame = () => {
    setIsActive(false);
    setGameOver(true);
    
    // Calculate rewards
    const earnedGems = score * 5;
    const earnedPounds = score * 100;
    onFinish(earnedGems, earnedPounds);
  };

  const handleTargetClick = (targetId: number) => {
    if (!isActive) return;
    
    setTargets(prev => prev.map(t => 
      t.id === targetId ? { ...t, hit: true } : t
    ));
    setScore(prev => prev + 1);
    
    // Remove hit target after animation
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== targetId));
    }, 300);
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
          className="relative w-full max-w-2xl max-h-[80vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">وضع التدريب</h2>
                <p className="text-sm text-slate-400">تدريب على التسديد وكسب الجوائز</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Game Area */}
          <div className="relative h-[400px] bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
            {/* Stats Bar */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold">{score} نقطة</span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-white font-bold">{timeLeft} ثانية</span>
              </div>
            </div>

            {/* Game Content */}
            {!isActive && !gameOver ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Target className="w-24 h-24 text-green-400 mb-6" />
                <h3 className="text-2xl font-black text-white mb-4">تدريب التسديد</h3>
                <p className="text-slate-400 mb-6 text-center px-8">
                  انقر على الأهداف الظاهرة لكسب النقاط خلال 30 ثانية
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
                >
                  <Play className="w-5 h-5" />
                  بدء التدريب
                </button>
              </div>
            ) : gameOver ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">انتهى التدريب!</h3>
                <p className="text-3xl font-black text-green-400 mb-2">{score} نقطة</p>
                <p className="text-slate-400 mb-6">
                  كسبت {score * 5} جوهرة و {score * 100} عملة
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    إعادة المحاولة
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {targets.map(target => (
                  <motion.button
                    key={target.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: target.hit ? 1.5 : 1, opacity: target.hit ? 0 : 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => handleTargetClick(target.id)}
                    disabled={target.hit}
                    className="absolute w-16 h-16 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:bg-red-400 transition-colors"
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Target className="w-8 h-8 text-white" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 text-center">
            <p className="text-xs text-slate-400">
              كل نقطة = 5 جواهر + 100 عملة • حاول الحصول على أعلى نتيجة!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};