import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Diamond, PartyPopper, Sparkles, Trophy, X } from 'lucide-react';

export type CelebrationId = 'classic' | 'siu' | 'dance' | 'slide';

export interface OwnedCelebration {
  id: CelebrationId;
  name: string;
  description: string;
}

const celebrations: OwnedCelebration[] = [
  { id: 'siu', name: 'قفزة البطل', description: 'قفزة وفرحة قوية بعد هز الشباك.' },
  { id: 'dance', name: 'رقصة الفوز', description: 'احتفال مرح وخفيف مناسب للصغار.' },
  { id: 'slide', name: 'انزلاق النجوم', description: 'انزلاق احتفالي آمن على العشب.' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gems: number;
  ownedCelebrations: OwnedCelebration[];
  selectedCelebration: CelebrationId;
  onBuy: (celebration: OwnedCelebration) => void;
  onSelect: (id: CelebrationId) => void;
}

export const CelebrationShopModal: React.FC<Props> = ({ isOpen, onClose, gems, ownedCelebrations, selectedCelebration, onBuy, onSelect }) => {
  if (!isOpen) return null;
  const isOwned = (id: CelebrationId) => id === 'classic' || ownedCelebrations.some(item => item.id === id);

  return <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
    <motion.section initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={event => event.stopPropagation()} className="w-full max-w-3xl overflow-hidden rounded-2xl border border-fuchsia-400/40 bg-slate-900 shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 p-4"><div><h2 className="font-black text-white">متجر الاحتفالات</h2><p className="text-sm text-slate-400">اشترِ احتفالًا ثم اختره ليؤديه لاعبك بعد الهدف.</p></div><button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-700"><X className="w-5 h-5 text-slate-300" /></button></header>
      <div className="flex items-center justify-center gap-2 border-b border-slate-700 bg-fuchsia-950/30 p-3"><Diamond className="w-5 h-5 fill-blue-400 text-blue-400" /><span className="font-black text-white">{gems.toLocaleString()} جوهرة</span><span className="text-xs text-slate-400">• السعر 100 جوهرة</span></div>
      <div className="grid gap-4 p-5 md:grid-cols-3">{celebrations.map((celebration, index) => {
        const owned = isOwned(celebration.id); const selected = selectedCelebration === celebration.id; const canBuy = gems >= 100 && !owned;
        const Icon = index === 0 ? Trophy : index === 1 ? PartyPopper : Sparkles;
        return <article key={celebration.id} className={`rounded-xl border p-4 text-center ${selected ? 'border-fuchsia-400 bg-fuchsia-500/10' : 'border-slate-700 bg-slate-800/70'}`}><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700"><Icon className="h-7 w-7 text-fuchsia-300" /></div><h3 className="font-black text-white">{celebration.name}</h3><p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">{celebration.description}</p>{owned ? <button onClick={() => onSelect(celebration.id)} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-black ${selected ? 'bg-fuchsia-600 text-white' : 'bg-emerald-600/30 text-emerald-100 hover:bg-emerald-600/45'}`}>{selected ? <><Check className="h-4 w-4" />مُختار</> : 'اختيار الاحتفال'}</button> : <button disabled={!canBuy} onClick={() => onBuy(celebration)} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-black ${canBuy ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500' : 'cursor-not-allowed bg-slate-700 text-slate-500'}`}><Diamond className="h-4 w-4" />100 جوهرة</button>}</article>;
      })}</div>
    </motion.section>
  </motion.div></AnimatePresence>;
};
