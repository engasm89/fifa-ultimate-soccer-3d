/**
 * Main 3D Three.js Soccer Canvas Component
 * Manages WebGL rendering, camera rigs, input devices, and game loop
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildLegendaryStadium, StadiumSetup } from './stadium';
import { SoccerBall } from './physics';
import { SoccerPlayer, PlayerControls } from './player';
import { GoalkeeperAI, OpponentDefenderAI } from './ai';
import { Match5v5System, TacticsMode } from './match5v5';
import { FireworksManager } from './fireworks';
import { GameManager, MatchStats, CameraMode } from './GameManager';
import { soundEngine } from './audio';

import { SuperstarProfile } from './superstars';
import { WorldCupBallEdition } from './worldCupBall2026';
import { CelebrationId } from '../components/CelebrationShopModal';

export interface LightingConfig {
  intensity: number;
  colorHex: number;
  volumetricOpacity: number;
  pitchRoughness: number;
  flickerEnabled?: boolean;
  flickerDepth?: number;
  flickerSpeed?: number;
}

interface SoccerCanvasProps {
  onStatsUpdate: (stats: MatchStats) => void;
  virtualControls?: PlayerControls;
  cameraMode: CameraMode;
  onCameraModeChange?: (mode: CameraMode) => void;
  triggerManualReset?: number;
  lightingConfig?: LightingConfig;
  testShotTrigger?: { type: 'top_corner' | 'center'; timestamp: number } | null;
  selectedStar?: SuperstarProfile;
  tacticsMode?: TacticsMode;
  ballEdition?: WorldCupBallEdition;
  speedBoostUnlocked?: boolean;
  celebrationStyle?: CelebrationId;
}

export const SoccerCanvas: React.FC<SoccerCanvasProps> = ({
  onStatsUpdate,
  virtualControls,
  cameraMode,
  onCameraModeChange,
  triggerManualReset,
  lightingConfig,
  testShotTrigger,
  selectedStar,
  tacticsMode = 'all_out_attack',
  ballEdition = 'trionda_official',
  speedBoostUnlocked = false,
  celebrationStyle = 'classic',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep across renders
  const gameManagerRef = useRef<GameManager | null>(null);
  const ballRef = useRef<SoccerBall | null>(null);
  const playerRef = useRef<SoccerPlayer | null>(null);
  const keeperRef = useRef<GoalkeeperAI | null>(null);
  const defenderRef = useRef<OpponentDefenderAI | null>(null);
  const match5v5Ref = useRef<Match5v5System | null>(null);
  const stadiumRef = useRef<StadiumSetup | null>(null);
  const fireworksRef = useRef<FireworksManager | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Keep latest virtualControls in ref for real-time zero-latency reading
  const virtualControlsRef = useRef<PlayerControls | undefined>(virtualControls);
  virtualControlsRef.current = virtualControls;

  // Keyboard controls
  const keyControlsRef = useRef<PlayerControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    shootCharge: false,
    passOrTackle: false,
  });

  // Track camera angle for movement translation
  const cameraAngleRef = useRef<number>(0);

  // Orbit camera drag state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngle = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI,
    phi: Math.PI / 4,
    radius: 35,
  });

  useEffect(() => { playerRef.current?.setSpeedBoostUnlocked(speedBoostUnlocked); }, [speedBoostUnlocked]);
  useEffect(() => { playerRef.current?.setGoalCelebrationStyle(celebrationStyle); }, [celebrationStyle]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer (Super Bright Stadium Illumination)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1b36); // Luminous twilight stadium sky
    scene.fog = new THREE.Fog(0x0e1b36, 120, 360); // Clean, sharp distant falloff without obscuring grandstands

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 450);
    camera.position.set(0, 8, 25);
    cameraRef.current = camera;

    const lowPowerDevice = window.matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 4) <= 4;
    const renderer = new THREE.WebGLRenderer({ antialias: !lowPowerDevice, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerDevice ? 1 : 1.5));
    renderer.shadowMap.enabled = !lowPowerDevice;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38; // Rich, vivid, crystal bright
    container.appendChild(renderer.domElement);

    // 2. Build Stadium & Environment
    const stadium = buildLegendaryStadium();
    scene.add(stadium.group);
    stadiumRef.current = stadium;

    // 3. Soccer Ball (FIFA World Cup 2026 - TRIONDA)
    const ball = new SoccerBall(ballEdition);
    scene.add(ball.mesh);
    scene.add(ball.shadowMesh);
    scene.add(ball.trail);
    ballRef.current = ball;

    // 4. Soccer Player
    const player = new SoccerPlayer(true);
    player.setSpeedBoostUnlocked(speedBoostUnlocked);
    player.setGoalCelebrationStyle(celebrationStyle);
    scene.add(player.group);
    playerRef.current = player;

    // 5. 5 vs 5 Teams (Home 5 players, Away 5 players)
    const match5v5 = new Match5v5System();
    scene.add(match5v5.group);
    match5v5Ref.current = match5v5;

    // Goalkeeper AI & Defender AI
    const keeper = new GoalkeeperAI();
    scene.add(keeper.group);
    keeperRef.current = keeper;

    const defender = new OpponentDefenderAI();
    scene.add(defender.group);
    defenderRef.current = defender;

    // 6. Fireworks & Particles
    const fireworks = new FireworksManager();
    scene.add(fireworks.group);
    fireworksRef.current = fireworks;

    // 7. Game Manager
    const gameManager = new GameManager();
    // Rendering and physics run at display rate; React only needs HUD state ~10 times/sec.
    let lastHudUpdate = 0;
    gameManager.onStatsChange = (stats) => {
      const now = performance.now();
      if (now - lastHudUpdate >= 100 || stats.isGoalScored || stats.isKickoffCountdown || stats.isMatchFinished) {
        lastHudUpdate = now;
        onStatsUpdate(stats);
      }
    };
    gameManagerRef.current = gameManager;

    // Play kickoff whistle
    soundEngine.init();
    soundEngine.playWhistle(false);

    // Keyboard Listeners (Supports English, Arabic layout, and Arrow keys)
    const onKeyDown = (e: KeyboardEvent) => {
      soundEngine.init(); // User gesture unlocks AudioContext
      const c = keyControlsRef.current;
      const k = e.key;

      if (e.code === 'KeyW' || e.code === 'ArrowUp' || k === 'w' || k === 'W' || k === 'ص' || k === 'ArrowUp') {
        c.forward = true;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown' || k === 's' || k === 'S' || k === 'س' || k === 'ArrowDown') {
        c.backward = true;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'ش' || k === 'ArrowLeft') {
        c.left = true;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight' || k === 'd' || k === 'D' || k === 'ي' || k === 'ArrowRight') {
        c.right = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || k === 'Shift') {
        c.sprint = true;
      }
      if (e.code === 'Space' || k === ' ') {
        c.shootCharge = true;
      }
      if (e.code === 'KeyF' || e.code === 'KeyE' || k === 'f' || k === 'F' || k === 'e' || k === 'E' || k === 'ب' || k === 'ث') {
        c.passOrTackle = true;
      }
      if (e.code === 'KeyC' || k === 'c' || k === 'C' || k === 'ؤ') {
        if (onCameraModeChange && gameManagerRef.current) {
          const nextMode = gameManagerRef.current.cycleCameraMode();
          onCameraModeChange(nextMode);
        }
      }
      if (e.code === 'KeyR' || k === 'r' || k === 'R' || k === 'ق') {
        if (gameManagerRef.current) {
          gameManagerRef.current.manualKickoff(ball, player, keeper, defender, fireworks);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const c = keyControlsRef.current;
      const k = e.key;

      if (e.code === 'KeyW' || e.code === 'ArrowUp' || k === 'w' || k === 'W' || k === 'ص' || k === 'ArrowUp') {
        c.forward = false;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown' || k === 's' || k === 'S' || k === 'س' || k === 'ArrowDown') {
        c.backward = false;
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'ش' || k === 'ArrowLeft') {
        c.left = false;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight' || k === 'd' || k === 'D' || k === 'ي' || k === 'ArrowRight') {
        c.right = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || k === 'Shift') {
        c.sprint = false;
      }
      if (e.code === 'Space' || k === ' ') {
        c.shootCharge = false;
      }
      if (e.code === 'KeyF' || e.code === 'KeyE' || k === 'f' || k === 'F' || k === 'e' || k === 'E' || k === 'ب' || k === 'ث') {
        c.passOrTackle = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    const clearKeyboardControls = () => {
      keyControlsRef.current = { forward: false, backward: false, left: false, right: false, sprint: false, shootCharge: false, passOrTackle: false };
    };
    window.addEventListener('blur', clearKeyboardControls);

    // Mouse Drag for Orbit Camera
    const onMouseDown = (e: MouseEvent) => {
      soundEngine.init();
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };

      orbitAngle.current.theta -= deltaX * 0.008;
      orbitAngle.current.phi = THREE.MathUtils.clamp(
        orbitAngle.current.phi - deltaY * 0.008,
        0.1,
        Math.PI / 2.1
      );
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      orbitAngle.current.radius = THREE.MathUtils.clamp(
        orbitAngle.current.radius + e.deltaY * 0.04,
        10,
        90
      );
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // Window Resize
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // 8. Main Render & Physics Loop
    const clock = new THREE.Clock();
    let animId: number;
    let pageHidden = document.hidden;
    const onVisibilityChange = () => {
      pageHidden = document.hidden;
      // Discard hidden-tab elapsed time so returning children do not see a physics jump.
      clock.getDelta();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (pageHidden) return;

      // Keep player movement responsive during short frame drops without huge simulation jumps.
      const dt = Math.min(clock.getDelta(), 0.08);
      const elapsedTime = clock.getElapsedTime();

      const vc = virtualControlsRef.current;
      const activeControls: PlayerControls = {
        forward: keyControlsRef.current.forward || !!vc?.forward,
        backward: keyControlsRef.current.backward || !!vc?.backward,
        left: keyControlsRef.current.left || !!vc?.left,
        right: keyControlsRef.current.right || !!vc?.right,
        sprint: keyControlsRef.current.sprint || !!vc?.sprint,
        shootCharge: keyControlsRef.current.shootCharge || !!vc?.shootCharge,
        passOrTackle: keyControlsRef.current.passOrTackle || !!vc?.passOrTackle,
        analogX: vc?.analogX,
        analogZ: vc?.analogZ,
        analogMagnitude: vc?.analogMagnitude,
      };

      // Compute camera-relative horizontal vectors so Left/Right/Up/Down is 100% natural and responsive
      const camForward = new THREE.Vector3();
      camera.getWorldDirection(camForward);
      camForward.y = 0;
      if (camForward.lengthSq() > 0.001) {
        camForward.normalize();
      } else {
        camForward.set(0, 0, -1);
      }
      const camRight = new THREE.Vector3(-camForward.z, 0, camForward.x).normalize();

      // 1. Update Player (camera-relative steering & analog touch speed)
      player.update(dt, activeControls, ball, 0, camForward, camRight);

      // 2. Update 5 vs 5 Match Teams
      match5v5.update(dt, ball, player.position);

      // Pass mechanics: If user presses pass button/F while in possession, pass to best open teammate
      if (activeControls.passOrTackle && player.hasBallControl) {
        match5v5.passToBestTeammate(player.position, ball);
      }

      // Slide tackle collisions & falling dynamics ("يقعون على الأرض"):
      if (player.isFalling && player.fallType === 'slide_tackle') {
        match5v5.awayPlayers.forEach((opp) => {
          if (opp.position.distanceTo(player.position) < 1.9 && !opp.isFallen) {
            opp.tripAndFall(1.1);
          }
        });
      }

      // Physical challenge with Opponent Defender:
      const distToDef = player.position.distanceTo(defender.position);
      if (distToDef < 1.3 && !player.isFalling && defender.velocity.length() > 3.6) {
        player.triggerFall('tripped', 0.85);
      }

      // 3. Update Goalkeeper & Opponent Defender
      keeper.update(dt, ball);
      defender.update(dt, ball, player.position);

      // 4. Update Match Game Manager (with 5v5 radar tracking)
      const radarPlayers = match5v5.getAllPlayerRadarPositions(player.position);
      gameManager.update(dt, ball, player, keeper, defender, stadium, fireworks, radarPlayers);

      // 4. Update Crowd, Stadium Lighting & Fireworks
      stadium.updateCrowd(elapsedTime);
      stadium.updateLighting(elapsedTime);
      fireworks.update(dt);

      // 5. Update Dynamic Camera Views
      updateCameraRig(camera, cameraMode, player, ball, orbitAngle.current, dt);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeyboardControls);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Game Manager camera mode when prop changes
  useEffect(() => {
    if (gameManagerRef.current) {
      gameManagerRef.current.setCameraMode(cameraMode);
    }
  }, [cameraMode]);

  // Handle manual kickoff / reset from outside button
  useEffect(() => {
    if (triggerManualReset && triggerManualReset > 0 && gameManagerRef.current && ballRef.current && playerRef.current && keeperRef.current && defenderRef.current && fireworksRef.current) {
      gameManagerRef.current.manualKickoff(ballRef.current, playerRef.current, keeperRef.current, defenderRef.current, fireworksRef.current);
      match5v5Ref.current?.resetAll();
    }
  }, [triggerManualReset]);

  // Handle dynamic lighting changes from Stadium Studio
  useEffect(() => {
    if (!lightingConfig || !stadiumRef.current) return;
    stadiumRef.current.setFloodlightIntensity(lightingConfig.intensity);
    stadiumRef.current.setFloodlightColor(lightingConfig.colorHex);
    stadiumRef.current.setVolumetricOpacity(lightingConfig.volumetricOpacity);
    stadiumRef.current.setPitchRoughness(lightingConfig.pitchRoughness);
    stadiumRef.current.setFlickerConfig(
      lightingConfig.flickerEnabled ?? false,
      lightingConfig.flickerDepth ?? 0.2,
      lightingConfig.flickerSpeed ?? 12.0
    );
  }, [lightingConfig]);

  // Handle selected superstar changes (Mbappé, Ronaldo, Haaland, Messi, Neymar)
  useEffect(() => {
    if (selectedStar && playerRef.current) {
      playerRef.current.setSuperstar(selectedStar);
    }
  }, [selectedStar]);

  // Handle tactics mode changes (All-Out Attack, Balanced, Defensive)
  useEffect(() => {
    if (tacticsMode && match5v5Ref.current) {
      match5v5Ref.current.setTactics(tacticsMode);
    }
  }, [tacticsMode]);

  // Handle FIFA World Cup 2026 ball edition changes (Trionda Official / Trionda Final)
  useEffect(() => {
    if (ballRef.current && ballEdition) {
      ballRef.current.setEdition(ballEdition);
    }
  }, [ballEdition]);

  // Handle test shot directly into the net
  useEffect(() => {
    if (!testShotTrigger || !ballRef.current) return;
    const ball = ballRef.current;
    soundEngine.init();

    if (testShotTrigger.type === 'top_corner') {
      // Place ball at 24 meters out, strike with 28 m/s into top corner!
      ball.reset(0, -32);
      const target = new THREE.Vector3(-2.8, 2.1, -52.5);
      const toTarget = target.clone().sub(ball.position);
      const timeOfFlight = 0.8;
      const vx = toTarget.x / timeOfFlight;
      const vz = toTarget.z / timeOfFlight;
      const vy = (toTarget.y - 0.5 * (-9.81 * 2.2) * timeOfFlight * timeOfFlight) / timeOfFlight;

      ball.applyKick(new THREE.Vector3(vx, vy, vz), -1.2, 'player');
    } else {
      // Powerful driven shot into center of net
      ball.reset(0, -32);
      const target = new THREE.Vector3(0, 1.2, -52.5);
      const toTarget = target.clone().sub(ball.position);
      const timeOfFlight = 0.75;
      const vx = toTarget.x / timeOfFlight;
      const vz = toTarget.z / timeOfFlight;
      const vy = (toTarget.y - 0.5 * (-9.81 * 2.2) * timeOfFlight * timeOfFlight) / timeOfFlight;

      ball.applyKick(new THREE.Vector3(vx, vy, vz), 0, 'player');
    }
  }, [testShotTrigger]);

  return <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing select-none" />;
};

/**
 * Intelligent Cinematic Camera Director
 * Smooth, stable, attack-oriented view without wild rotational camera spinning
 */
