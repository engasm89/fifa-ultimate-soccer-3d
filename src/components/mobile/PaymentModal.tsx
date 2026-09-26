import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Landmark, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, type: 'gems' | 'pounds') => void;
  item: {
    name: string;
    price: string;
    amount: number;
    type: 'gems' | 'pounds';
  } | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, item }) => {
  const [step, setStep] = useState<'method' | 'verifying' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank'>('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const handlePayment = () => {
    setError(null);
    if (selectedMethod === 'card') {
      const isNumberValid = cardDetails.number.replace(/\s/g, '').length === 16;
      const isExpiryValid = /^\d{2}\/\d{2}$/.test(cardDetails.expiry);
      const isCvvValid = cardDetails.cvv.length === 3;

      if (!isNumberValid) {
        setError('رقم البطاقة غير مكتمل (يجب أن يكون 16 رقماً)');
        return;
      }
      if (!isExpiryValid) {
        setError('تاريخ الانتهاء غير صحيح (MM/YY)');
        return;
      }
      if (!isCvvValid) {
        setError('رمز CVV غير صحيح (3 أرقام)');
        return;
      }
      
      setStep('verifying');
      setTimeout(() => {
        setStep('processing');
        setTimeout(() => {
          setStep('success');
          onSuccess(item.amount, item.type);
        }, 2000);
      }, 2000);
    } else {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        onSuccess(item.amount, item.type);
      }, 3000);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return value;
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep('method');
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#1a1a1e] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-4 sm:p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter">SECURE CHECKOUT</h2>
                <p className="text-white/40 text-[8px] sm:text-xs font-bold uppercase tracking-widest">Transaction ID: #FC-{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <button onClick={resetAndClose} className="p-1 sm:p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="sm:size-6 text-white/40" />
              </button>
            </div>

            <div className="p-4 sm:p-8">
              {step === 'method' && (
                <div className="space-y-6 sm:space-y-8">
                  {/* Item Summary */}
                  <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-yellow/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={20} className="sm:size-6 text-brand-yellow" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-black italic uppercase">{item.name}</p>
                        <p className="text-[8px] sm:text-xs text-white/40 font-bold uppercase tracking-widest">Digital Content</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-black text-brand-yellow italic">{item.price}</p>
                    </div>
                  </div>
 
                  {/* Methods */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setSelectedMethod('card')}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 sm:space-y-3 ${
                        selectedMethod === 'card' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className={`size-6 sm:size-8 ${selectedMethod === 'card' ? 'text-brand-cyan' : 'text-white/40'}`} />
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Credit Card</span>
                    </button>
                    <button
                      onClick={() => setSelectedMethod('bank')}
                      className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 sm:space-y-3 ${
                        selectedMethod === 'bank' ? 'border-brand-cyan bg-brand-cyan/10' : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Landmark className={`size-6 sm:size-8 ${selectedMethod === 'bank' ? 'text-brand-cyan' : 'text-white/40'}`} />
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Bank Transfer</span>
                    </button>
                  </div>

                  {/* Form Simulation */}
                  <div className="space-y-4">
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-xs font-bold text-center"
                      >
                        {error}
                      </motion.div>
                    )}
                    {selectedMethod === 'card' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">رقم الفيزا (CARD NUMBER)</label>
                          <div className="relative">
                            <input 
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                              className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white text-sm font-mono focus:border-brand-cyan focus:outline-none transition-colors"
                              maxLength={19}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <CreditCard size={20} className="text-white/20" />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">تاريخ الانتهاء (EXPIRY)</label>
                            <input 
                              type="text"
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white text-sm font-mono focus:border-brand-cyan focus:outline-none transition-colors"
                              maxLength={5}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">CVV</label>
                            <input 
                              type="password"
                              placeholder="***"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                              className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 text-white text-sm font-mono focus:border-brand-cyan focus:outline-none transition-colors"
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Bank Details</label>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-white/20 text-sm font-mono italic">
                          IBAN: GB82 0000 0000 1234 5678 90
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePayment}
                    className="w-full py-5 bg-brand-cyan text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] italic text-lg shadow-[0_20px_40px_rgba(34,211,238,0.3)] flex items-center justify-center space-x-3"
                  >
                    <span>PAY {item.price}</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 'verifying' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-8">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CreditCard size={32} className="text-yellow-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">VERIFYING CARD</h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Checking Visa details...</p>
                  </div>
                </div>
              )}

              {step === 'processing' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-8">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck size={32} className="text-brand-cyan animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">PROCESSING</h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Securing your transaction...</p>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                  >
                    <CheckCircle2 size={48} className="text-green-500" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-green-500">PAYMENT SUCCESS</h3>
                    <p className="text-white/60 font-medium">Your account has been credited with {item.amount.toLocaleString()} {item.type.toUpperCase()}.</p>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="px-12 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all uppercase tracking-widest italic"
                  >
                    CONTINUE
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                <ShieldCheck size={14} />
                <span>SSL SECURED</span>
              </div>
              <div className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                PCI COMPLIANT
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
