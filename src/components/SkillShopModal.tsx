import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Diamond, Shield, WandSparkles, X, Zap } from 'lucide-react';

export interface OwnedSkill { id: string; name: string; description: string; icon: 'pace' | 'shot' | 'defense'; }

interface Props { isOpen: boolean; onClose: () => void; gems: number; ownedSkills: OwnedSkill[]; onBuy: (skill: OwnedSkill) => void; }

const skills: OwnedSkill[] = [
  { id: 'pace', name: 'انطلاقة سريعة', description: 'تحسين سرعة الانطلاق والتحرك بدون كرة.', icon: 'pace' },
  { id: 'shot', name: 'تسديدة دقيقة', description: 'تحسين دقة التسديد عند إنهاء الهجمة.', icon: 'shot' },
  { id: 'defense', name: 'افتكاك ذكي', description: 'تحسين توقيت الضغط وقطع التمريرات.', icon: 'defense' },
];

const Icon = ({ type }: { type: OwnedSkill['icon'] }) => type === 'pace' ? <Zap className="w-7 h-7 text-amber-300" /> : type === 'shot' ? <WandSparkles className="w-7 h-7 text-cyan-300" /> : <Shield className="w-7 h-7 text-emerald-300" />;

export const SkillShopModal: React.FC<Props> = ({ isOpen, onClose, gems, ownedSkills, onBuy }) => {
  if (!isOpen) return null;
  return <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
    <motion.section initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={event => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/40 bg-slate-900 shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-700 bg-slate-800 p-4"><div><h2 className="font-black text-white">متجر المهارات</h2><p className="text-sm text-slate-400">كل مهارة بسعر ثابت: 100 جوهرة</p></div><button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-700"><X className="w-5 h-5 text-slate-300" /></button></header>
      <div className="flex items-center justify-center gap-2 border-b border-slate-700 bg-blue-950/30 p-3"><Diamond className="w-5 h-5 fill-blue-400 text-blue-400" /><span className="font-black text-white">{gems.toLocaleString()} جوهرة</span></div>
      <div className="grid gap-4 p-5 md:grid-cols-3">{skills.map(skill => { const owned = ownedSkills.some(item => item.id === skill.id); const canBuy = gems >= 100 && !owned; return <article key={skill.id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700"><Icon type={skill.icon} /></div><h3 className="font-black text-white">{skill.name}</h3><p className="mt-2 min-h-12 text-xs leading-5 text-slate-400">{skill.description}</p><button disabled={!canBuy} onClick={() => onBuy(skill)} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-black ${owned ? 'bg-emerald-600/30 text-emerald-200' : canBuy ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'cursor-not-allowed bg-slate-700 text-slate-500'}`}>{owned ? <><Check className="w-4 h-4" />مملوكة</> : <><Diamond className="w-4 h-4" />100 جوهرة</>}</button></article>; })}</div>
    </motion.section>
  </motion.div></AnimatePresence>;
};
