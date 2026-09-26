/**
 * Help & Controls Guide Modal
 */

import React from 'react';
import { X, Gamepad2, Sparkles, Zap, Trophy, Eye } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 md:p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">دليل التحكم وميكانيكا اللعب</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          {/* Controls table */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <span>⌨️ لوحة المفاتيح والتحكم (Controls)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">تحرك شمال / يسار:</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">A / ← سهم يسار</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">تحرك يمين:</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">D / → سهم يمين</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">هجوم للأمام / تراجع:</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">W / S أو ↑ / ↓</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">سبرنت (سرعة نفاثة):</span>
                <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">Shift</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">شحن وتسديد الكرة:</span>
                <span className="font-mono font-bold text-red-400 bg-slate-800 px-2 py-0.5 rounded">مسافة (Space)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">💥 زحلقة الافتكاك (Slide Tackle):</span>
                <span className="font-mono font-bold text-orange-400 bg-slate-800 px-2 py-0.5 rounded">F أو E</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">تمرير لزميل الفريق (5v5):</span>
                <span className="font-mono font-bold text-teal-400 bg-slate-800 px-2 py-0.5 rounded">F (أثناء حيازة الكرة)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/80">
                <span className="text-slate-400">تبديل الكاميرا:</span>
                <span className="font-mono font-bold text-sky-400 bg-slate-800 px-2 py-0.5 rounded">C</span>
              </div>
            </div>
          </div>

          {/* Gameplay features */}
          <div className="space-y-2">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ميكانيكا اللعب والتكتيكات 5 ضد 5:</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400">
              <li>
                <strong className="text-amber-300">التحكم السلس يمين وشمال:</strong> يتحرك اللاعب بنعومة واستجابة فورية باتجاه حركة الشاشة سواء بالمفاتيح أو عصا الأنالوج أو أزرار الاتجاهات.
              </li>
              <li>
                <strong className="text-rose-400">مباراة 5 ضد 5 وتكتيك الهجوم الكاسح:</strong> فريقك يضم 5 لاعبين (أنت القائد، مهاجم، وسط، مدافع، وحارس مرمى) ضد 5 لاعبين للخصم مع تبديل سريع بين الهجوم الكاسح والدفاع المنظم.
              </li>
              <li>
                <strong className="text-orange-400">الفيزياء والسقوط على العشب (يقعون):</strong> اضغط زر الافتكاك F لتنفيذ زحلقة انزلاقية كاملة على العشب لقطع الكرة. إذا اصطدم اللاعب بمدافع بقوة يقع على الأرض وينهض سريعاً لمواصلة الهجمة!
              </li>
              <li>
                <strong className="text-yellow-300">⚽ كرة كأس العالم 2026 الرسمية (تريوندا - TRIONDA):</strong> تلعب بكرة كأس العالم 2026 الرسمية بنفس تصميمها الدقيق رباعي الألواح الانسيابي مع ألوان كندا والمكسيك وأمريكا وشعار الذهب وشريحة 500Hz، مع إمكانية التبديل إلى كرة النهائي الذهبية (Trionda Final) عبر زر "كأس العالم 2026" في الأعلى!
              </li>
              <li>
                <strong className="text-sky-300">نجوم دوري أبطال أوروبا بطاقات 120 OVR:</strong> العب بالأسطورة كيليان مبابي #9، أو بدّل بضغطة زر إلى كريستيانو رونالدو #7، إيرلينغ هالاند #9، ليونيل ميسي #10، أو نيمار جونيور #10 مع بطاقات هولوغرافية فاخرة وخصائص لعب فريدة!
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm cursor-pointer shadow-md"
            >
              فهمت، لنبدأ اللعب!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
