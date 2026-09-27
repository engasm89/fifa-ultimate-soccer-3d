/**
 * Match Game Manager
 * Controls match time, scores, goal trigger events, kickoff reset,
 * possession tracking, camera modes, and audio-visual synchronization.
 */

import * as THREE from 'three';
import { SoccerBall } from './physics';
import { SoccerPlayer } from './player';
import { GoalkeeperAI, OpponentDefenderAI } from './ai';
import { FireworksManager } from './fireworks';
import { PITCH_LENGTH, PITCH_WIDTH, StadiumSetup } from './stadium';
import { soundEngine } from './audio';

export type CameraMode = 'third_person' | 'broadcast' | 'behind_goal' | 'free_orbit';

export interface MatchStats {
  homeScore: number;
  awayScore: number;
  matchMinutes: number;
  matchSeconds: number;
  isGoalScored: boolean;
  goalScorer: string;
  shotSpeedKmh: number;
  homePossession: number;
  totalShots: number;
  cameraMode: CameraMode;
  isKickoffCountdown: boolean;
  countdownSeconds: number;
  stamina: number;
  shotPower: number;
  hasBallControl: boolean;
  isMatchFinished: boolean;
  radarPlayers?: { x: number; z: number; team: 'home' | 'away'; isUser?: boolean }[];
  radarBall?: { x: number; z: number };
}

export class GameManager {
  public homeScore: number = 0;
  public awayScore: number = 0;
  public matchTime: number = 0; // in simulated seconds (0 to 5400 = 90 mins)
  public isGoalScored: boolean = false;
  public goalScorer: string = '';
  public lastShotSpeedKmh: number = 0;
  public cameraMode: CameraMode = 'third_person';
  public totalShots: number = 0;
  public homeTouches: number = 0;
  public awayTouches: number = 0;
  public isMatchFinished: boolean = false;

  private goalCelebrationTimer: number = 0;
  private isKickoffCountdown: boolean = false;
  private countdownSeconds: number = 3;
  private countdownTimer: number = 0;

  // External listeners
  public onStatsChange?: (stats: MatchStats) => void;

  constructor() {
    this.resetMatch();
  }

  public resetMatch() {
    this.homeScore = 0;
    this.awayScore = 0;
    this.matchTime = 0;
    this.isGoalScored = false;
    this.totalShots = 0;
    this.homeTouches = 1;
    this.awayTouches = 1;
    this.isMatchFinished = false;
  }

  public setCameraMode(mode: CameraMode) {
    this.cameraMode = mode;
  }

  public cycleCameraMode(): CameraMode {
    const modes: CameraMode[] = ['third_person', 'broadcast', 'behind_goal', 'free_orbit'];
    const idx = modes.indexOf(this.cameraMode);
    this.cameraMode = modes[(idx + 1) % modes.length];
    return this.cameraMode;
  }

