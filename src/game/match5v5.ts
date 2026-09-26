/**
 * 5 vs 5 Football Team Match Engine
 * Manages 10 players on the pitch:
 * Home Team (5): User Captain (#10), Striker (#9), Midfielder (#8), Defender (#4), Goalkeeper (#1)
 * Away Team (5): Striker (#9), Winger (#11), Midfielder (#10), Defender (#3), Goalkeeper (#1)
 */

import * as THREE from 'three';
import { SoccerBall, BALL_RADIUS } from './physics';
import { PITCH_LENGTH, PITCH_WIDTH, GOAL_WIDTH } from './stadium';
import { soundEngine } from './audio';

export type TeamSide = 'home' | 'away';
export type PlayerRole = 'striker' | 'midfielder' | 'defender' | 'goalkeeper';
export type TacticsMode = 'all_out_attack' | 'balanced' | 'defensive';

export interface Player5v5Info {
  id: string;
  name: string;
  number: number;
  team: TeamSide;
  role: PlayerRole;
  position: THREE.Vector3;
  hasBall: boolean;
}

export class AIPlayer5v5 {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public rotationY: number = 0;
  public team: TeamSide;
  public role: PlayerRole;
  public name: string;
  public number: number;
  public homeAnchor: THREE.Vector3;
  public hasBall: boolean = false;

  // Falling / Tackle physics ("يقعون على الأرض")
  public isFallen: boolean = false;
  public fallTimer: number = 0;

  private bodyMesh: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private torsoMesh: THREE.Mesh;
  private animTimer: number = Math.random() * 10;
  private kickCooldown: number = 0;
  private passCooldown: number = 0;

  constructor(
    id: string,
    name: string,
    number: number,
    team: TeamSide,
    role: PlayerRole,
    startPos: THREE.Vector3
  ) {
    this.name = name;
    this.number = number;
    this.team = team;
    this.role = role;
    this.position = startPos.clone();
    this.homeAnchor = startPos.clone();

    const { group, bodyMesh, leftLeg, rightLeg, leftArm, rightArm, torsoMesh } = this.buildMesh(team, number);
    this.group = group;
    this.bodyMesh = bodyMesh;
    this.leftLeg = leftLeg;
    this.rightLeg = rightLeg;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.torsoMesh = torsoMesh;

    this.group.position.copy(this.position);
    this.rotationY = team === 'home' ? -Math.PI : 0;
    this.group.rotation.y = this.rotationY;
  }

  public tripAndFall(duration: number = 0.95) {
    if (this.isFallen) return;
    this.isFallen = true;
    this.fallTimer = duration;
    this.velocity.multiplyScalar(0.2);
    this.hasBall = false;
    soundEngine.playKick(0.4);
  }

