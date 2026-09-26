import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, Zap, Timer, CheckCircle2, XCircle, ArrowRight, Star } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  reward: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "من هو أعظم لاعب في تاريخ البرتغال؟",
    options: ["كريستيانو رونالدو", "إوزيبيو", "لويس فيغو", "باوليتا"],
    correctAnswer: 0,
    reward: 500
  },
  {
    id: 2,
    text: "من فاز بلقب يورو 2016؟",
    options: ["فرنسا", "البرتغال", "ألمانيا", "إسبانيا"],
    correctAnswer: 1,
    reward: 500
  },
  {
    id: 3,
    text: "في أي عام فازت البرتغال بدوري الأمم الأوروبية؟",
    options: ["2018", "2019", "2020", "2021"],
    correctAnswer: 1,
    reward: 500
  },
  {
    id: 4,
    text: "من هو الهداف التاريخي للمنتخب البرتغالي؟",
    options: ["إوزيبيو", "لويس فيغو", "كريستيانو رونالدو", "نونو غوميز"],
    correctAnswer: 2,
    reward: 500
  },
  {
    id: 5,
    text: "ما هو النادي البرتغالي الذي فاز بدوري أبطال أوروبا 2004؟",
    options: ["بنفيكا", "سبورتينغ لشبونة", "بورتو", "براغا"],
    correctAnswer: 2,
    reward: 800
  },
  {
    id: 6,
    text: "كم عدد الكرات الذهبية التي فاز بها كريستيانو رونالدو؟",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    reward: 600
  },
  {
    id: 7,
    text: "من هو المدرب البرتغالي الملقب بـ 'The Special One'؟",
    options: ["فرناندو سانتوس", "جوزيه مورينيو", "روبن أموريم", "خورخي جيسوس"],
    correctAnswer: 1,
    reward: 700
  },
  {
    id: 8,
    text: "أي لاعب برتغالي فاز بالكرة الذهبية عام 2000؟",
    options: ["رونالدو", "لويس فيغو", "ديكو", "روي كوستا"],
    correctAnswer: 1,
    reward: 1000
  }
];

interface QuizGameProps {
  onEarn: (amount: number, type: 'gems' | 'pounds') => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ onEarn }) => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && selectedOption === null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedOption === null) {
      handleOptionClick(-1); // Time out
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, selectedOption]);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTotalEarned(0);
    setTimeLeft(15);
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);
    const correct = index === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setTotalEarned(totalEarned + currentQuestion.reward);
      onEarn(currentQuestion.reward, 'gems');
      onEarn(currentQuestion.reward * 5, 'pounds');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeLeft(15);
    } else {
      setGameState('result');
    }
  };

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-cyan/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-yellow/10 blur-[100px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center z-10 space-y-8"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-brand-cyan to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-12">
              <Brain size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
                تحدي المعلومات
              </h1>
              <p className="text-white/60 max-w-md mx-auto text-lg">
                أجب على الأسئلة الكروية واكسب آلاف الجواهر لفتح الباكدجات الأسطورية!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-12 py-5 bg-brand-cyan text-black font-black rounded-2xl text-xl uppercase tracking-widest shadow-[0_10px_30px_rgba(34,211,238,0.3)]"
            >
              ابدأ التحدي الآن
            </motion.button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-2xl z-10"
          >
            {/* Header Info */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-white/40 text-[10px] font-bold uppercase block">السؤال</span>
                  <span className="text-white font-black">{currentQuestionIndex + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="bg-brand-yellow/10 px-4 py-2 rounded-xl border border-brand-yellow/20">
                  <span className="text-brand-yellow text-[10px] font-bold uppercase block">المكافآت</span>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-1">
                      <Zap size={12} className="text-brand-yellow fill-brand-yellow" />
                      <span className="text-brand-yellow font-black">{totalEarned}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-yellow-500 font-black">{totalEarned * 5}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${timeLeft < 5 ? 'bg-red-500/20 border-red-500/50 text-red-500' : 'bg-white/5 border-white/10 text-white'}`}>
                <Timer size={20} />
                <span className="font-mono font-black text-xl">{timeLeft}s</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-8 leading-tight">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, index) => {
                  let statusClass = "bg-white/5 border-white/10 text-white hover:bg-white/10";
                  if (selectedOption !== null) {
                    if (index === currentQuestion.correctAnswer) {
                      statusClass = "bg-green-500/20 border-green-500 text-green-500";
                    } else if (index === selectedOption) {
                      statusClass = "bg-red-500/20 border-red-500 text-red-500";
                    } else {
                      statusClass = "bg-white/5 border-white/5 text-white/20";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={selectedOption === null ? { x: 10 } : {}}
                      onClick={() => handleOptionClick(index)}
                      disabled={selectedOption !== null}
                      className={`w-full p-5 rounded-2xl border-2 text-right font-bold text-lg transition-all flex items-center justify-between ${statusClass}`}
                    >
                      <div className="flex items-center space-x-4">
                        {selectedOption !== null && index === currentQuestion.correctAnswer && <CheckCircle2 size={24} />}
                        {selectedOption !== null && index === selectedOption && index !== currentQuestion.correctAnswer && <XCircle size={24} />}
                        <span>{option}</span>
                      </div>
                      <span className="text-white/20 font-black text-sm italic">0{index + 1}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Next Button */}
            <AnimatePresence>
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className={`mb-4 font-black uppercase tracking-[0.2em] text-sm ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {isCorrect ? `إجابة صحيحة! +${currentQuestion.reward} جوهرة و +${currentQuestion.reward * 5} جنيه` : 'إجابة خاطئة! حاول في السؤال القادم'}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center space-x-3 px-10 py-4 bg-white text-black font-black rounded-xl uppercase tracking-widest text-sm shadow-xl"
                  >
                    <span>{currentQuestionIndex === QUESTIONS.length - 1 ? 'عرض النتائج' : 'السؤال التالي'}</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10 space-y-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-brand-yellow rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                <Trophy size={64} className="text-black" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-20px] border-2 border-dashed border-brand-yellow/30 rounded-full"
              />
            </div>

            <div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">انتهى التحدي!</h2>
              <p className="text-white/40 font-bold uppercase tracking-widest">لقد أثبت أنك خبير كروي</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <span className="text-white/40 text-[10px] font-black uppercase block mb-1">الإجابات</span>
                <span className="text-3xl font-black text-white">{score} / {QUESTIONS.length}</span>
              </div>
              <div className="bg-brand-yellow/10 p-6 rounded-3xl border border-brand-yellow/20">
                <span className="text-brand-yellow text-[10px] font-black uppercase block mb-1">إجمالي المكافآت</span>
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap size={20} className="text-brand-yellow fill-brand-yellow" />
                    <span className="text-3xl font-black text-brand-yellow">{totalEarned}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-black text-yellow-500">{totalEarned * 5}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="px-12 py-5 bg-white text-black font-black rounded-2xl text-lg uppercase tracking-widest shadow-xl"
              >
                العب مرة أخرى
              </motion.button>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">تمت إضافة الجواهر إلى رصيدك</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
