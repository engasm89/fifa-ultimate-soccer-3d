import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Calendar, Target, Play, CheckCircle2, Clock, Sparkles, Zap, Brain, Diamond, Coins } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: 'gems' | 'pounds';
  completed: boolean;
  progress: number;
  maxProgress: number;
}

interface RewardsHubProps {
  onEarn: (amount: number, type: 'gems' | 'pounds') => void;
  onPlayCoinGame: () => void;
  onPlayQuiz: () => void;
  onClose: () => void;
  packsOpened: number;
  gems: number;
  pounds: number;
}

export const RewardsHub: React.FC<RewardsHubProps> = ({ onEarn, onPlayCoinGame, onPlayQuiz, onClose, packsOpened, gems, pounds }) => {
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(localStorage.getItem('last_claim_date'));
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Pack Opener', 
      description: 'Open 5 packs in the store', 
      reward: 500, 
      rewardType: 'gems',
      completed: false, 
      progress: Math.min(packsOpened, 5), 
      maxProgress: 5 
    },
    { 
      id: '2', 
      title: 'Wealthy Player', 
      description: 'Accumulate 5,000 gems', 
      reward: 1000, 
      rewardType: 'pounds',
      completed: false, 
      progress: Math.min(gems, 5000), 
      maxProgress: 5000 
    },
    { 
      id: '3', 
      title: 'Daily Grinder', 
      description: 'Play the Coin Game once', 
      reward: 300, 
      rewardType: 'gems',
      completed: false, 
      progress: 0, 
      maxProgress: 1 
    }
  ]);

  useEffect(() => {
    const today = new Date().toDateString();
    setCanClaimDaily(lastClaimDate !== today);
  }, [lastClaimDate]);

  const handleClaimDaily = () => {
    const today = new Date().toDateString();
    localStorage.setItem('last_claim_date', today);
    setLastClaimDate(today);
    setCanClaimDaily(false);
    onEarn(1000, 'gems');
    onEarn(5000, 'pounds');
  };

  const handleClaimTask = (taskId: string, reward: number, type: 'gems' | 'pounds') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    onEarn(reward, type);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-red-600/10 to-transparent gap-4 sm:gap-0">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter">REWARDS HUB</h2>
              <p className="text-[8px] sm:text-[10px] text-red-500 font-black uppercase tracking-[0.4em]">EARN FREE GEMS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
          >
            <Zap size={20} className="text-white/40" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar">
          {/* Daily Reward Section */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="text-brand-yellow" size={20} />
              <h3 className="font-black italic uppercase tracking-widest text-sm">Daily Login Bonus</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-3xl border-2 transition-all ${canClaimDaily ? 'bg-brand-yellow/10 border-brand-yellow shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-white/5 border-white/10 opacity-60'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center">
                      <Gift className="text-brand-yellow" size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white/40 uppercase tracking-widest">TODAY'S GIFT</p>
                      <div className="flex flex-col">
                        <p className="text-xl font-black italic text-white flex items-center space-x-2">
                          <span>1,000</span>
                          <Diamond size={16} className="text-red-500" fill="currentColor" />
                        </p>
                        <p className="text-xl font-black italic text-white flex items-center space-x-2">
                          <span>5,000</span>
                          <Coins size={16} className="text-yellow-500" fill="currentColor" />
                        </p>
                      </div>
                    </div>
                  </div>
                  {canClaimDaily ? (
                    <button 
                      onClick={handleClaimDaily}
                      className="px-6 py-2 bg-brand-yellow text-black font-black rounded-full hover:scale-105 transition-all shadow-xl"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 text-white/40">
                      <CheckCircle2 size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">CLAIMED</span>
                    </div>
                  )}
                </div>
                {!canClaimDaily && (
                  <div className="flex items-center space-x-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                    <Clock size={12} />
                    <span>Next reward in 24 hours</span>
                  </div>
                )}
              </div>

              <div 
                onClick={onPlayCoinGame}
                className="p-6 rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer group shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">MINI GAME</p>
                    <p className="text-xl font-black italic text-white">COIN COLLECTOR</p>
                    <p className="text-[10px] text-white/40 font-medium">Play to earn unlimited gems!</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="text-black ml-1" size={24} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div 
                onClick={onPlayQuiz}
                className="p-6 rounded-3xl bg-brand-yellow/10 border-2 border-brand-yellow/30 hover:border-brand-yellow transition-all cursor-pointer group shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-brand-yellow uppercase tracking-widest">TRIVIA</p>
                    <p className="text-xl font-black italic text-white">FOOTBALL QUIZ</p>
                    <p className="text-[10px] text-white/40 font-medium">Test your knowledge for gems!</p>
                  </div>
                  <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="text-black" size={24} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Challenges Section */}
          <section className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="text-cyan-400" size={20} />
              <h3 className="font-black italic uppercase tracking-widest text-sm">Active Challenges</h3>
            </div>
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="glass-morphism p-5 rounded-3xl border-white/5 flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500/20' : 'bg-white/5'}`}>
                      {task.completed ? <CheckCircle2 className="text-green-500" size={24} /> : <Zap className="text-white/20" size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black italic text-white uppercase tracking-tighter">{task.title}</h4>
                      <p className="text-[10px] text-white/40 font-medium">{task.description}</p>
                      {/* Progress Bar */}
                      {!task.completed && (
                        <div className="mt-2 w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500" 
                            style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">REWARD</p>
                      <p className="font-black italic text-white flex items-center justify-end space-x-1">
                        <span>+{task.reward}</span>
                        {task.rewardType === 'gems' ? (
                          <Diamond size={12} className="text-red-500" fill="currentColor" />
                        ) : (
                          <Coins size={12} className="text-yellow-500" fill="currentColor" />
                        )}
                      </p>
                    </div>
                    {!task.completed && task.progress >= task.maxProgress && (
                      <button 
                        onClick={() => handleClaimTask(task.id, task.reward, task.rewardType)}
                        className="px-6 py-2 bg-cyan-500 text-black font-black rounded-full hover:scale-105 transition-all shadow-lg"
                      >
                        CLAIM
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/40 border-t border-white/5 text-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
            Come back every day for more rewards
          </p>
        </div>
      </motion.div>
    </div>
  );
};