function updateCameraRig(
  camera: THREE.PerspectiveCamera,
  mode: CameraMode,
  player: SoccerPlayer,
  ball: SoccerBall,
  orbit: { theta: number; phi: number; radius: number },
  dt: number
) {
  const lerpFactor = Math.min(dt * 6.0, 1.0);

  if (mode === 'third_person') {
    // Stable, cinematic behind-the-player camera aligned with the field of play
    // Completely eliminates camera spin / disorientation when turning right or left!
    const targetOffset = new THREE.Vector3(0, 5.2, 9.4);
    const targetCamPos = new THREE.Vector3(
      player.position.x * 0.8 + targetOffset.x,
      player.position.y + targetOffset.y,
      player.position.z + targetOffset.z
    );

    camera.position.lerp(targetCamPos, lerpFactor);

    // Look at point slightly in front of player towards opponent goal
    const lookTarget = new THREE.Vector3(
      player.position.x * 0.9,
      1.2,
      player.position.z - 6.5
    );
    camera.lookAt(lookTarget);
  } else if (mode === 'broadcast') {
    // Elevated sideline TV broadcast camera providing panoramic stadium bowl view
    const camX = 52;
    const camY = 26;
    const camZ = ball.position.z * 0.6;
    const targetCamPos = new THREE.Vector3(camX, camY, camZ);

    camera.position.lerp(targetCamPos, lerpFactor * 0.85);

    const lookTarget = ball.position.clone();
    lookTarget.y = 0.5;
    camera.lookAt(lookTarget);
  } else if (mode === 'behind_goal') {
    // Elevated Behind-the-Goal dramatic camera looking into the pitch and South stand
    const targetCamPos = new THREE.Vector3(ball.position.x * 0.25, 4.5, -63);
    camera.position.lerp(targetCamPos, lerpFactor * 0.7);

    const lookTarget = new THREE.Vector3(ball.position.x * 0.5, 1.0, -25);
    camera.lookAt(lookTarget);
  } else if (mode === 'free_orbit') {
    // Spherical orbital camera centered around the ball
    const x = ball.position.x + orbit.radius * Math.sin(orbit.phi) * Math.sin(orbit.theta);
    const y = ball.position.y + orbit.radius * Math.cos(orbit.phi);
    const z = ball.position.z + orbit.radius * Math.sin(orbit.phi) * Math.cos(orbit.theta);

    camera.position.lerp(new THREE.Vector3(x, y, z), lerpFactor);
    camera.lookAt(ball.position.x, 1.2, ball.position.z);
  }
}
