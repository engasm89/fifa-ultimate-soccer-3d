/**
 * Broadcast-Grade Soccer Scoreboard HUD
 * Displays team emblems, live match clock, scores, shot speed,
 * stamina bar, shot power gauge, camera selector, and action buttons.
 */

import React from 'react';
import { CameraMode, MatchStats } from '../game/GameManager';
import { Volume2, VolumeX, Camera, RotateCcw, Code2, HelpCircle, Flame, Shield, Trophy, Star, Swords, Diamond, Coins, Users, Package, Target, ShoppingBag, Grid } from 'lucide-react';
import { soundEngine } from '../game/audio';
import { SuperstarProfile } from '../game/superstars';
import { TacticsMode } from '../game/match5v5';
import { WorldCupBallEdition } from '../game/worldCupBall2026';

interface ScoreboardHUDProps {
  stats: MatchStats | null;
  cameraMode: CameraMode;
  onCameraChange: (mode: CameraMode) => void;
  onOpenCodeModal: () => void;
  onOpenHelpModal: () => void;
  onOpenStadiumStudio: () => void;
  onOpenSuperstarsModal: () => void;
  onOpenBallModal?: () => void;
  onOpenPlayerCollection?: () => void;
  onOpenSquadSelector?: () => void;
  onOpenPackOpening?: () => void;
  onOpenTrainingMode?: () => void;
  onOpenStore?: () => void;
  onOpenMainMenu?: () => void;
  onManualKickoff: () => void;
  selectedStar: SuperstarProfile;
  tacticsMode?: TacticsMode;
  onTacticsChange?: (mode: TacticsMode) => void;
  ballEdition?: WorldCupBallEdition;
  gems?: number;
  pounds?: number;
}

