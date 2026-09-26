/**
 * Superstars Roster Modal
 * Choose between Kylian Mbappé, Cristiano Ronaldo, Erling Haaland, Neymar, and Lionel Messi
 * All in authentic 120 OVR UEFA Champions League Holographic Cards.
 */

import React, { useState } from 'react';
import { X, Star, Check, Zap, Flame, Shield, ArrowRight } from 'lucide-react';
import { SUPERSTARS, SuperstarProfile } from '../game/superstars';
import { UCLPlayerCard } from './UCLPlayerCard';

interface SuperstarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStar: SuperstarProfile;
  onSelectStar: (star: SuperstarProfile) => void;
}

export const SuperstarsModal: React.FC<SuperstarsModalProps> = ({
  isOpen,
  onClose,
  selectedStar,
  onSelectStar,
}) => {
  const [activeStar, setActiveStar] = useState<SuperstarProfile>(selectedStar);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectStar(activeStar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>أساطير دوري أبطال أوروبا بتقييم 120 OVR</span>
              </h2>
              <p className="text-xs text-slate-400">
                اختر نجم الهجوم لقيادة فريقك في الملعب الأسطوري بقدرات وخصائص لعب خاصة.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top: 5 Cards Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <span>اختر لاعبك (اضغط للمعاينة واللعب):</span>
            </h3>

            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-3 pt-1">
              {SUPERSTARS.map((star) => (
                <div key={star.id} className="shrink-0">
                  <UCLPlayerCard
                    player={star}
                    size="md"
                    isSelected={activeStar.id === star.id}
                    onSelect={() => setActiveStar(star)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Active Player Detailed Breakdown Card */}
          <div className="bg-slate-950/80 rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-5">
            <div className="shrink-0 hidden md:block">
              <UCLPlayerCard player={activeStar} size="md" isSelected={false} />
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-amber-300 font-chakra">{activeStar.nameEn}</span>
                    <span className="text-lg font-bold text-white font-sans">({activeStar.nameAr})</span>
                    <span className="text-lg">{activeStar.flag}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    المركز: {activeStar.position} | الرقم: #{activeStar.jerseyNumber} | النادي: {activeStar.club}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-chakra font-black text-3xl text-amber-400 leading-none">
                    {activeStar.rating}
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">UCL SPECIAL</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                {activeStar.traits.description}
              </p>

              {/* Special Gameplay Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">السرعة القصوى</span>
                  <span className="font-mono font-black text-sky-400 text-sm">
                    {Math.round(activeStar.traits.sprintSpeed * 3.6)} كم/س
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">قوة التسديد القصوى</span>
                  <span className="font-mono font-black text-red-400 text-sm">
                    {Math.round(activeStar.traits.maxShotPower * 3.6)} كم/س
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">انحناء الكيرف (Curve)</span>
                  <span className="font-mono font-black text-amber-400 text-sm">
                    {activeStar.traits.curveMultiplier > 2.0 ? 'خارق 🔥' : activeStar.traits.curveMultiplier > 1.5 ? 'قوي ⭐' : 'مباشر ⚡'}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">سلاسة الدوران</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    {activeStar.traits.turnSpeed >= 28 ? 'فوري 💫' : 'سلس ⚡'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleConfirm}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl transition-transform active:scale-95 cursor-pointer"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>اللعب بـ {activeStar.nameAr} الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