  /**
   * Called on every game frame
   */
  public update(
    dt: number,
    ball: SoccerBall,
    player: SoccerPlayer,
    keeper: GoalkeeperAI,
    defender: OpponentDefenderAI,
    stadium: StadiumSetup,
    fireworks: FireworksManager,
    radarPlayers?: { x: number; z: number; team: 'home' | 'away'; isUser?: boolean }[]
  ) {
    const clampedDt = Math.min(dt, 0.05);

    // Track possession
    if (player.hasBallControl) {
      this.homeTouches += clampedDt;
    } else if (ball.position.z < 0) {
      this.awayTouches += clampedDt * 0.4;
    }

    // Match Clock (1 real second = 10 match seconds -> 9 min full match)
    if (!this.isGoalScored && !this.isKickoffCountdown && !this.isMatchFinished) {
      this.matchTime += clampedDt * 10;
      if (this.matchTime >= 5400) {
        this.matchTime = 5400;
        this.isMatchFinished = true;
        soundEngine.playWhistle(false);
      }
    }

    // Goal scored trigger handling
    const ballResult = ball.update(clampedDt, stadium.northNet, stadium.southNet);
    const goalScored = ballResult.goalScored;
    if (ballResult.touchlineOut && !this.isGoalScored && !this.isKickoffCountdown) {
      this.restartFromTouchline(ball);
    }

    if (goalScored && !this.isGoalScored) {
      this.handleGoalScored(goalScored, ball, stadium, fireworks);
    }

    // Goal Celebration sequence
    if (this.isGoalScored) {
      this.goalCelebrationTimer -= clampedDt;
      if (this.goalCelebrationTimer <= 0) {
        this.startKickoffSequence(ball, player, keeper, defender, fireworks);
      }
    }

    // Kickoff countdown
    if (this.isKickoffCountdown) {
      this.countdownTimer -= clampedDt;
      this.countdownSeconds = Math.ceil(this.countdownTimer);
      if (this.countdownTimer <= 0) {
        this.isKickoffCountdown = false;
        soundEngine.playWhistle(false);
      }
    }

    // Dispatch stats
    const totalPossessionTime = this.homeTouches + this.awayTouches || 1;
    const homePossession = Math.round((this.homeTouches / totalPossessionTime) * 100);

    const matchMins = Math.floor(this.matchTime / 60);
    const matchSecs = Math.floor(this.matchTime % 60);

    if (this.onStatsChange) {
      this.onStatsChange({
        homeScore: this.homeScore,
        awayScore: this.awayScore,
        matchMinutes: matchMins,
        matchSeconds: matchSecs,
        isGoalScored: this.isGoalScored,
        goalScorer: this.goalScorer,
        shotSpeedKmh: this.lastShotSpeedKmh,
        homePossession: homePossession,
        totalShots: this.totalShots,
        cameraMode: this.cameraMode,
        isKickoffCountdown: this.isKickoffCountdown,
        countdownSeconds: this.countdownSeconds,
        stamina: Math.round(player.stamina),
        shotPower: player.shotPower,
        hasBallControl: player.hasBallControl,
        isMatchFinished: this.isMatchFinished,
        radarPlayers: radarPlayers,
        radarBall: { x: ball.position.x, z: ball.position.z },
      });
    }
  }

  private handleGoalScored(
    goal: 'north' | 'south',
    ball: SoccerBall,
    stadium: StadiumSetup,
    fireworks: FireworksManager
  ) {
    this.isGoalScored = true;
    this.goalCelebrationTimer = 4.5; // 4.5s celebration
    this.lastShotSpeedKmh = Math.max(78, ball.getSpeedKmh());
    this.totalShots++;

    if (goal === 'north') {
      // Home Goal scored!
      this.homeScore++;
      this.goalScorer = 'الأسطورة رقم 10 (الكابتن)';
    } else {
      this.awayScore++;
      this.goalScorer = 'الصقر الملكي';
    }

    // Trigger stadium strobe, fireworks, and roaring celebration audio
    stadium.triggerStrobe();
    fireworks.triggerCelebration(goal === 'north' ? -52.5 : 52.5);
    soundEngine.playGoalRoar();
  }

  /** Restarts play from the sideline for the team that did not put the ball out. */
  private restartFromTouchline(ball: SoccerBall) {
    const side = Math.sign(ball.position.x) || 1;
    const z = THREE.MathUtils.clamp(ball.position.z, -PITCH_LENGTH / 2 + 4, PITCH_LENGTH / 2 - 4);
    const recipient = ball.lastKicker === 'player' ? 'opponent' : 'player';
    ball.reset(side * (PITCH_WIDTH / 2 - 0.55), z);
    ball.applyKick(new THREE.Vector3(-side * 9, 1.4, recipient === 'opponent' ? 2.8 : -2.8), 0, recipient);
  }

  private startKickoffSequence(
    ball: SoccerBall,
    player: SoccerPlayer,
    keeper: GoalkeeperAI,
    defender: OpponentDefenderAI,
    fireworks: FireworksManager
  ) {
    this.isGoalScored = false;
    fireworks.stopCelebration();

    // Reset ball and players to kickoff (السنترة)
    ball.reset(0, 0);
    player.reset(0, 5); // Just behind center circle
    keeper.reset();
    defender.reset();

    this.isKickoffCountdown = true;
    this.countdownTimer = 3.0;
    this.countdownSeconds = 3;
    soundEngine.playWhistle(false);
  }

  /**
   * Manual kickoff trigger by player
   */
  public manualKickoff(
    ball: SoccerBall,
    player: SoccerPlayer,
    keeper: GoalkeeperAI,
    defender: OpponentDefenderAI,
    fireworks: FireworksManager
  ) {
    this.startKickoffSequence(ball, player, keeper, defender, fireworks);
  }
}