export const ScoreboardHUD: React.FC<ScoreboardHUDProps> = ({
  stats,
  cameraMode,
  onCameraChange,
  onOpenCodeModal,
  onOpenHelpModal,
  onOpenStadiumStudio,
  onOpenSuperstarsModal,
  onOpenBallModal,
  onOpenPlayerCollection,
  onOpenSquadSelector,
  onOpenPackOpening,
  onOpenTrainingMode,
  onOpenStore,
  onOpenMainMenu,
  onManualKickoff,
  selectedStar,
  tacticsMode = 'all_out_attack',
  onTacticsChange,
  ballEdition = 'trionda_official',
  gems = 0,
  pounds = 0,
}) => {
  const [muted, setMuted] = React.useState(soundEngine.getMuted());

  const toggleSound = () => {
    soundEngine.init();
    const isMuted = soundEngine.toggleMute();
    setMuted(isMuted);
  };

  const formatTime = (mins: number = 0, secs: number = 0) => {
    const m = mins.toString().padStart(2, '0');
    const s = secs.toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const cameraModes: { id: CameraMode; label: string; icon: string }[] = [
    { id: 'third_person', label: 'منظور اللاعب', icon: '🏃' },
    { id: 'broadcast', label: 'بث تلفزيوني', icon: '📺' },
    { id: 'behind_goal', label: 'خلف المرمى', icon: '🥅' },
    { id: 'free_orbit', label: 'مداري حر', icon: '🌐' },
  ];

  const shotPowerPercent = Math.round((stats?.shotPower || 0) * 100);
  const staminaPercent = stats?.stamina ?? 100;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 select-none font-sans">
      {/* Top Header & Scoreboard Bar */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Main Broadcast Scoreboard */}
        <header className="pointer-events-auto flex items-stretch bg-slate-950/90 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden divide-x divide-x-reverse divide-slate-800 max-w-2xl w-full">
          {/* Home Team (Player) */}
          <div
            onClick={onOpenSuperstarsModal}
            className="flex-1 flex items-center justify-start gap-3 px-3.5 py-2.5 bg-gradient-to-r from-amber-500/20 to-transparent cursor-pointer hover:bg-amber-500/30 transition-colors"
            title="انقر لتغيير النجم والبطاقة (مبابي، رونالدو، هالاند، ميسي، نيمار)"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shrink-0 border-2 border-amber-300">
              {selectedStar.avatarEmoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-300 text-base md:text-lg leading-tight truncate">
                  {selectedStar.nameAr}
                </span>
                {/* Large Jersey Number ("تكبير الرقم") */}
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs md:text-sm px-2 py-0.5 rounded-md font-chakra shadow-md border border-amber-200">
                  #{selectedStar.jerseyNumber}
                </span>
              </div>
              <span className="text-xs text-amber-300 font-mono tracking-wider font-extrabold flex items-center gap-1 mt-0.5">
                <span className="text-amber-400">⭐</span>
                <span>120 OVR</span>
                <span className="text-slate-500">|</span>
                <span className="text-amber-200">{selectedStar.position}</span>
              </span>
            </div>
          </div>

          {/* Central Score & Match Clock (Large Bold Numbers: "تكبير الرقم") */}
          <div className="flex flex-col items-center justify-center px-5 py-2 bg-slate-900/90 min-w-[140px]">
            <div className="text-[10px] md:text-xs text-amber-400 font-black tracking-wider mb-0.5 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              ⚡ مباراة 5 ضد 5
            </div>
            <div className="font-chakra font-black text-3xl md:text-4xl lg:text-5xl text-white tracking-widest flex items-center gap-3">
              <span className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">{stats?.homeScore ?? 0}</span>
              <span className="text-slate-500 text-2xl md:text-3xl">:</span>
              <span className="text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.6)]">{stats?.awayScore ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{formatTime(stats?.matchMinutes, stats?.matchSeconds)}</span>
            </div>
          </div>

          {/* Away Team (Opponent) */}
          <div className="flex-1 flex items-center justify-end gap-2.5 px-3 py-2 bg-gradient-to-l from-red-500/15 to-transparent">
            <div className="min-w-0 text-left">
              <span className="block font-black text-red-400 text-sm md:text-base leading-tight truncate">
                الصقر الملكي
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">الضيف</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs shadow-md shrink-0">
              ⚔️
            </div>
          </div>
        </header>

        {/* Currency Display Bar (Integrated from Mobile Simulator) */}
        <div className="flex items-center justify-center gap-4 bg-slate-950/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-800 mb-2">
          <div className="flex items-center gap-2 bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-500/30">
            <Diamond className="w-4 h-4 text-blue-400 fill-blue-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-blue-300 font-bold uppercase tracking-wider">GEMS</span>
              <span className="text-sm font-black text-white">{gems.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-500/30">
            <Coins className="w-4 h-4 text-red-400 fill-red-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-red-300 font-bold uppercase tracking-wider">POUNDS</span>
              <span className="text-sm font-black text-white">{pounds.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Tactical Sub-Bar: Possession, Speed, Stamina, Tactics Mode */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">الاستحواذ:</span>
            <span className="font-mono font-bold text-amber-400">{stats?.homePossession ?? 50}%</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800">
            <Flame className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">آخر تسديدة:</span>
            <span className="font-mono font-bold text-sky-400">{stats?.shotSpeedKmh ?? 0} كم/س</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur px-2.5 py-1 rounded-md border border-slate-800">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-slate-400">التسديدات:</span>
            <span className="font-mono font-bold text-yellow-400">{stats?.totalShots ?? 0}</span>
          </div>

          {/* World Cup 2026 Ball Badge */}
          {onOpenBallModal && (
            <div
              onClick={onOpenBallModal}
              className="pointer-events-auto cursor-pointer flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-900 backdrop-blur px-2.5 py-1 rounded-md border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-colors"
              title="انقر لمعاينة وتغيير كرة كأس العالم 2026 (تريوندا)"
            >
              <span className="text-sm">⚽</span>
              <span className="text-slate-300 font-bold hidden sm:inline">الكرة:</span>
              <span className="font-chakra font-black text-amber-300 text-[11px] tracking-wide">
                {ballEdition === 'trionda_final' ? 'TRIONDA FINAL الذهبية' : 'TRIONDA الرسمية 2026'}
              </span>
            </div>
          )}

          {/* Interactive Tactics Mode Toggle ("يكون هجوم") */}
          {onTacticsChange && (
            <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-700/80 shadow-md">
              <Swords className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">التكتيك:</span>
              <button
                onClick={() => onTacticsChange('all_out_attack')}
                className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-all ${
                  tacticsMode === 'all_out_attack'
                    ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(225,29,72,0.8)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="هجوم كاسح وضغط عالي 5 ضد 5"
              >
                ⚔️ هجوم كاسح
              </button>
              <button
                onClick={() => onTacticsChange('balanced')}
                className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-all ${
                  tacticsMode === 'balanced'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="لعب متوازن"
              >
                ⚖️ متوازن
              </button>
              <button
                onClick={() => onTacticsChange('defensive')}
                className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-all ${
                  tacticsMode === 'defensive'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="دفاع منظم وهجمات مرتدة"
              >
                🛡️ دفاع
              </button>
            </div>
          )}
        </div>

        {/* Quick Controls Hint Bar */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/70 backdrop-blur px-3 py-0.5 rounded-full border border-slate-800 text-[11px] text-slate-400">
          <span className="text-amber-400 font-bold">🎮 حركة اللاعب:</span>
          <span className="text-slate-300 font-semibold">[← شمال / A]</span>
          <span className="text-slate-300 font-semibold">[يمين → / D]</span>
          <span className="text-slate-300 font-semibold">[هجوم ↑ / W]</span>
          <span className="text-slate-300 font-semibold">[تراجع ↓ / S]</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">[تسديد: Space]</span>
          <span className="text-teal-400 font-bold">[تمرير: F]</span>
          <span className="text-orange-400 font-bold">[💥 زحلقة الافتكاك: F عند الدفاع]</span>
        </div>

        {/* Top Control Utility Buttons */}
        <nav aria-label="Game controls" className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-lg flex-wrap sm:flex-nowrap justify-center">
          {/* World Cup 2026 Ball Showcase Button */}
          {onOpenBallModal && (
            <button
              onClick={onOpenBallModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-red-600/30 via-emerald-600/30 to-blue-600/30 hover:from-red-600/50 hover:to-blue-600/50 text-amber-300 border border-amber-400/80 text-xs font-black transition-all cursor-pointer shadow-sm animate-pulse"
              title="كرة كأس العالم 2026 الرسمية: تريوندا (TRIONDA)"
            >
              <span className="text-sm">⚽</span>
              <span>كأس العالم 2026 ({ballEdition === 'trionda_final' ? 'النهائي 🏆' : 'تريوندا'})</span>
            </button>
          )}

          <button
            onClick={onOpenSuperstarsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-amber-500/30 to-yellow-500/30 hover:from-amber-500/50 hover:to-yellow-500/50 text-amber-300 border border-amber-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
            title="اختيار نجم الهجوم وبطاقة دوري الأبطال 120 (مبابي، رونالدو، هالاند، ميسي، نيمار)"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>بطاقات 120 OVR ({selectedStar.nameAr.split(' ')[0]})</span>
          </button>

          {/* Player Collection Button */}
          {onOpenPlayerCollection && (
            <button
              onClick={onOpenPlayerCollection}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/50 hover:to-cyan-500/50 text-blue-300 border border-blue-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="مجموعة اللاعبين والبطاقات"
            >
              <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
              <span>مجموعة اللاعبين</span>
            </button>
          )}

          {/* Squad Selector Button */}
          {onOpenSquadSelector && (
            <button
              onClick={onOpenSquadSelector}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/50 hover:to-emerald-500/50 text-green-300 border border-green-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="اختيار التشكيلة للمباراة"
            >
              <Users className="w-4 h-4 fill-green-400 text-green-400" />
              <span>التشكيلة</span>
            </button>
          )}

          {/* Pack Opening Button */}
          {onOpenPackOpening && (
            <button
              onClick={onOpenPackOpening}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 text-purple-300 border border-purple-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="افتح الباكات للحصول على لاعبين"
            >
              <Package className="w-4 h-4 fill-purple-400 text-purple-400" />
              <span>الباكات</span>
            </button>
          )}

          {/* Training Mode Button */}
          {onOpenTrainingMode && (
            <button
              onClick={onOpenTrainingMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-orange-500/30 to-red-500/30 hover:from-orange-500/50 hover:to-red-500/50 text-orange-300 border border-orange-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="تدريب على التسديد وكسب الجوائز"
            >
              <Target className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>التدريب</span>
            </button>
          )}

          {/* Store Button */}
          {onOpenStore && (
            <button
              onClick={onOpenStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/50 hover:to-emerald-500/50 text-green-300 border border-green-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="المتجر لشراء الجواهر والعملات"
            >
              <ShoppingBag className="w-4 h-4 fill-green-400 text-green-400" />
              <span>المتجر</span>
            </button>
          )}

          {/* Main Menu Button */}
          {onOpenMainMenu && (
            <button
              onClick={onOpenMainMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 text-purple-300 border border-purple-400/60 text-xs font-black transition-all cursor-pointer shadow-sm"
              title="القائمة الرئيسية"
            >
              <Grid className="w-4 h-4 fill-purple-400 text-purple-400" />
              <span>القائمة</span>
            </button>
          )}

          <button
            onClick={onOpenStadiumStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="تخصيص الإضاءة، الشباك الفيزيائية، وعشب الملعب"
          >
            <span>🏟️</span>
            <span>استوديو الملعب</span>
          </button>

          <button
            onClick={onOpenCodeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="عرض الأكواد والسكريبتات البرمجية"
          >
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>الأكواد والسكريبتات (C# / TS)</span>
          </button>

          <button
            onClick={onOpenHelpModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title="تعليمات التحكم"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">التحكم</span>
          </button>

          <button
            onClick={onManualKickoff}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            title="إعادة السنترة في منتصف الملعب"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">سنترة</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 text-xs transition-colors cursor-pointer"
            title={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </nav>
      </div>

      {/* Middle Center: Shot Power Gauge (Active while charging) */}
      {shotPowerPercent > 0 && (
        <div className="self-center flex flex-col items-center gap-1 bg-slate-950/90 backdrop-blur px-5 py-2.5 rounded-xl border border-amber-500/60 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between w-48 text-xs font-black">
            <span className="text-amber-400">قوة التسديدة</span>
            <span className="font-mono text-white">{shotPowerPercent}%</span>
          </div>
          <div className="w-48 h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                shotPowerPercent < 45
                  ? 'bg-emerald-500'
                  : shotPowerPercent < 80
                  ? 'bg-amber-400'
                  : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
              }`}
              style={{ width: `${shotPowerPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400">حرر الزر لإطلاق التسديدة الصاروخية!</span>
        </div>
      )}

      {/* Kickoff Countdown Banner */}
      {stats?.isKickoffCountdown && (
        <div className="self-center bg-slate-950/90 border border-amber-500/80 px-8 py-3 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce">
          <span className="text-amber-400 font-bold text-sm">استعد لضربة البداية (السنترة)</span>
          <span className="font-chakra font-black text-4xl text-white">{stats.countdownSeconds}</span>
        </div>
      )}

      {/* Bottom Bar: Camera Controls & Player Stamina & 5v5 Radar */}
      <div className="flex items-end justify-between w-full">
        {/* Left: Player Stamina & 5v5 Radar */}
        <div className="flex items-end gap-3 pointer-events-auto">
          {/* Stamina Card */}
          <div className="flex flex-col gap-1.5 bg-slate-950/80 backdrop-blur p-2.5 rounded-xl border border-slate-800/80 shadow-lg min-w-[150px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">اللياقة (Sprint)</span>
              <span className="font-mono text-emerald-400 text-[11px] font-bold">{staminaPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
                style={{ width: `${staminaPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  stats?.hasBallControl ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'
                }`}
              />
              <span className={stats?.hasBallControl ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
                {stats?.hasBallControl ? 'الكرة تحت السيطرة' : 'البحث عن الكرة'}
              </span>
            </div>
          </div>

          {/* 5v5 Tactical Radar Mini-Map */}
          <div className="hidden sm:flex flex-col items-center bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
            <span className="text-[10px] text-slate-400 font-bold mb-1">رادار 5 ضد 5</span>
            <div className="relative w-[64px] h-[96px] bg-emerald-950/70 rounded border border-emerald-500/40 overflow-hidden shadow-inner">
              {/* Pitch Markings */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/30" />
              <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/30" />
              <div className="absolute inset-x-2 top-0 h-4 border-b border-x border-emerald-500/30" />
              <div className="absolute inset-x-2 bottom-0 h-4 border-t border-x border-emerald-500/30" />

              {/* Ball */}
              {stats?.radarBall && (
                <div
                  className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#fff] -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{
                    left: `${((stats.radarBall.x + 34) / 68) * 100}%`,
                    top: `${((stats.radarBall.z + 52.5) / 105) * 100}%`,
                  }}
                />
              )}

              {/* 10 Players */}
              {stats?.radarPlayers?.map((p, idx) => {
                const left = `${Math.min(95, Math.max(5, ((p.x + 34) / 68) * 100))}%`;
                const top = `${Math.min(95, Math.max(5, ((p.z + 52.5) / 105) * 100))}%`;

                if (p.isUser) {
                  return (
                    <div
                      key={idx}
                      className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
                      style={{ left, top }}
                    >
                      <span className="w-3 h-3 rounded-full bg-amber-400/50 animate-ping absolute" />
                      <span className="w-2 h-2 rounded-full bg-amber-300 border border-slate-950" />
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                      p.team === 'home' ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ left, top }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Camera Mode Switcher */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-bold">
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            الكاميرا:
          </span>
          {cameraModes.map((m) => (
            <button
              key={m.id}
              onClick={() => onCameraChange(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                cameraMode === m.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
