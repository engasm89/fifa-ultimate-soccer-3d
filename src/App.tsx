/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SoccerCanvas, LightingConfig } from './game/SoccerCanvas';
import { ScoreboardHUD } from './components/ScoreboardHUD';
import { GoalCelebrationOverlay } from './components/GoalCelebrationOverlay';
import { TouchVirtualControls } from './components/TouchVirtualControls';
import { CodeInspectorModal } from './components/CodeInspectorModal';
import { StadiumStudioModal } from './components/StadiumStudioModal';
import { SuperstarsModal } from './components/SuperstarsModal';
import { HelpModal } from './components/HelpModal';
import { CameraMode, MatchStats } from './game/GameManager';
import { PlayerControls } from './game/player';
import { SUPERSTARS, SuperstarProfile } from './game/superstars';
import { TacticsMode } from './game/match5v5';
import { WorldCupBallEdition } from './game/worldCupBall2026';
import { WorldCupBallModal } from './components/WorldCupBallModal';
import { PlayerCard3D } from './components/PlayerCard3D';
import { PlayerCollectionModal } from './components/PlayerCollectionModal';
import { SquadSelector3D } from './components/SquadSelector3D';
import { PackOpening3D } from './components/PackOpening3D';
import { TrainingMode3D } from './components/TrainingMode3D';
import { StoreModal } from './components/StoreModal';
import { SkillShopModal, OwnedSkill } from './components/SkillShopModal';
import { MainMenu } from './components/MainMenu';
import { ProfileModal } from './components/ProfileModal';
import { aiService } from './services/aiService';
import { getSuperstarsAsPlayers, playerToSuperstar } from './data/playerBridge';
import { Player } from './data/players';

