import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, User, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (name: string, facebook: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [facebook, setFacebook] = useState('');
  const [error, setError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState<'initial' | 'connecting' | 'form'>('initial');

  const handleFacebookClick = () => {
    setIsConnecting(true);
    setStep('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setStep('form');
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسمك لتأكيد الحساب');
      return;
    }
    onLogin(name, facebook || 'FACEBOOK_CONNECTED');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0c] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Split */}
      <div className="absolute inset-0 flex opacity-20">
        <div className="flex-1 bg-green-600" />
        <div className="flex-1 bg-red-600" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md glass-morphism p-10 rounded-[3rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,1)] relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border-2 border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 flex opacity-40">
                <div className="flex-1 bg-green-600" />
                <div className="flex-1 bg-red-600" />
              </div>
              <Trophy size={40} className="text-white relative z-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter flex italic">
                <span className="text-green-500">FC</span>
                <span className="text-red-600 ml-2 border-l-2 border-white/20 pl-2">27</span>
              </h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black mt-2">CHAMPIONS SIMULATOR</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'initial' && (
              <motion.div 
                key="initial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">ابدأ مسيرتك الآن</h2>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">سجل دخولك مرة واحدة فقط للبدء</p>
                </div>

                <button
                  onClick={handleFacebookClick}
                  className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-4 uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(24,119,242,0.3)] transition-all active:scale-95"
                >
                  <Facebook size={24} fill="currentColor" />
                  <span>تسجيل الدخول عبر FACEBOOK</span>
                </button>
                
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
                  سيتم حفظ حسابك تلقائياً ولن تحتاج للتسجيل مرة أخرى
                </p>
              </motion.div>
            )}

            {step === 'connecting' && (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center space-y-6 py-10"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-[#1877F2]/20 border-t-[#1877F2] rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Facebook size={24} className="text-[#1877F2]" fill="currentColor" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-black italic uppercase tracking-widest animate-pulse">جاري الاتصال بـ FACEBOOK...</p>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">يرجى الانتظار لحظة</p>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-500 mb-2">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">تم الاتصال بنجاح</span>
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">أكد اسمك</h2>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">اكتب اسمك كما يظهر في الحساب</p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-green-500 transition-colors">
                      <User size={20} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="اكتب اسمك هنا"
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-black placeholder:text-white/10 focus:outline-none focus:border-green-500 focus:bg-white/10 transition-all uppercase tracking-widest text-sm"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-red-600 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-3 uppercase tracking-[0.3em] italic text-sm shadow-2xl transition-all hover:scale-105 active:scale-95"
                  >
                    <span>دخول الملعب</span>
                    <ArrowRight size={20} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
