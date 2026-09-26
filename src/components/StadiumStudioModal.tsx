/**
 * Legendary Stadium Studio & Architecture Inspector Modal
 * Interactive panel allowing live tuning of:
 * 1. Cinematic Night Lighting (Intensity, Temperature, Volumetric Beams)
 * 2. High-Definition Pitch & Grass Surface (Roughness, Wetness)
 * 3. Physical Cloth Goal Net Tests (Top Corner Shot, Center Blast)
 * 4. Production-ready Shader Graph & C# Unity scripts with one-click copy
 */

import React, { useState } from 'react';
import { X, Sun, Sparkles, Sliders, Play, Copy, Check, Eye, Lightbulb, Shield, Code2, BookOpen, Zap, Orbit } from 'lucide-react';
import { LightingConfig } from '../game/SoccerCanvas';
import { CameraMode } from '../game/GameManager';
import { WorldCupBallEdition } from '../game/worldCupBall2026';

interface StadiumStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  lightingConfig: LightingConfig;
  onLightingChange: (config: LightingConfig) => void;
  onTriggerTestShot: (type: 'top_corner' | 'center') => void;
  onCameraChange: (mode: CameraMode) => void;
  ballEdition?: WorldCupBallEdition;
  onBallEditionChange?: (edition: WorldCupBallEdition) => void;
  onOpenBallModal?: () => void;
}

