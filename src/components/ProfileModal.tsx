/**
 * Profile Modal Component
 * User profile management and social features
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Facebook, Share2, LogOut, Trophy, Star, Shield, User } from 'lucide-react';

interface UserProfile {
  name: string;
  facebook: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (name: string, facebook: string) => void;
  onLogout: () => void;
  totalPlayers: number;
  gems: number;
  pounds: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  totalPlayers,
  gems,
  pounds
}) => {
  const [isLoginMode, setIsLoginMode] = useState(!user);
  const [name, setName] = useState('');
  const [facebook, setFacebook] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      onLogin(name.trim(), facebook.trim());
      setIsLoginMode(false);
    }
  };

  const handleShare = () => {
    const gameUrl = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`;
    window.open(facebookShareUrl, '_blank');
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  {isLoginMode ? 'تسجيل الدخول' : 'الملف الشخصي'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isLoginMode ? 'أنشئ حسابك للبدء' : 'إدارة حسابك'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoginMode ? (
              /* Login Form */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">الاسم</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-2">فيسبوك (اختياري)</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="رابط فيسبوك"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={!name.trim()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                >
                  تسجيل الدخول
                </button>
              </div>
            ) : (
              /* Profile Content */
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4 bg-slate-800 rounded-xl p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                    <p className="text-slate-400 text-sm">
                      {user?.facebook ? (
                        <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400">
                          <Facebook className="w-4 h-4" />
                          متصل بفيسبوك
                        </a>
                      ) : (
                        'غير متصل بفيسبوك'
                      )}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800 rounded-lg p-3 text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-white">{totalPlayers}</div>
                    <div className="text-xs text-slate-400">لاعب</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 text-center">
                    <Star className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-white">{gems.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">جوهرة</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 text-center">
                    <Shield className="w-6 h-6 text-red-400 mx-auto mb-1" />
                    <div className="text-2xl font-black text-white">{(pounds / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-slate-400">عملة</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    مشاركة على فيسبوك
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    مشاركة الرابط
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold rounded-lg transition-colors border border-red-500/30"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800 text-center">
            <p className="text-xs text-slate-400">
              {isLoginMode ? 'سجل دخولك لحفظ تقدمك' : 'بياناتك محفوظة محلياً'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};