export default function App() {
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('third_person');
  const [tacticsMode, setTacticsMode] = useState<TacticsMode>('all_out_attack');
  const [ballEdition, setBallEdition] = useState<WorldCupBallEdition>('trionda_official');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isStadiumStudioOpen, setIsStadiumStudioOpen] = useState<boolean>(false);
  const [isSuperstarsModalOpen, setIsSuperstarsModalOpen] = useState<boolean>(false);
  const [isBallModalOpen, setIsBallModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [manualKickoffTrigger, setManualKickoffTrigger] = useState<number>(0);

  // Currency System (from Mobile Simulator)
  const [gems, setGems] = useState<number>(1000);
  const [pounds, setPounds] = useState<number>(10000);

  // Player Collection System
  const [myPlayers, setMyPlayers] = useState<Player[]>([]);
  const [showPlayerCollection, setShowPlayerCollection] = useState<boolean>(false);
  const [showSquadSelector, setShowSquadSelector] = useState<boolean>(false);
  const [showPackOpening, setShowPackOpening] = useState<boolean>(false);
  const [showTrainingMode, setShowTrainingMode] = useState<boolean>(false);
  const [showStore, setShowStore] = useState<boolean>(false);
  const [showSkillShop, setShowSkillShop] = useState<boolean>(false);
  const [ownedSkills, setOwnedSkills] = useState<OwnedSkill[]>([]);
  const rewardedMatchRef = useRef<number | null>(null);
  const [showMainMenu, setShowMainMenu] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  // User Profile
  const [user, setUser] = useState<{ name: string; facebook: string } | null>(null);

  // Selected Superstar (Mbappé, Ronaldo, Haaland, Messi, Neymar)
  const [selectedStar, setSelectedStar] = useState<SuperstarProfile>(SUPERSTARS[0]); // Mbappé 120 OVR

  // Stadium & Lighting Customization (High-Intensity Volumetric Spotlights)
  const [lightingConfig, setLightingConfig] = useState<LightingConfig>({
    intensity: 4.2,
    colorHex: 0xfef08a,
    volumetricOpacity: 0.085,
    pitchRoughness: 0.72,
    flickerEnabled: false,
    flickerDepth: 0.2,
    flickerSpeed: 12.0,
  });

  // Test Net Shot Trigger
  const [testShotTrigger, setTestShotTrigger] = useState<{
    type: 'top_corner' | 'center';
    timestamp: number;
  } | null>(null);

  // Virtual Controls for Mobile / Touch
  const [virtualControls, setVirtualControls] = useState<PlayerControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    shootCharge: false,
    passOrTackle: false,
  });

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedGems = localStorage.getItem('fifa_gems');
    if (savedGems) setGems(parseInt(savedGems));

    const savedPounds = localStorage.getItem('fifa_pounds');
    if (savedPounds) setPounds(parseInt(savedPounds));

    const savedSkills = localStorage.getItem('fifa_owned_skills');
    if (savedSkills) {
      try { setOwnedSkills(JSON.parse(savedSkills)); } catch { localStorage.removeItem('fifa_owned_skills'); }
    }

    // Load player collection
    const savedPlayers = localStorage.getItem('fifa_players');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        setMyPlayers(parsed);
      } catch (e) {
        console.error("Failed to parse saved players", e);
      }
    } else {
      // Initialize with superstars
      setMyPlayers(getSuperstarsAsPlayers());
    }

    // Load user profile
    const savedUser = localStorage.getItem('fifa_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fifa_gems', gems.toString());
    localStorage.setItem('fifa_pounds', pounds.toString());
    localStorage.setItem('fifa_players', JSON.stringify(myPlayers));
    localStorage.setItem('fifa_owned_skills', JSON.stringify(ownedSkills));
    if (user) localStorage.setItem('fifa_user', JSON.stringify(user));
  }, [gems, pounds, myPlayers, ownedSkills, user]);

  // A completed win grants exactly 100 gems, once per match.
  useEffect(() => {
    if (stats?.isMatchFinished && stats.homeScore > stats.awayScore && rewardedMatchRef.current !== stats.matchMinutes) {
      setGems(prev => prev + 100);
      rewardedMatchRef.current = stats.matchMinutes;
    }
    if (stats && stats.matchMinutes === 0) {
      rewardedMatchRef.current = null;
    }
  }, [stats]);

  const handleStatsUpdate = useCallback((newStats: MatchStats) => {
    setStats(newStats);
  }, []);

  const handleCameraCycle = useCallback(() => {
    const modes: CameraMode[] = ['third_person', 'broadcast', 'behind_goal', 'free_orbit'];
    setCameraMode((prev) => {
      const idx = modes.indexOf(prev);
      return modes[(idx + 1) % modes.length];
    });
  }, []);

  const handleManualKickoff = useCallback(() => {
    setManualKickoffTrigger((prev) => prev + 1);
  }, []);

  const handleTriggerTestShot = useCallback((type: 'top_corner' | 'center') => {
    setTestShotTrigger({ type, timestamp: Date.now() });
  }, []);

  const handlePlayerSelect = useCallback((player: Player) => {
    setSelectedStar(playerToSuperstar(player));
    setShowPlayerCollection(false);
  }, []);

  const handlePackFound = useCallback((player: Player) => {
    setMyPlayers(previous => [...previous, player]);
    // The newly won footballer becomes the active player immediately.
    setSelectedStar(playerToSuperstar(player));
  }, []);

  const handleSpendGems = useCallback((amount: number) => {
    setGems(prev => Math.max(0, prev - amount));
  }, []);

  const handleSpendPounds = useCallback((amount: number) => {
    setPounds(prev => Math.max(0, prev - amount));
  }, []);

  const handleTrainingFinish = useCallback((earnedGems: number, earnedPounds: number) => {
    setGems(prev => prev + earnedGems);
    setPounds(prev => prev + earnedPounds);
  }, []);

  const handlePurchase = useCallback((item: { name: string; price: string; amount: number; type: 'gems' | 'pounds' }) => {
    if (item.type === 'gems') {
      setGems(prev => prev + item.amount);
    } else {
      setPounds(prev => prev + item.amount);
    }
    // In a real app, this would process payment
    console.log('Purchase completed:', item);
  }, []);

  const handleBuySkill = useCallback((skill: OwnedSkill) => {
    if (gems < 100 || ownedSkills.some(item => item.id === skill.id)) return;
    setGems(prev => prev - 100);
    setOwnedSkills(prev => [...prev, skill]);
  }, [gems, ownedSkills]);

  const handleLogin = useCallback((name: string, facebook: string) => {
    setUser({ name, facebook });
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('fifa_user');
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D Three.js Soccer Stadium & Game Engine */}
      <SoccerCanvas
        onStatsUpdate={handleStatsUpdate}
        virtualControls={virtualControls}
        cameraMode={cameraMode}
        onCameraModeChange={setCameraMode}
        triggerManualReset={manualKickoffTrigger}
        lightingConfig={lightingConfig}
        testShotTrigger={testShotTrigger}
        selectedStar={selectedStar}
        tacticsMode={tacticsMode}
        ballEdition={ballEdition}
      />

      {/* Broadcast Scoreboard HUD */}
      <ScoreboardHUD
        stats={stats}
        cameraMode={cameraMode}
        onCameraChange={setCameraMode}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onOpenStadiumStudio={() => setIsStadiumStudioOpen(true)}
        onOpenSuperstarsModal={() => setIsSuperstarsModalOpen(true)}
        onOpenBallModal={() => setIsBallModalOpen(true)}
        onOpenPlayerCollection={() => setShowPlayerCollection(true)}
        onOpenSquadSelector={() => setShowSquadSelector(true)}
        onOpenPackOpening={() => setShowPackOpening(true)}
        onOpenTrainingMode={() => setShowTrainingMode(true)}
        onOpenStore={() => setShowStore(true)}
        onOpenSkillShop={() => setShowSkillShop(true)}
        onOpenMainMenu={() => setShowMainMenu(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onManualKickoff={handleManualKickoff}
        selectedStar={selectedStar}
        tacticsMode={tacticsMode}
        onTacticsChange={setTacticsMode}
        ballEdition={ballEdition}
        gems={gems}
        pounds={pounds}
      />

      {/* Mobile / Touchscreen On-Screen Virtual Joystick & Buttons */}
      <TouchVirtualControls
        onControlsChange={setVirtualControls}
        onCameraCycle={handleCameraCycle}
        cameraMode={cameraMode}
        selectedStar={selectedStar}
      />

      {/* Goal Celebration Explosion & Banner with 120 OVR Superstar Card */}
      <GoalCelebrationOverlay
        stats={stats}
        onDismiss={handleManualKickoff}
        selectedStar={selectedStar}
        ballEdition={ballEdition}
      />

      {/* Official FIFA World Cup 2026 Ball Showcase & 3D Inspector Modal */}
      <WorldCupBallModal
        isOpen={isBallModalOpen}
        onClose={() => setIsBallModalOpen(false)}
        ballEdition={ballEdition}
        onBallEditionChange={setBallEdition}
        onTriggerTestShot={handleTriggerTestShot}
      />

      {/* Superstar Roster Modal (Mbappé, Ronaldo, Haaland, Messi, Neymar 120 OVR) */}
      <SuperstarsModal
        isOpen={isSuperstarsModalOpen}
        onClose={() => setIsSuperstarsModalOpen(false)}
        selectedStar={selectedStar}
        onSelectStar={setSelectedStar}
      />

      {/* Stadium Studio & Architecture Inspector Modal */}
      <StadiumStudioModal
        isOpen={isStadiumStudioOpen}
        onClose={() => setIsStadiumStudioOpen(false)}
        lightingConfig={lightingConfig}
        onLightingChange={setLightingConfig}
        onTriggerTestShot={handleTriggerTestShot}
        onCameraChange={setCameraMode}
        ballEdition={ballEdition}
        onBallEditionChange={setBallEdition}
        onOpenBallModal={() => setIsBallModalOpen(true)}
      />

      {/* Code & Architecture Inspector Modal (Unity C# & Three.js TS) */}
      <CodeInspectorModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Help & Controls Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Player Collection Modal */}
      <PlayerCollectionModal
        isOpen={showPlayerCollection}
        onClose={() => setShowPlayerCollection(false)}
        players={myPlayers}
        gems={gems}
        onPlayerSelect={handlePlayerSelect}
      />

      {/* Squad Selector Modal */}
      <SquadSelector3D
        isOpen={showSquadSelector}
        onClose={() => setShowSquadSelector(false)}
        players={myPlayers}
        onStartMatch={(squad) => {
          // Handle squad selection for 3D gameplay
          console.log('Starting 3D match with squad:', squad);
          // Award currency for squad selection
          setGems(prev => prev + 25);
          setPounds(prev => prev + 500);
        }}
      />

      {/* Pack Opening Modal */}
      <PackOpening3D
        isOpen={showPackOpening}
        onClose={() => setShowPackOpening(false)}
        gems={gems}
        pounds={pounds}
        onSpendGems={handleSpendGems}
        onSpendPounds={handleSpendPounds}
        onPlayerFound={handlePackFound}
      />

      {/* Training Mode Modal */}
      <TrainingMode3D
        isOpen={showTrainingMode}
        onClose={() => setShowTrainingMode(false)}
        onFinish={handleTrainingFinish}
      />

      {/* Store Modal */}
      <StoreModal
        isOpen={showStore}
        onClose={() => setShowStore(false)}
        gems={gems}
        pounds={pounds}
        onPurchase={handlePurchase}
      />

      <SkillShopModal
        isOpen={showSkillShop}
        onClose={() => setShowSkillShop(false)}
        gems={gems}
        ownedSkills={ownedSkills}
        onBuy={handleBuySkill}
      />

      {/* Main Menu */}
      <MainMenu
        isOpen={showMainMenu}
        onClose={() => setShowMainMenu(false)}
        onOpenCollection={() => {
          setShowMainMenu(false);
          setShowPlayerCollection(true);
        }}
        onOpenSquad={() => {
          setShowMainMenu(false);
          setShowSquadSelector(true);
        }}
        onOpenPacks={() => {
          setShowMainMenu(false);
          setShowPackOpening(true);
        }}
        onOpenTraining={() => {
          setShowMainMenu(false);
          setShowTrainingMode(true);
        }}
        onOpenStore={() => {
          setShowMainMenu(false);
          setShowStore(true);
        }}
        onOpenSkills={() => {
          setShowMainMenu(false);
          setShowSkillShop(true);
        }}
        onOpenSettings={() => {
          setShowMainMenu(false);
          setIsStadiumStudioOpen(true);
        }}
        onOpenHelp={() => {
          setShowMainMenu(false);
          setIsHelpModalOpen(true);
        }}
        onOpenProfile={() => {
          setShowMainMenu(false);
          setShowProfile(true);
        }}
        onResumeGame={() => {
          setShowMainMenu(false);
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        totalPlayers={myPlayers.length}
        gems={gems}
        pounds={pounds}
      />
    </main>
  );
}
