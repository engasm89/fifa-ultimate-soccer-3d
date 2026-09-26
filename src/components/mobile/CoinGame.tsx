import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X } from 'lucide-react';

interface CoinGameProps {
  onGameOver: (earnedGems: number, earnedPounds: number) => void;
  onClose: () => void;
}

export const CoinGame: React.FC<CoinGameProps> = ({ onGameOver, onClose }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState(50); // percentage
  const [items, setItems] = useState<{ id: number; x: number; y: number; type: 'gem' | 'bomb' }[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);

  // Handle movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPlayerPosition(prev => Math.max(0, prev - 5));
      if (e.key === 'ArrowRight') setPlayerPosition(prev => Math.min(100, prev + 5));
    };

    const handleTouch = (e: TouchEvent) => {
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
        setPlayerPosition(Math.min(100, Math.max(0, x)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    const spawnItem = () => {
      setItems(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 90 + 5,
          y: -10,
          type: Math.random() > 0.2 ? 'gem' : 'bomb'
        }
      ]);
    };

    const spawnInterval = setInterval(spawnItem, 600);
    const timerInterval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);

    const updateItems = () => {
      setItems(prev => {
        const next = prev.map(item => ({ ...item, y: item.y + 2 })).filter(item => item.y < 110);
        
        // Collision detection
        const caught = next.find(item => item.y > 80 && item.y < 95 && Math.abs(item.x - playerPosition) < 10);
        if (caught) {
          if (caught.type === 'gem') {
            setScore(s => s + 10);
          } else {
            setScore(s => Math.max(0, s - 20));
          }
          return next.filter(item => item.id !== caught.id);
        }
        return next;
      });
      requestRef.current = requestAnimationFrame(updateItems);
    };

    requestRef.current = requestAnimationFrame(updateItems);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timerInterval);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playerPosition]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score, score * 10);
    }
  }, [timeLeft, score, onGameOver]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div 
        ref={gameRef}
        className="relative w-full max-w-md aspect-[9/16] bg-gradient-to-b from-blue-900/20 to-cyan-900/20 rounded-3xl border-4 border-white/10 overflow-hidden shadow-2xl"
      >
        {/* UI Overlay */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
          <motion.div 
            animate={{ scale: score > 0 ? [1, 1.2, 1] : 1 }}
            className="flex flex-col items-center bg-black/60 backdrop-blur-md p-4 rounded-2xl border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">COLLECTED</div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xl">💎</span>
                <span className="text-2xl font-black text-white">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">🪙</span>
                <span className="text-2xl font-black text-white">{score * 10}</span>
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="text-2xl font-mono font-bold text-white/60 bg-black/40 px-4 py-1 rounded-full border border-white/10">
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors border border-white/10">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Pitch Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-px h-full bg-white" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
        </div>

        {/* Falling Items */}
        {items.map(item => (
          <motion.div
            key={item.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.type === 'gem' ? (
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)] border-2 border-cyan-300">
                <span className="text-black font-black text-xs">💎</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-red-400">
                <span className="text-white text-xs">💣</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Player Character */}
        <motion.div
          className="absolute bottom-10 w-20 h-24 -ml-10 flex flex-col items-center"
          animate={{ left: `${playerPosition}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="w-16 h-16 relative flex items-center justify-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/FIFA_World_Cup_Trophy.svg/512px-FIFA_World_Cup_Trophy.svg.png" 
              alt="World Cup" 
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -top-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20">
              2027
            </div>
          </div>
          <div className="mt-1 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-black rounded-full uppercase shadow-lg border border-white/20">
            CHAMPION
          </div>
        </motion.div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
          Move to collect gems! Avoid bombs!
        </div>
      </div>
    </div>
  );
};