  private buildMesh(team: TeamSide, num: number) {
    const group = new THREE.Group();
    const bodyMesh = new THREE.Group();
    group.add(bodyMesh);

    const isHome = team === 'home';
    const isGoalie = this.role === 'goalkeeper';

    const jerseyColor = isGoalie ? (isHome ? 0x06b6d4 : 0x10b981) : (isHome ? 0xeab308 : 0xef4444);
    const shortsColor = isHome ? 0x1e3a8a : 0x1e293b;
    const skinColor = 0xd4a373;
    const bootColor = isHome ? 0x10b981 : 0xf97316;

    const jerseyMat = new THREE.MeshStandardMaterial({ color: jerseyColor, roughness: 0.5 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: shortsColor, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.7 });
    const bootMat = new THREE.MeshStandardMaterial({ color: bootColor, roughness: 0.3 });

    // Torso
    const torsoGeom = new THREE.BoxGeometry(0.55, 0.65, 0.3);
    const torsoMesh = new THREE.Mesh(torsoGeom, jerseyMat);
    torsoMesh.position.y = 1.15;
    torsoMesh.castShadow = true;
    bodyMesh.add(torsoMesh);

    // Number Badge on Jersey
    const badgeGeom = new THREE.PlaneGeometry(0.24, 0.24);
    badgeGeom.rotateY(Math.PI);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 90px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${num}`, 64, 64);
    const numTex = new THREE.CanvasTexture(canvas);
    const numMesh = new THREE.Mesh(badgeGeom, new THREE.MeshBasicMaterial({ map: numTex, transparent: true }));
    numMesh.position.set(0, 1.2, 0.16);
    bodyMesh.add(numMesh);

    // Shorts
    const shortsMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.35, 0.28), shortsMat);
    shortsMesh.position.y = 0.85;
    shortsMesh.castShadow = true;
    bodyMesh.add(shortsMesh);

    // Head
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    headMesh.position.y = 1.62;
    headMesh.castShadow = true;
    bodyMesh.add(headMesh);

    // Hair
    const hairMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 })
    );
    hairMesh.position.y = 1.64;
    bodyMesh.add(hairMesh);

    // Legs
    const createLeg = (isRight: boolean) => {
      const leg = new THREE.Group();
      leg.position.set(isRight ? 0.16 : -0.16, 0.75, 0);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 8), skinMat);
      thigh.position.y = -0.19;
      thigh.castShadow = true;
      leg.add(thigh);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 8), skinMat);
      shin.position.y = -0.52;
      shin.castShadow = true;
      leg.add(shin);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.24), bootMat);
      boot.position.set(0, -0.72, 0.05);
      boot.castShadow = true;
      leg.add(boot);

      return leg;
    };

    const leftLeg = createLeg(false);
    const rightLeg = createLeg(true);
    bodyMesh.add(leftLeg);
    bodyMesh.add(rightLeg);

    // Arms
    const createArm = (isRight: boolean) => {
      const arm = new THREE.Group();
      arm.position.set(isRight ? 0.35 : -0.35, 1.4, 0);

      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8), jerseyMat);
      sleeve.position.y = -0.1;
      arm.add(sleeve);

      const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.35, 8), skinMat);
      limb.position.y = -0.32;
      limb.castShadow = true;
      arm.add(limb);

      return arm;
    };

    const leftArm = createArm(false);
    const rightArm = createArm(true);
    bodyMesh.add(leftArm);
    bodyMesh.add(rightArm);

    // Drop Shadow
    const shadowMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.45, 16),
      new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.5, depthWrite: false })
    );
    shadowMesh.rotateX(-Math.PI / 2);
    shadowMesh.position.y = 0.02;
    group.add(shadowMesh);

    return { group, bodyMesh, leftLeg, rightLeg, leftArm, rightArm, torsoMesh };
  }

  public reset() {
    this.position.copy(this.homeAnchor);
    this.velocity.set(0, 0, 0);
    this.hasBall = false;
    this.isFallen = false;
    this.fallTimer = 0;
    this.bodyMesh.position.set(0, 0, 0);
    this.bodyMesh.rotation.set(0, 0, 0);
    this.rotationY = this.team === 'home' ? -Math.PI : 0;
    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }

  public update(
    dt: number,
    ball: SoccerBall,
    userPlayerPos: THREE.Vector3,
    allPlayers: AIPlayer5v5[],
    tacticsMode: TacticsMode = 'all_out_attack'
  ) {
    const clampedDt = Math.min(dt, 0.05);

    // If player has tripped or been tackled ("يقعون على الأرض")
    if (this.isFallen) {
      this.fallTimer -= clampedDt;
      if (this.fallTimer <= 0) {
        this.isFallen = false;
        this.bodyMesh.position.set(0, 0, 0);
        this.bodyMesh.rotation.set(0, 0, 0);
      } else {
        this.bodyMesh.position.y = -0.62;
        this.bodyMesh.rotation.x = -Math.PI / 2.3;
        this.bodyMesh.rotation.z = 0.25;
        this.velocity.multiplyScalar(0.9);
        this.position.add(this.velocity.clone().multiplyScalar(clampedDt));
        this.group.position.copy(this.position);
        return;
      }
    }

    this.kickCooldown -= clampedDt;
    this.passCooldown -= clampedDt;

    const isHome = this.team === 'home';
    const opponentGoalZ = isHome ? -PITCH_LENGTH / 2 : PITCH_LENGTH / 2;
    const ownGoalZ = isHome ? PITCH_LENGTH / 2 : -PITCH_LENGTH / 2;

    const distToBall = this.position.distanceTo(ball.position);

    // Ball Possession check
    if (distToBall < 1.4 && ball.position.y < 1.0 && this.kickCooldown <= 0) {
      this.hasBall = true;
      ball.lastKicker = isHome ? 'player' : 'opponent';

      // Keep ball at feet
      const forwardDir = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
      const targetBallPos = this.position.clone().add(forwardDir.multiplyScalar(0.7));
      targetBallPos.y = BALL_RADIUS;
      ball.position.lerp(targetBallPos, clampedDt * 8);

      // AI Decision: Shoot or Pass!
      const distToOppGoal = Math.abs(this.position.z - opponentGoalZ);

      // 1. If close to goal, take a shot!
      if (distToOppGoal < 26) {
        const shotTarget = new THREE.Vector3((Math.random() - 0.5) * 5, 1.2, opponentGoalZ);
        const shotDir = shotTarget.sub(this.position).normalize();
        shotDir.y = 0.25;
        const shotVel = shotDir.multiplyScalar(22 + Math.random() * 8);
        ball.applyKick(shotVel, (Math.random() - 0.5) * 1.5, isHome ? 'player' : 'opponent');
        this.hasBall = false;
        this.kickCooldown = 1.5;
      }
      // 2. If Home teammate and user player is open and forward, pass to User!
      else if (isHome && this.passCooldown <= 0) {
        const toUser = userPlayerPos.clone().sub(this.position);
        if (toUser.z < 0 && toUser.length() < 24) {
          // Crisp ground pass to user!
          toUser.y = 0.05;
          const passVel = toUser.normalize().multiplyScalar(15.0);
          ball.applyKick(passVel, 0, 'player');
          this.hasBall = false;
          this.passCooldown = 2.0;
        }
      }
      // 3. Otherwise, dribble toward opponent goal
      else {
        const toOppGoal = new THREE.Vector3(0, 0, opponentGoalZ).sub(this.position).normalize();
        this.velocity.lerp(toOppGoal.multiplyScalar(5.5), clampedDt * 6);
      }
    } else {
      this.hasBall = false;

      // Locomotion when NOT holding the ball:
      let targetPos = this.homeAnchor.clone();

      if (this.role === 'goalkeeper') {
        // Guard goal line
        const halfGoalW = GOAL_WIDTH / 2 - 0.5;
        const targetX = THREE.MathUtils.clamp(ball.position.x * 0.4, -halfGoalW, halfGoalW);
        targetPos.set(targetX, 0, ownGoalZ + (isHome ? -1.2 : 1.2));
      } else {
        // Outfield role behaviors
        const isBallInMyHalf = isHome ? ball.position.z > 0 : ball.position.z < 0;
        const isBallNearMe = distToBall < 18;

        if (isBallNearMe && !this.hasBall) {
          // Pressure / chase ball
          targetPos.copy(ball.position);
          targetPos.y = 0;
        } else {
          // Shift formation with play
          const shiftZ = (ball.position.z - targetPos.z) * 0.35;
          targetPos.z = THREE.MathUtils.clamp(this.homeAnchor.z + shiftZ, -PITCH_LENGTH / 2 + 5, PITCH_LENGTH / 2 - 5);
          targetPos.x = THREE.MathUtils.clamp(this.homeAnchor.x + (ball.position.x - this.homeAnchor.x) * 0.25, -PITCH_WIDTH / 2 + 4, PITCH_WIDTH / 2 - 4);
        }
      }

      const moveDir = targetPos.clone().sub(this.position);
      const dist = moveDir.length();

      if (dist > 0.4) {
        moveDir.normalize();
        const speed = distToBall < 10 ? 5.8 : 3.8;
        this.velocity.lerp(moveDir.multiplyScalar(speed), clampedDt * 5);
      } else {
        this.velocity.set(0, 0, 0);
      }
    }

    // Apply movement
    this.position.add(this.velocity.clone().multiplyScalar(clampedDt));
    this.position.x = THREE.MathUtils.clamp(this.position.x, -PITCH_WIDTH / 2 + 1, PITCH_WIDTH / 2 - 1);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -PITCH_LENGTH / 2 + 1, PITCH_LENGTH / 2 - 1);

    // Rotation
    if (this.velocity.lengthSq() > 0.1) {
      const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
      let diff = targetAngle - this.rotationY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.rotationY += diff * clampedDt * 10;
    }

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;

    // Running limb animation
    const isMoving = this.velocity.length() > 0.2;
    if (isMoving) {
      this.animTimer += clampedDt * 11;
      const legSwing = Math.sin(this.animTimer) * 0.65;
      const armSwing = Math.sin(this.animTimer + Math.PI) * 0.5;
      this.leftLeg.rotation.x = legSwing;
      this.rightLeg.rotation.x = -legSwing;
      this.leftArm.rotation.x = armSwing;
      this.rightArm.rotation.x = -armSwing;
    } else {
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
    }
  }

  /**
   * Receive pass from User Captain
   */
  public receivePass(ball: SoccerBall) {
    const toMe = this.position.clone().sub(ball.position).normalize();
    toMe.y = 0.05;
    ball.applyKick(toMe.multiplyScalar(16.0), 0, this.team === 'home' ? 'player' : 'opponent');
  }
}

/**
 * 5v5 Match Manager: Creates both teams, manages player tracking and radar coordinates
 */
export class Match5v5System {
  public group: THREE.Group;
  public homePlayers: AIPlayer5v5[] = []; // 4 AI + User = 5 total
  public awayPlayers: AIPlayer5v5[] = []; // 5 AI
  public tacticsMode: TacticsMode = 'all_out_attack';

  constructor() {
    this.group = new THREE.Group();
    this.initTeams();
  }

  public setTactics(mode: TacticsMode) {
    this.tacticsMode = mode;
  }

  private initTeams() {
    // 1. Home Teammates (Yellow/Blue Kits):
    // Striker #9
    const homeStriker = new AIPlayer5v5('h9', 'المهاجم (سامي)', 9, 'home', 'striker', new THREE.Vector3(-8, 0, -14));
    // Midfielder #8
    const homeMid = new AIPlayer5v5('h8', 'الوسط (طارق)', 8, 'home', 'midfielder', new THREE.Vector3(12, 0, 5));
    // Defender #4
    const homeDef = new AIPlayer5v5('h4', 'المدافع (عمر)', 4, 'home', 'defender', new THREE.Vector3(-4, 0, 26));
    // Goalkeeper #1 (South Goal)
    const homeGK = new AIPlayer5v5('h1', 'الحارس (فارس)', 1, 'home', 'goalkeeper', new THREE.Vector3(0, 0, PITCH_LENGTH / 2 - 1.2));

    this.homePlayers = [homeStriker, homeMid, homeDef, homeGK];
    this.homePlayers.forEach((p) => this.group.add(p.group));

    // 2. Away Team (Crimson/Dark Kits):
    // Striker #9
    const awayStriker = new AIPlayer5v5('a9', 'مهاجم الخصم', 9, 'away', 'striker', new THREE.Vector3(6, 0, 14));
    // Winger #11
    const awayWinger = new AIPlayer5v5('a11', 'جناح الخصم', 11, 'away', 'midfielder', new THREE.Vector3(-14, 0, 4));
    // Playmaker #10
    const awayMid = new AIPlayer5v5('a10', 'صانع الألعاب', 10, 'away', 'midfielder', new THREE.Vector3(4, 0, -10));
    // Defender #3
    const awayDef = new AIPlayer5v5('a3', 'المدافع الصلب', 3, 'away', 'defender', new THREE.Vector3(-6, 0, -28));
    // Goalkeeper #1 (North Goal)
    const awayGK = new AIPlayer5v5('a1', 'حارس المرمى', 1, 'away', 'goalkeeper', new THREE.Vector3(0, 0, -PITCH_LENGTH / 2 + 1.2));

    this.awayPlayers = [awayStriker, awayWinger, awayMid, awayDef, awayGK];
    this.awayPlayers.forEach((p) => this.group.add(p.group));
  }

  public resetAll() {
    this.homePlayers.forEach((p) => p.reset());
    this.awayPlayers.forEach((p) => p.reset());
  }

  public update(dt: number, ball: SoccerBall, userPlayerPos: THREE.Vector3) {
    const all = [...this.homePlayers, ...this.awayPlayers];
    this.homePlayers.forEach((p) => p.update(dt, ball, userPlayerPos, all, this.tacticsMode));
    this.awayPlayers.forEach((p) => p.update(dt, ball, userPlayerPos, all, this.tacticsMode));
  }

  /**
   * Find closest open home teammate in front of user to pass the ball to
   */
  public passToBestTeammate(userPos: THREE.Vector3, ball: SoccerBall): boolean {
    let bestTeammate: AIPlayer5v5 | null = null;
    let bestScore = -9999;

    for (const mate of this.homePlayers) {
      if (mate.role === 'goalkeeper') continue;
      const toMate = mate.position.clone().sub(userPos);
      const dist = toMate.length();
      if (dist < 3.0 || dist > 35.0) continue;

      // Prefer teammate who is forward (towards opponent goal, z < 0)
      const forwardScore = -toMate.z * 1.5;
      const distanceScore = 30 - dist;
      const totalScore = forwardScore + distanceScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestTeammate = mate;
      }
    }

    if (bestTeammate) {
      bestTeammate.receivePass(ball);
      soundEngine.playKick(0.6);
      return true;
    }
    return false;
  }

  /**
   * Returns positions of all players for the Radar Mini-Map
   */
  public getAllPlayerRadarPositions(userPos: THREE.Vector3): { x: number; z: number; team: TeamSide; isUser?: boolean }[] {
    const list: { x: number; z: number; team: TeamSide; isUser?: boolean }[] = [
      { x: userPos.x, z: userPos.z, team: 'home', isUser: true },
    ];
    this.homePlayers.forEach((p) => list.push({ x: p.position.x, z: p.position.z, team: 'home' }));
    this.awayPlayers.forEach((p) => list.push({ x: p.position.x, z: p.position.z, team: 'away' }));
    return list;
  }
}
