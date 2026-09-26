/**
 * High Performance Virtual Touch & On-Screen Controls for Mobile & Desktop
 * Features:
 * - Circular Analog Joystick ("الدائرة") for full 360° fluid movement:
 *   - فوق للقدام (الأمام / نتقدم)
 *   - الرجوع (الخلف / تراجع)
 *   - اليمين (نمشي إلى اليمين)
 *   - الشمال (نمشي للشمال)
 * - Huge Action Buttons (تسديد صاروخي, تـمـريـر, زحلـقة الافتكاك, ركــض نفاث)
 * - Prominent 120 OVR Superstar Jersey Badge
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { PlayerControls } from '../game/player';
import { CameraMode } from '../game/GameManager';
import { Camera, Zap } from 'lucide-react';
import { soundEngine } from '../game/audio';
import { SuperstarProfile } from '../game/superstars';

interface TouchVirtualControlsProps {
  onControlsChange: (controls: PlayerControls) => void;
  onCameraCycle: () => void;
  cameraMode: CameraMode;
  selectedStar?: SuperstarProfile;
}

export const TouchVirtualControls: React.FC<TouchVirtualControlsProps> = ({
  onControlsChange,
  onCameraCycle,
  selectedStar,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);

  const controlsStateRef = useRef<PlayerControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    shootCharge: false,
    passOrTackle: false,
  });

  const updateControls = useCallback(
    (partial: Partial<PlayerControls>) => {
      controlsStateRef.current = { ...controlsStateRef.current, ...partial };
      onControlsChange(controlsStateRef.current);
    },
    [onControlsChange]
  );

  // Joystick touch handlers
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    soundEngine.init();
    if (activeTouchId !== null) return;
    const touch = e.changedTouches[0];
    setActiveTouchId(touch.identifier);
    handleJoystickMove(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        handleJoystickMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    if (activeTouchId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId) {
        setActiveTouchId(null);
        setStickPos({ x: 0, y: 0 });
        updateControls({
          forward: false,
          backward: false,
          left: false,
          right: false,
          analogX: 0,
          analogZ: 0,
          analogMagnitude: 0,
        });
        break;
      }
    }
  };

  const handleJoystickMove = (clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    if (!base) return;

    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width / 2;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const nx = (Math.cos(angle) * clampedDist) / maxRadius;
    const ny = (Math.sin(angle) * clampedDist) / maxRadius;

    setStickPos({
      x: nx * maxRadius * 0.72,
      y: ny * maxRadius * 0.72,
    });

    // Smooth analog control governed directly by finger distance & direction
    const deadzone = 0.08;
    const rawMag = clampedDist / maxRadius;
    const effectiveMag = rawMag < deadzone ? 0 : Math.min(1.0, (rawMag - deadzone) / (1.0 - deadzone));

    updateControls({
      left: nx < -deadzone,
      right: nx > deadzone,
      forward: ny < -deadzone, // Forward / فوق للقدام
      backward: ny > deadzone, // Backward / تراجع
      analogX: effectiveMag > 0 ? nx : 0,
      analogZ: effectiveMag > 0 ? ny : 0,
      analogMagnitude: effectiveMag,
    });
  };

  // Mouse drag support for desktop testers on circular joystick
  const handleMouseDown = (e: React.MouseEvent) => {
    soundEngine.init();
    setActiveTouchId(999);
    handleJoystickMove(e.clientX, e.clientY);

    const onMouseMove = (ev: MouseEvent) => {
      handleJoystickMove(ev.clientX, ev.clientY);
    };

    const onMouseUp = () => {
      setActiveTouchId(null);
      setStickPos({ x: 0, y: 0 });
      updateControls({
        forward: false,
        backward: false,
        left: false,
        right: false,
        analogX: 0,
        analogZ: 0,
        analogMagnitude: 0,
      });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      onControlsChange({
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
        shootCharge: false,
        passOrTackle: false,
      });
    };
  }, [onControlsChange]);

  const isLeftActive = stickPos.x < -12;
  const isRightActive = stickPos.x > 12;
  const isUpActive = stickPos.y < -12;
  const isDownActive = stickPos.y > 12;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none font-sans">
      {/* ======================================================== */}
      {/* LEFT CONTROL: GIANT CIRCULAR ANALOG JOYSTICK ("الدائرة") */}
      {/* فوق للقدام • الرجوع • اليمين • الشمال                      */}
      {/* ======================================================== */}
      <div className="absolute bottom-5 left-3 sm:left-8 pointer-events-auto flex flex-col items-center gap-2">
        {/* Player Badge Above the Circle ("تكبير الرقم") */}
        <div
          className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          title={`الرقم #${selectedStar?.jerseyNumber ?? 9} - ${selectedStar?.nameAr ?? 'كيليان مبابي'}`}
        >
          <span className="text-xl sm:text-2xl font-black font-chakra text-amber-300">
            #{selectedStar?.jerseyNumber ?? 9}
          </span>
          <span className="text-xs sm:text-sm font-black text-white">
            {selectedStar?.nameAr ?? 'كيليان مبابي'}
          </span>
          <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-1.5 py-0.5 rounded-md">
            120 OVR
          </span>
        </div>

        {/* ======================================================== */}
        {/* THE CIRCLE ("الدائرة") - LARGE 360° PRECISION JOYSTICK  */}
        {/* ======================================================== */}
        <div
          ref={joystickBaseRef}
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          onTouchCancel={handleJoystickTouchEnd}
          onMouseDown={handleMouseDown}
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 backdrop-blur-xl border-4 border-amber-400/80 flex items-center justify-center relative touch-none shadow-[0_0_35px_rgba(0,0,0,0.8),inset_0_0_25px_rgba(245,158,11,0.15)] cursor-pointer group active:border-amber-300"
        >
          {/* Subtle 4-Quadrant Divider Lines in the Circle */}
          <div className="absolute w-full h-[1px] bg-slate-700/40 pointer-events-none" />
          <div className="absolute h-full w-[1px] bg-slate-700/40 pointer-events-none" />

          {/* Direction 1: TOP [↑ فوق للقدام / نتقدم] */}
          <div
            className={`absolute top-2.5 flex flex-col items-center pointer-events-none transition-all duration-150 ${
              isUpActive
                ? 'text-amber-300 scale-125 drop-shadow-[0_0_12px_#f59e0b]'
                : 'text-slate-300 group-hover:text-amber-200'
            }`}
          >
            <span className="text-xl sm:text-2xl font-black leading-none animate-bounce">↑</span>
            <span className="text-xs sm:text-sm font-black tracking-wide">فوق للقدام</span>
          </div>

          {/* Direction 2: BOTTOM [↓ الرجوع / تراجع] */}
          <div
            className={`absolute bottom-2.5 flex flex-col items-center pointer-events-none transition-all duration-150 ${
              isDownActive
                ? 'text-amber-300 scale-125 drop-shadow-[0_0_12px_#f59e0b]'
                : 'text-slate-300 group-hover:text-amber-200'
            }`}
          >
            <span className="text-xs sm:text-sm font-black tracking-wide">الرجوع</span>
            <span className="text-xl sm:text-2xl font-black leading-none">↓</span>
          </div>

          {/* Direction 3: LEFT [← الشمال] */}
          <div
            className={`absolute left-2.5 flex items-center gap-1 pointer-events-none transition-all duration-150 ${
              isLeftActive
                ? 'text-amber-300 scale-125 drop-shadow-[0_0_12px_#f59e0b]'
                : 'text-slate-300 group-hover:text-amber-200'
            }`}
          >
            <span className="text-xl sm:text-2xl font-black leading-none">←</span>
            <span className="text-xs sm:text-sm font-black tracking-wide">الشمال</span>
          </div>

          {/* Direction 4: RIGHT [اليمين →] */}
          <div
            className={`absolute right-2.5 flex items-center gap-1 pointer-events-none transition-all duration-150 ${
              isRightActive
                ? 'text-amber-300 scale-125 drop-shadow-[0_0_12px_#f59e0b]'
                : 'text-slate-300 group-hover:text-amber-200'
            }`}
          >
            <span className="text-xs sm:text-sm font-black tracking-wide">اليمين</span>
            <span className="text-xl sm:text-2xl font-black leading-none">→</span>
          </div>

          {/* Inner Guidance Concentric Ring */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-amber-400/30 pointer-events-none flex items-center justify-center">
            <span className="text-xs text-amber-400/60 font-chakra font-black">360°</span>
          </div>

          {/* Movable Thumb Stick ("الدائرة الداخلية المتحركة") */}
          <div
            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full border-4 shadow-2xl absolute pointer-events-none transition-transform duration-75 flex flex-col items-center justify-center text-white ${
              activeTouchId !== null
                ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-white text-slate-950 shadow-[0_0_30px_rgba(245,158,11,1)] scale-105'
                : 'bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 border-white/90 shadow-[0_0_20px_rgba(56,189,248,0.7)]'
            }`}
            style={{
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
            }}
          >
            <span className="text-2xl sm:text-3xl leading-none">⚽</span>
            <span className="text-[10px] font-black font-chakra tracking-tighter">
              #{selectedStar?.jerseyNumber ?? 9}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT ACTION BUTTONS: HUGE SHOOT, PASS, TACKLE, SPRINT  */}
      {/* "وتكبر الأزهار [الأزرار] التسديد والتمرين والرقم"          */}
      {/* ======================================================== */}
      <div className="absolute bottom-5 right-3 sm:right-8 pointer-events-auto flex flex-col items-end gap-3.5">
        {/* Top row: Camera Switch & Huge Sprint */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.init();
              onCameraCycle();
            }}
            className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-slate-900/90 backdrop-blur border-2 border-slate-700 text-slate-300 flex items-center justify-center active:scale-95 shadow-lg active:bg-blue-600 cursor-pointer"
            title="تبديل الكاميرا"
          >
            <Camera className="w-7 h-7 text-sky-400" />
          </button>

          {/* Huge Sprint Button: [⚡ ركــض] */}
          <button
            onTouchStart={() => updateControls({ sprint: true })}
            onTouchEnd={() => updateControls({ sprint: false })}
            onMouseDown={() => updateControls({ sprint: true })}
            onMouseUp={() => updateControls({ sprint: false })}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 active:from-amber-500 active:to-yellow-700 backdrop-blur border-3 border-amber-200 text-slate-950 font-black flex flex-col items-center justify-center active:scale-95 shadow-xl select-none cursor-pointer"
            title="انطلاقة السرعة القصوى (Sprint 99)"
          >
            <Zap className="w-8 h-8 fill-current" />
            <span className="text-xs sm:text-sm font-black">ركــض</span>
          </button>
        </div>

        {/* Bottom row: Huge Slide-Tackle, Pass, and Gigantic Shoot */}
        <div className="flex items-center gap-3.5">
          {/* Large Slide-Tackle Button: [💥 زحلـقة] */}
          <button
            onTouchStart={() => {
              soundEngine.init();
              updateControls({ passOrTackle: true });
            }}
            onTouchEnd={() => updateControls({ passOrTackle: false })}
            onMouseDown={() => {
              soundEngine.init();
              updateControls({ passOrTackle: true });
            }}
            onMouseUp={() => updateControls({ passOrTackle: false })}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-700 active:from-orange-600 active:to-amber-800 backdrop-blur border-3 border-orange-300 text-white font-black flex flex-col items-center justify-center active:scale-95 shadow-xl select-none cursor-pointer"
            title="زحلقة الافتكاك والسقوط على العشب لقطع الكرة"
          >
            <span className="text-2xl sm:text-3xl">💥</span>
            <span className="text-xs sm:text-sm font-black">زحلـقة</span>
          </button>

          {/* Large Pass Button: [👟 تـمـريـر] */}
          <button
            onTouchStart={() => updateControls({ passOrTackle: true })}
            onTouchEnd={() => updateControls({ passOrTackle: false })}
            onMouseDown={() => updateControls({ passOrTackle: true })}
            onMouseUp={() => updateControls({ passOrTackle: false })}
            className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 active:from-teal-600 active:to-emerald-800 backdrop-blur border-3 border-teal-300 text-white font-black flex flex-col items-center justify-center active:scale-95 shadow-xl select-none cursor-pointer"
            title="تمرير أرضي لزميل الفريق"
          >
            <span className="text-3xl sm:text-4xl">👟</span>
            <span className="text-sm sm:text-base font-black">تـمـريـر</span>
          </button>

          {/* GIGANTIC SHOOT BUTTON: [🚀 تسـديـد] */}
          <button
            onTouchStart={() => {
              soundEngine.init();
              updateControls({ shootCharge: true });
            }}
            onTouchEnd={() => updateControls({ shootCharge: false })}
            onMouseDown={() => {
              soundEngine.init();
              updateControls({ shootCharge: true });
            }}
            onMouseUp={() => updateControls({ shootCharge: false })}
            className="w-28 h-28 sm:w-34 sm:h-34 rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-700 active:from-red-600 active:to-rose-800 border-4 border-amber-400 text-white font-black flex flex-col items-center justify-center active:scale-95 shadow-[0_0_40px_rgba(239,68,68,0.9)] select-none cursor-pointer animate-pulse"
            title="اضغط مطولاً لشحن قوة التسديدة ثم حرر لإطلاق الصاروخ نحو المرمى!"
          >
            <span className="text-3xl sm:text-4xl">🚀</span>
            <span className="text-xl sm:text-2xl font-black tracking-wide drop-shadow-md">تسـديـد</span>
            <span className="text-xs text-amber-200 font-extrabold">صاروخي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
