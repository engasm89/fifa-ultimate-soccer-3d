/**
 * Store Modal Component
 * In-game store for purchasing gems and pounds
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Diamond, Coins, ShoppingBag, CreditCard, Check } from 'lucide-react';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  pounds: number;
  onPurchase: (item: { name: string; price: string; amount: number; type: 'gems' | 'pounds' }) => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  gems,
  pounds,
  onPurchase
}) => {
  const [selectedItem, setSelectedItem] = useState<{ name: string; price: string; amount: number; type: 'gems' | 'pounds' } | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const gemPackages = [
    { name: 'حزمة الجواهر الصغيرة', amount: 500, price: '$0.99' },
    { name: 'حزمة الجواهر المتوسطة', amount: 1200, price: '$2.99' },
    { name: 'حزمة الجواهر الكبيرة', amount: 2500, price: '$4.99' },
    { name: 'حزمة الجواهر الضخمة', amount: 6500, price: '$9.99' },
    { name: 'حزمة الجواهر الأسطورية', amount: 15000, price: '$19.99' },
  ];

  const poundPackages = [
    { name: 'حزمة العملات الصغيرة', amount: 50000, price: '$0.99' },
    { name: 'حزمة العملات المتوسطة', amount: 150000, price: '$2.99' },
    { name: 'حزمة العملات الكبيرة', amount: 350000, price: '$4.99' },
    { name: 'حزمة العملات الضخمة', amount: 1000000, price: '$9.99' },
  ];

  const handlePurchase = (item: typeof gemPackages[0], type: 'gems' | 'pounds') => {
    setSelectedItem({ ...item, type });
    setShowPayment(true);
  };

  const handlePaymentConfirm = () => {
    if (selectedItem) {
      onPurchase(selectedItem);
      setShowPayment(false);
      setSelectedItem(null);
    }
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
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">المتجر</h2>
                <p className="text-sm text-slate-400">اشترِ الجواهر والعملات</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Current Balance */}
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

          {/* Store Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {!showPayment ? (
              <div className="space-y-8">
                {/* Gems Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Diamond className="w-5 h-5 text-blue-400 fill-blue-400" />
                    حزم الجواهر
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {gemPackages.map((pkg) => (
                      <motion.button
                        key={pkg.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePurchase(pkg, 'gems')}
                        className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 border border-blue-500/40 rounded-xl p-4 transition-all"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Diamond className="w-8 h-8 text-blue-400 fill-blue-400" />
                          <span className="text-white font-bold text-lg">{pkg.amount.toLocaleString()}</span>
                          <span className="text-blue-300 text-sm">{pkg.name}</span>
                          <span className="text-white font-black bg-blue-600 px-3 py-1 rounded-full">{pkg.price}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pounds Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-red-400 fill-red-400" />
                    حزم العملات
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {poundPackages.map((pkg) => (
                      <motion.button
                        key={pkg.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePurchase(pkg, 'pounds')}
                        className="bg-gradient-to-br from-red-600/20 to-orange-600/20 hover:from-red-600/40 hover:to-orange-600/40 border border-red-500/40 rounded-xl p-4 transition-all"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Coins className="w-8 h-8 text-red-400 fill-red-400" />
                          <span className="text-white font-bold text-lg">{pkg.amount.toLocaleString()}</span>
                          <span className="text-red-300 text-sm">{pkg.name}</span>
                          <span className="text-white font-black bg-red-600 px-3 py-1 rounded-full">{pkg.price}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Payment Confirmation */
              <div className="flex flex-col items-center justify-center py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-slate-800 rounded-2xl p-8 border border-slate-700 max-w-md w-full"
                >
                  <div className="flex items-center justify-center mb-6">
                    <CreditCard className="w-16 h-16 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white text-center mb-4">تأكيد الشراء</h3>
                  
                  {selectedItem && (
                    <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">المنتج:</span>
                        <span className="text-white font-bold">{selectedItem.name}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400">الكمية:</span>
                        <span className="text-white font-bold">{selectedItem.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">السعر:</span>
                        <span className="text-green-400 font-black text-lg">{selectedItem.price}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handlePaymentConfirm}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      تأكيد الدفع
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 text-center">
            <p className="text-xs text-slate-400">
              جميع المعاملات آمنة ومشفرة • الأسعار بالدولار الأمريكي
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};