export const StadiumStudioModal: React.FC<StadiumStudioModalProps> = ({
  isOpen,
  onClose,
  lightingConfig,
  onLightingChange,
  onTriggerTestShot,
  onCameraChange,
  ballEdition = 'trionda_official',
  onBallEditionChange,
  onOpenBallModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'controls' | 'shader_code' | 'unity_cloth'>('controls');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const lightPresets = [
    { name: 'كشافات دافئة (Classic Stadium 3200K)', colorHex: 0xfef08a, badge: '💛 دافئ' },
    { name: 'أبيض ناصع (Daylight Xenon 5500K)', colorHex: 0xf8fafc, badge: '🤍 ناصع' },
    { name: 'أزرق جليدي (Ice Night Arena)', colorHex: 0x60a5fa, badge: '💙 جليدي' },
    { name: 'أحمر ذهبي (Sunset Derby)', colorHex: 0xf97316, badge: '🧡 ملحمي' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>استوديو هندسة الملعب الأسطوري (Stadium Architect Studio)</span>
              </h2>
              <p className="text-xs text-slate-400">
                تحكم مباشر في الإضاءة الليلية، تفاعلية الشباك الفيزيائية، وعشب الملعب، مع أكواد الشيدر الكاملة.
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800">
          <button
            onClick={() => setActiveSubTab('controls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'controls'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>لوحة الضبط والتحكم المباشر 3D</span>
          </button>

          <button
            onClick={() => setActiveSubTab('shader_code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'shader_code'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>كود شيدر العشب الواقعي (Grass HLSL)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('unity_cloth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'unity_cloth'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>إعداد فيزياء الشباك (Cloth Physics Net)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeSubTab === 'controls' && (
            <div className="space-y-6">
              {/* 1. Cinematic Night Lighting Controls */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>1. إعدادات الإضاءة الليلية السينمائية (Cinematic Night Lighting)</span>
                </h3>

                {/* Preset Color Buttons */}
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-2 block">
                    درجة حرارة ولون كشافات الملعب:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {lightPresets.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => onLightingChange({ ...lightingConfig, colorHex: p.colorHex })}
                        className={`p-2 rounded-lg text-xs font-bold border transition-all text-right flex items-center justify-between cursor-pointer ${
                          lightingConfig.colorHex === p.colorHex
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{p.name.split(' ')[0]}</span>
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">{p.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Intensity */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">سطوع وقوة الكشافات (High Intensity):</span>
                      <span className="font-mono text-amber-400 font-bold">{lightingConfig.intensity.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="6.5"
                      step="0.1"
                      value={lightingConfig.intensity}
                      onChange={(e) =>
                        onLightingChange({ ...lightingConfig, intensity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>إضاءة هادئة (1.0x)</span>
                      <span>قياسية (4.2x)</span>
                      <span className="text-amber-400 font-bold">فائقة القوة (6.5x)</span>
                    </div>
                  </div>

                  {/* Volumetric Beams Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-bold">كثافة الأشعة الحجمية (Volumetric Beams):</span>
                      <span className="font-mono text-sky-400 font-bold">
                        {Math.round(lightingConfig.volumetricOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="0.25"
                      step="0.01"
                      value={lightingConfig.volumetricOpacity}
                      onChange={(e) =>
                        onLightingChange({ ...lightingConfig, volumetricOpacity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>بدون أشعة</span>
                      <span>أشعة سينمائية (8%)</span>
                      <span className="text-sky-400 font-bold">ضبابي كثيف (25%)</span>
                    </div>
                  </div>
                </div>

                {/* Spotlight Flicker / Dynamic Pulse Controls */}
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>وميض ونبض أضواء الكشافات (Spotlight Flicker & Pulse)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        تعديل نبضات الكشافات الكهربائية وتذبذب الإضاءة الحجمية في الوقت الحقيقي.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onLightingChange({
                          ...lightingConfig,
                          flickerEnabled: !lightingConfig.flickerEnabled,
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        lightingConfig.flickerEnabled
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lightingConfig.flickerEnabled ? '⚡ الوميض مفعل' : 'مغلق (ثابت)'}
                    </button>
                  </div>

                  {lightingConfig.flickerEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">عمق التذبذب (Flicker Depth):</span>
                          <span className="font-mono text-amber-400">
                            {Math.round((lightingConfig.flickerDepth ?? 0.2) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.6"
                          step="0.05"
                          value={lightingConfig.flickerDepth ?? 0.2}
                          onChange={(e) =>
                            onLightingChange({ ...lightingConfig, flickerDepth: parseFloat(e.target.value) })
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">سرعة الوميض (Flicker Speed):</span>
                          <span className="font-mono text-amber-400">
                            {Math.round(lightingConfig.flickerSpeed ?? 12)} Hz
                          </span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="30"
                          step="2"
                          value={lightingConfig.flickerSpeed ?? 12}
                          onChange={(e) =>
                            onLightingChange({ ...lightingConfig, flickerSpeed: parseInt(e.target.value) })
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Realistic Grass & Surface Texture */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>2. عشب الملعب التفاعلي ونسبة الرطوبة (Grass Shader & Pitch Turf)</span>
                </h3>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">خشونة / رطوبة أرضية الملعب (Pitch Roughness & Wetness):</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {lightingConfig.pitchRoughness > 0.7
                        ? 'عشب جاف قياسي (Dry)'
                        : lightingConfig.pitchRoughness > 0.4
                        ? 'عشب مرشوش بالمياه (Damp / Sprinkled)'
                        : 'عشب مبلل بانعكاسات ليلية لامعة (Wet Pitch)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.25"
                    max="0.9"
                    step="0.05"
                    value={lightingConfig.pitchRoughness}
                    onChange={(e) =>
                      onLightingChange({ ...lightingConfig, pitchRoughness: parseFloat(e.target.value) })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">
                    عند تقليل الخشونة (Roughness)، تظهر انعكاسات أضواء الكشافات الليلية على قطرات الندى فوق العشب.
                  </p>
                </div>
              </div>

              {/* 3. Interactive Goal Net Physics Testing */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2 border-b border-slate-800/80 pb-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  <span>3. اختبار فيزياء شباك المرمى التفاعلية (Cloth Net Physics Inspector)</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  اضغط على أحد الأزرار التالية لإطلاق تسديدة فيزيائية مباشرة في شباك المرمى لمشاهدة انتفاخ الشباك،
                  امتصاص النوابض لطاقة الكرة، واهتزاز خيوط الشبكة في الوقت الحقيقي!
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      onCameraChange('behind_goal');
                      onTriggerTestShot('top_corner');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>تسديدة صاروخية في زاوية المقص (Top Corner 90°)</span>
                  </button>

                  <button
                    onClick={() => {
                      onCameraChange('behind_goal');
                      onTriggerTestShot('center');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>تسديدة قوية في قلب الشباك (Bulge Net Center)</span>
                  </button>

                  <button
                    onClick={() => onCameraChange('behind_goal')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>كاميرا خلف المرمى مباشرة</span>
                  </button>
                </div>
              </div>

              {/* 3. Official FIFA World Cup 2026 Ball Design */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <span className="text-base">⚽</span>
                    <span>3. كرة كأس العالم 2026 الرسمية: تريوندا (Adidas Trionda Ball)</span>
                  </h3>
                  {onOpenBallModal && (
                    <button
                      onClick={onOpenBallModal}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Orbit className="w-3.5 h-3.5" />
                      <span>معاينة ثلاثية الأبعاد 360°</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  الكرة الرسمية لكأس العالم 2026 بتصميمها الأصلي الدقيق: 4 ألواح هوائية حرارية تمثل كندا (🍁 أحمر)، المكسيك (🦅 زمردي)، وأمريكا (⭐ أزرق)، وخطوط الذهب الملكي مع خريطة نتوءات الميكرو الهوائية (Aero-Dimples).
                </p>

                {onBallEditionChange && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => onBallEditionChange('trionda_official')}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border-2 flex items-center justify-between ${
                        ballEdition === 'trionda_official'
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-chakra font-black text-sm block text-amber-300">TRIONDA الرسمية</span>
                        <span className="text-[11px] text-slate-400">أبيض لؤلؤي + ألوان الدول المستضيفة الثلاث والذهب</span>
                      </div>
                      {ballEdition === 'trionda_official' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>

                    <button
                      onClick={() => onBallEditionChange('trionda_final')}
                      className={`p-3 rounded-xl text-right transition-all cursor-pointer border-2 flex items-center justify-between ${
                        ballEdition === 'trionda_final'
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <span className="font-chakra font-black text-sm block text-yellow-400">TRIONDA FINAL الذهبية</span>
                        <span className="text-[11px] text-slate-400">أسود بركاني + أمواج ذهب 24K ولمسات وردية نارية</span>
                      </div>
                      {ballEdition === 'trionda_final' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'shader_code' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-300">
                <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>طريقة تركيب عشب الملعب الواقعي عالي الدقة (Grass Shader & Lines):</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  يجمع هذا الشيدر بين خطوط التقليم الدورية (Striped Mowing Effect)، طبقة تفاصيل العشب الدقيقة (Grass Micro-detail)،
                  خريطة التضاريس والنتوءات (Normal Bump Map)، والخطوط البيضاء الصريحة المحددة بدقة بكسل متناهية دون تشويش.
                </p>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="font-bold text-amber-300 font-sans">
                    RealisticPitchGrass.shader (Unity URP / HLSL Shader)
                  </span>
                  <button
                    onClick={() => handleCopy(grassHLSLCode, 'grass_hlsl')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'grass_hlsl' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-sans">نسخ الشيدر</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-[11px] text-slate-300 leading-relaxed font-mono-code max-h-96">
                  <code>{grassHLSLCode}</code>
                </pre>
              </div>
            </div>
          )}

          {activeSubTab === 'unity_cloth' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-300">
                <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-4 h-4" />
                  <span>خطوات إنشاء شباك المرمى الفيزيائية التفاعلية (Cloth Physics):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400 leading-relaxed">
                  <li>
                    أنشئ شبكة ثلاثية الأبعاد للمرمى (Goal Net Mesh) مفتوحة من الأمام، ومقسمة لـ 14 عموداً و 10 صفوف.
                  </li>
                  <li>
                    أضف مكون <code>Cloth</code> في Unity إلى كائن الشبكة.
                  </li>
                  <li>
                    في نافذة <strong>Edit Cloth Constraints</strong>: قم بتحديد الرؤوس الملاصقة للقوائم والعارضة والأرضية
                    واجعل قيمة <code>Max Distance = 0</code> لتثبيتها كركائز أساسية.
                  </li>
                  <li>
                    أضف سكريبت <code>ClothNetInteractive.cs</code> التالي لربط اصطدام كرة القدم بالشباك برمجياً.
                  </li>
                </ol>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="font-bold text-amber-300 font-sans">ClothNetInteractive.cs (Unity C#)</span>
                  <button
                    onClick={() => handleCopy(unityClothCode, 'unity_cloth_script')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'unity_cloth_script' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-sans">نسخ الكود</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-[11px] text-slate-300 leading-relaxed font-mono-code max-h-96">
                  <code>{unityClothCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Grass HLSL Shader for Unity URP
const grassHLSLCode = `Shader "Custom/RealisticSoccerPitchGrass"
{
    Properties
    {
        _LightGrassColor ("Light Grass Stripe", Color) = (0.15, 0.52, 0.22, 1.0)
        _DarkGrassColor ("Dark Grass Stripe", Color) = (0.11, 0.42, 0.17, 1.0)
        _LineColor ("White Line Color", Color) = (1.0, 1.0, 1.0, 1.0)
        _StripeCount ("Stripe Count (Pitch Length)", Float) = 18.0
        _BumpMap ("Grass Normal Map", 2D) = "bump" {}
        _BumpScale ("Bump Scale", Range(0, 1)) = 0.35
        _Roughness ("Roughness", Range(0, 1)) = 0.72
        _LineMaskTex ("Pitch Lines Mask Texture", 2D) = "black" {}
    }

    SubShader
    {
        Tags { "RenderType"="Opaque" "RenderPipeline"="UniversalPipeline" }
        LOD 300

        Pass
        {
            Name "ForwardLit"
            Tags { "LightMode"="UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS : NORMAL;
                float2 uv : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float3 positionWS : TEXCOORD0;
                float3 normalWS : TEXCOORD1;
                float2 uv : TEXCOORD2;
            };

            TEXTURE2D(_BumpMap); SAMPLER(sampler_BumpMap);
            TEXTURE2D(_LineMaskTex); SAMPLER(sampler_LineMaskTex);

            CBUFFER_START(UnityPerMaterial)
                float4 _LightGrassColor;
                float4 _DarkGrassColor;
                float4 _LineColor;
                float _StripeCount;
                float _BumpScale;
                float _Roughness;
            CBUFFER_END

            Varyings vert(Attributes input)
            {
                Varyings output;
                output.positionCS = TransformObjectToHClip(input.positionOS.xyz);
                output.positionWS = TransformObjectToWorld(input.positionOS.xyz);
                output.normalWS = TransformObjectToWorldNormal(input.normalOS);
                output.uv = input.uv;
                return output;
            }

            half4 frag(Varyings input) : SV_Target
            {
                // 1. حساب تقليم العشب المتناوب (Mowing Stripes Pattern)
                float stripePhase = sin(input.uv.y * _StripeCount * 3.14159);
                float stripeFactor = smoothstep(-0.05, 0.05, stripePhase);
                half4 grassBaseColor = lerp(_DarkGrassColor, _LightGrassColor, stripeFactor);

                // 2. دمج الخطوط البيضاء الصريحة من خريطة الخطوط
                half4 lineSample = SAMPLE_TEXTURE2D(_LineMaskTex, sampler_LineMaskTex, input.uv);
                half4 albedo = lerp(grassBaseColor, _LineColor, lineSample.r);

                // 3. حساب الإضاءة السينمائية (PBR Lighting)
                Light mainLight = GetMainLight();
                float3 lightDir = normalize(mainLight.direction);
                float NdotL = saturate(dot(normalize(input.normalWS), lightDir));
                half3 diffuse = albedo.rgb * (mainLight.color * NdotL + half3(0.04, 0.06, 0.1));

                return half4(diffuse, 1.0);
            }
            ENDHLSL
        }
    }
}`;

// Unity Cloth Net Script
const unityClothCode = `using UnityEngine;

[RequireComponent(typeof(Cloth), typeof(SkinnedMeshRenderer))]
public class ClothNetInteractive : MonoBehaviour
{
    private Cloth netCloth;
    public SphereCollider soccerBallCollider;

    [Header("معاملات مرونة وامتصاص الشباك (Net Physics)")]
    public float stretchStiffness = 0.88f;   // صلابة الشد لمقاومة التمدد المفرط
    public float bendingStiffness = 0.45f;   // صلابة الانحناء للحفاظ على شكل المرمى
    public float dampingDamping = 0.38f;     // امتصاص طاقة وسرعة الكرة فور الارتطام
    public float maxBulgeDistance = 0.75f;   // أقصى مسافة لانتفاخ الشباك للداخل (75 سم)

    void Awake()
    {
        netCloth = GetComponent<Cloth>();
        ConfigureGoalCloth();
    }

    public void ConfigureGoalCloth()
    {
        netCloth.stretchingStiffness = stretchStiffness;
        netCloth.bendingStiffness = bendingStiffness;
        netCloth.damping = dampingDamping;
        netCloth.useGravity = true;

        // تثبيت الإطار الأمامي والقائمين (Pinned Border Vertices)
        ClothSkinningCoefficient[] coeffs = netCloth.coefficients;
        Vector3[] vertices = netCloth.vertices;

        for (int i = 0; i < coeffs.Length; i++)
        {
            Vector3 v = vertices[i];
            // الرؤوس الملامسة لعارضة وقوائم المرمى وقضيب الأرضية
            bool isPinnedFrame = (Mathf.Abs(v.x) > 3.6f) || (v.y > 2.4f) || (v.y < 0.05f);

            coeffs[i].maxDistance = isPinnedFrame ? 0.0f : maxBulgeDistance;
        }
        netCloth.coefficients = coeffs;

        // ربط مصادم الكرة الفيزيائي بشباك المرمى
        if (soccerBallCollider != null)
        {
            netCloth.sphereColliders = new ClothSphereColliderPair[] {
                new ClothSphereColliderPair(soccerBallCollider)
            };
        }
    }

    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ball"))
        {
            // تشغيل صوت حفيف اهتزاز الشباك
            AudioSource audio = GetComponent<AudioSource>();
            if (audio != null && !audio.isPlaying) audio.Play();
        }
    }
}`;
