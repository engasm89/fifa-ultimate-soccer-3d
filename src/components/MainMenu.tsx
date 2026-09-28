/**
 * Main Menu Component
 * Unified navigation system for the integrated game
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Users, Package, Target, ShoppingBag, Settings, HelpCircle, Play, User, WandSparkles, PartyPopper } from 'lucide-react';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCollection: () => void;
  onOpenSquad: () => void;
  onOpenPacks: () => void;
  onOpenTraining: () => void;
  onOpenStore: () => void;
  onOpenSkills?: () => void;
  onOpenCelebrations?: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenProfile: () => void;
  onResumeGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  isOpen,
  onClose,
  onOpenCollection,
  onOpenSquad,
  onOpenPacks,
  onOpenTraining,
  onOpenStore,
  onOpenSkills,
  onOpenCelebrations,
  onOpenSettings,
  onOpenHelp,
  onOpenProfile,
  onResumeGame
}) => {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: <Play className="w-6 h-6" />,
      label: 'متابعة المباراة',
      description: 'العودة إلى الملعب ثلاثي الأبعاد',
      action: onResumeGame,
      color: 'from-green-500 to-emerald-600',
      primary: true
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'مجموعة اللاعبين',
      description: 'عرض وإدارة بطاقات اللاعبين',
      action: onOpenCollection,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'التشكيلة',
      description: 'اختيار الفريق للمباراة',
      action: onOpenSquad,
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Package className="w-6 h-6" />,
      label: 'الباكات',
      description: 'افتح باكات للحصول على بطاقات لاعبين',
      action: onOpenPacks,
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'التدريب',
      description: 'تدريب على التسديد وكسب الجوائز',
      action: onOpenTraining,
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'المتجر',
      description: 'شراء الجواهر والعملات',
      action: onOpenStore,
      color: 'from-green-500 to-teal-600'
    },
    ...(onOpenSkills ? [{ icon: <WandSparkles className="w-6 h-6" />, label: 'متجر المهارات', description: 'اشترِ المهارات بـ100 جوهرة', action: onOpenSkills, color: 'from-cyan-500 to-blue-600' }] : []),
    ...(onOpenCelebrations ? [{ icon: <PartyPopper className="w-6 h-6" />, label: 'متجر الاحتفالات', description: 'اختر احتفال لاعبك بعد الهدف', action: onOpenCelebrations, color: 'from-fuchsia-500 to-pink-600' }] : []),
    {
      icon: <Settings className="w-6 h-6" />,
      label: 'الإعدادات',
      description: 'تخصيص إعدادات اللعبة',
      action: onOpenSettings,
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      label: 'المساعدة',
      description: 'تعليمات التحكم والدعم',
      action: onOpenHelp,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: <User className="w-6 h-6" />,
      label: 'الملف الشخصي',
      description: 'إدارة حسابك وإعداداتك',
      action: onOpenProfile,
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">FIFA Ultimate Soccer 3D</h2>
                <p className="text-slate-400">القائمة الرئيسية</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    item.primary
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/50 hover:from-green-500/30 hover:to-emerald-600/30'
                      : `bg-gradient-to-br ${item.color}/20 border-white/10 hover:from-white/10 hover:to-white/5`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${item.primary ? 'bg-green-500' : 'bg-white/10'}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-bold">{item.label}</h3>
                      <p className="text-slate-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  {item.primary && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800">
            <p className="text-center text-xs text-slate-400">
              FIFA Ultimate Soccer 3D • الإصدار 1.0.0
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
