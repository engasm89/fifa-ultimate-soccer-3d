/**
 * FIFA World Cup 2026 Official Ball Modal - "TRIONDA"
 * Interactive 3D inspector & showcase for the official 2026 World Cup ball.
 * Allows spinning the 3D ball, switching editions (Official Match Ball vs Final Gold),
 * and viewing full design engineering details.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Sparkles, Trophy, Cpu, ShieldCheck, Check, Orbit, Layers, Flame } from 'lucide-react';
import { WorldCupBallEdition, getWorldCup2026BallTextures } from '../game/worldCupBall2026';

interface WorldCupBallModalProps {
  isOpen: boolean;
  onClose: () => void;
  ballEdition: WorldCupBallEdition;
  onBallEditionChange: (edition: WorldCupBallEdition) => void;
  onTriggerTestShot?: (type: 'top_corner' | 'center') => void;
}

export const WorldCupBallModal: React.FC<WorldCupBallModalProps> = ({
  isOpen,
  onClose,
  ballEdition,
  onBallEditionChange,
  onTriggerTestShot,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // 3D Ball Preview inside Modal
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const container = canvasRef.current;

    const scene = new THREE.Scene();
    scene.background = null;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 1.85);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5ea, 3.5);
    dirLight1.position.set(2, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 2.8);
    rimLight.position.set(0, -3, 2);
    scene.add(rimLight);

    // Ball Mesh
    const { diffuseMap, bumpMap, roughnessMap } = getWorldCup2026BallTextures(ballEdition);
    const geometry = new THREE.SphereGeometry(0.55, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: diffuseMap,
      bumpMap: bumpMap,
      bumpScale: 0.035,
      roughnessMap: roughnessMap,
      roughness: ballEdition === 'trionda_final' ? 0.35 : 0.28,
      metalness: ballEdition === 'trionda_final' ? 0.45 : 0.12,
    });

    const ballMesh = new THREE.Mesh(geometry, material);
    scene.add(ballMesh);

    // Mouse drag interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      ballMesh.rotation.y += dx * 0.01;
      ballMesh.rotation.x += dy * 0.01;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch drag interaction for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      ballMesh.rotation.y += dx * 0.01;
      ballMesh.rotation.x += dy * 0.01;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging && isRotating) {
        ballMesh.rotation.y += 0.008;
        ballMesh.rotation.x += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [isOpen, ballEdition, isRotating]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="relative bg-slate-900/95 border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.25)] max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg border-2 border-yellow-200 shrink-0">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                  كرة كأس العالم 2026 الرسمية: تريوندا (TRIONDA)
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  FIFA OFFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تصميم أديداس الثوري رباعي الألواح الموجية تكريماً للدول المستضيفة الثلاث: كندا ومكسيك وأمريكا.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-6">
          {/* Top Banner: 3D Live Interactive Inspection + Edition Picker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 3D Preview Stage */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-700/80 rounded-2xl p-4 relative shadow-inner overflow-hidden">
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsRotating((p) => !p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-bold text-amber-300 border border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Orbit className="w-3.5 h-3.5" />
                  <span>{isRotating ? 'إيقاف الدوران' : 'دوران تلقائي'}</span>
                </button>
              </div>

              {/* 3D Ball Canvas Viewport */}
              <div
                ref={canvasRef}
                className="w-64 h-64 sm:w-72 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center"
                title="اسحب بالفأرة أو اللمس لتدوير الكرة واستكشاف تفاصيل الألواح"
              />

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
                <Orbit className="w-3.5 h-3.5 text-amber-400" />
                <span>اسحب باللمس أو الماوس لمعاينة 360° كاملة لسطح الكرة</span>
              </div>
            </div>

            {/* Edition Switcher & Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-2">
                  اختر إصدار كرة كأس العالم 2026:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Trionda Official Match Ball */}
                  <button
                    onClick={() => onBallEditionChange('trionda_official')}
                    className={`relative p-3.5 rounded-2xl text-right transition-all cursor-pointer border-2 flex flex-col justify-between ${
                      ballEdition === 'trionda_official'
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-chakra font-black text-sm text-white">TRIONDA</span>
                      {ballEdition === 'trionda_official' && (
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-amber-300 mt-1">الكرة الرسمية (Match Ball)</span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      أبيض لؤلؤي مع أمواج كندا الحمراء والمكسيك الخضراء وأمريكا الزرقاء والذهب الملكي.
                    </p>
                  </button>

                  {/* Trionda Final Gold Edition */}
                  <button
                    onClick={() => onBallEditionChange('trionda_final')}
                    className={`relative p-3.5 rounded-2xl text-right transition-all cursor-pointer border-2 flex flex-col justify-between ${
                      ballEdition === 'trionda_final'
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-chakra font-black text-sm text-yellow-300">TRIONDA FINAL</span>
                      {ballEdition === 'trionda_final' && (
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-amber-400 mt-1">كرة النهائي الذهبية (Final)</span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      أسود بركاني فاخر مع أمواج ذهبية 24K ولمسات وردية نارية وتكريم لمدن النهائي.
                    </p>
                  </button>
                </div>
              </div>

              {/* Action: Test Shot with the 2026 Ball */}
              {onTriggerTestShot && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">تجربة التسديد المباشر بالكرة:</span>
                    <span className="text-[11px] text-slate-400">شاهد حركة انحناء الكرة وتفاعلها مع الشباك الفيزيائية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTriggerTestShot('top_corner')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1 cursor-pointer shadow"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>صاروخ في المقص 90°</span>
                    </button>
                    <button
                      onClick={() => onTriggerTestShot('center')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                    >
                      <span>قذيفة في الوسط</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pillars of the 2026 Ball Design (Canadian Maple, Mexican Eagle, USA Stars, Tech) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Canada */}
            <div className="bg-slate-950/70 border border-red-500/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍁</span>
                  <span className="font-bold text-red-400 text-sm">كندا (Canada)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أمواج قرمزية مشبعة مع أوراق القيقب الهندسية وشبكة ناعمة ترمز إلى الطبيعة الكندية الشمالية.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-red-300/80 font-mono font-bold bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-900/50">
                اللون: Crimson Red #DC2626
              </div>
            </div>

            {/* Mexico */}
            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🦅</span>
                  <span className="font-bold text-emerald-400 text-sm">المكسيك (Mexico)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أمواج خضراء زمردية مستوحاة من ريش أجنحة النسر الآزتيكي والزخارف الميزوأمريكية العريقة.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-300/80 font-mono font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900/50">
                اللون: Emerald Green #059669
              </div>
            </div>

            {/* USA */}
            <div className="bg-slate-950/70 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-blue-400 text-sm">الولايات المتحدة (USA)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  أمواج زرقاء ملكية مرصعة بالنجوم الخماسية البيضاء والمذهبة مع خطوط السرعة الديناميكية.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-blue-300/80 font-mono font-bold bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-900/50">
                اللون: Royal Navy #1D4ED8
              </div>
            </div>

            {/* Connected Ball & Gold */}
            <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-amber-400 text-sm">حساس 500Hz المتصل</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  شريحة استشعار حركة 500Hz متصلة بالذكاء الاصطناعي وتقنية التسلل شبه الآلي وتتبع اللمسات بدقة الملي ثانية.
                </p>
              </div>
              <div className="mt-3 text-[10px] text-amber-300/80 font-mono font-bold bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-900/50">
                CONNECTED BALL TECH
              </div>
            </div>
          </div>

          {/* Technical Specifications of the 2026 Ball */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-black text-sm text-amber-300 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>المواصفات التقنية والهندسية لكرة كأس العالم 2026 (Adidas Trionda Specs):</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">الهيكل الإيروديناميكي:</span>
                <span className="font-bold text-white">4 ألواح موجية حرارية (Seamless)</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">المقاس والوزن:</span>
                <span className="font-bold text-white">مقاس 5 رسمي (430 غرام)</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">الملمس السطحي:</span>
                <span className="font-bold text-white">ميكرو-نتوءات هوائية (Dimples)</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">الاعتماد الدولي:</span>
                <span className="font-bold text-emerald-400">FIFA Quality Pro المعتمَد</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>كرة كأس العالم 2026 مفعلة ومطبقة فيزيائياً في كل ركلات وتمريرات وأهداف الملعب.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-lg"
          >
            تأكيد والعودة للمباراة ⚽
          </button>
        </div>
      </div>
    </div>
  );
};
