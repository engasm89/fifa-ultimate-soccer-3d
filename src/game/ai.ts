/**
 * AI Opponents & Goalkeeper System
 * - Intelligent Goalkeeper: lateral tracking, diving saves, shot deflection
 * - Opponent Defender: zonal marking, chasing the player, defensive pressure
 */

import * as THREE from 'three';
import { SoccerBall, BALL_RADIUS } from './physics';
import { GOAL_HEIGHT, GOAL_WIDTH, PITCH_LENGTH } from './stadium';
import { soundEngine } from './audio';

export class GoalkeeperAI {
  public group: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, -PITCH_LENGTH / 2 + 1.2);
  public isDiving: boolean = false;
  private diveTimer: number = 0;
  private goalLineZ: number = -PITCH_LENGTH / 2 + 1.0;
  private leftArm: THREE.Mesh;
  private rightArm: THREE.Mesh;
  private bodyMesh: THREE.Group;

  constructor() {
    const { group, bodyMesh, leftArm, rightArm } = this.buildGoalkeeperMesh();
    this.group = group;
    this.bodyMesh = bodyMesh;
    this.leftArm = leftArm;
    this.rightArm = rightArm;
    this.reset();
  }

  private buildGoalkeeperMesh() {
    const group = new THREE.Group();
    const bodyMesh = new THREE.Group();
    group.add(bodyMesh);

    // Goalkeeper jersey (Neon Green / Cyan for visibility)
    const jerseyMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.7 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.3), jerseyMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    bodyMesh.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    head.position.y = 1.65;
    head.castShadow = true;
    bodyMesh.add(head);

    // Shorts & Legs
    const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.35, 0.28), shortsMat);
    shorts.position.y = 0.85;
    bodyMesh.add(shorts);

    const legGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.7, 8);
    const leftLeg = new THREE.Mesh(legGeom, skinMat);
    leftLeg.position.set(-0.16, 0.35, 0);
    leftLeg.castShadow = true;
    bodyMesh.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, skinMat);
    rightLeg.position.set(0.16, 0.35, 0);
    rightLeg.castShadow = true;
    bodyMesh.add(rightLeg);

    // Arms with oversized Goalie Gloves
    const armGeom = new THREE.CylinderGeometry(0.07, 0.06, 0.45, 8);
    const leftArm = new THREE.Mesh(armGeom, skinMat);
    leftArm.position.set(-0.35, 1.3, 0);
    bodyMesh.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, skinMat);
    rightArm.position.set(0.35, 1.3, 0);
    bodyMesh.add(rightArm);

    // Gloves
    const gloveGeom = new THREE.BoxGeometry(0.14, 0.16, 0.12);
    const leftGlove = new THREE.Mesh(gloveGeom, gloveMat);
    leftGlove.position.set(-0.35, 1.05, 0);
    bodyMesh.add(leftGlove);

    const rightGlove = new THREE.Mesh(gloveGeom, gloveMat);
    rightGlove.position.set(0.35, 1.05, 0);
    bodyMesh.add(rightGlove);

    // Shadow
    const shadowMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 16),
      new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.5 })
    );
    shadowMesh.rotateX(-Math.PI / 2);
    shadowMesh.position.y = 0.02;
    group.add(shadowMesh);

    return { group, bodyMesh, leftArm, rightArm };
  }

  public reset() {
    this.position.set(0, 0, this.goalLineZ);
    this.isDiving = false;
    this.diveTimer = 0;
    this.group.position.copy(this.position);
    this.group.rotation.set(0, 0, 0);
    this.bodyMesh.position.set(0, 0, 0);
    this.bodyMesh.rotation.set(0, 0, 0);
  }

  public update(dt: number, ball: SoccerBall) {
    const clampedDt = Math.min(dt, 0.05);

    if (this.isDiving) {
      this.diveTimer -= clampedDt;
      if (this.diveTimer <= 0) {
        this.isDiving = false;
        // Return to upright stance
        this.bodyMesh.position.set(0, 0, 0);
        this.bodyMesh.rotation.set(0, 0, 0);
      }
      return;
    }

    const halfW = GOAL_WIDTH / 2 - 0.5;
    const isBallApproaching = ball.velocity.z < -4 && ball.position.z < -10;

    if (isBallApproaching) {
      // Predict intersection with goal plane
      const timeToGoal = Math.abs((this.goalLineZ - ball.position.z) / (ball.velocity.z || -1));
      const predictedX = ball.position.x + ball.velocity.x * timeToGoal;
      const targetX = THREE.MathUtils.clamp(predictedX, -halfW, halfW);

      // Dive if fast shot and distance is substantial
      const distToTarget = Math.abs(this.position.x - targetX);
      if (distToTarget > 1.2 && timeToGoal < 0.8) {
        this.dive(targetX > this.position.x ? 'right' : 'left', targetX);
      } else {
        // Shuffle laterally to block
        this.position.x = THREE.MathUtils.lerp(this.position.x, targetX, clampedDt * 8);
      }
    } else {
      // General tracking of ball position
      const idealX = THREE.MathUtils.clamp(ball.position.x * 0.35, -halfW * 0.7, halfW * 0.7);
      this.position.x = THREE.MathUtils.lerp(this.position.x, idealX, clampedDt * 3.5);
    }

    this.group.position.copy(this.position);

    // Collision check between goalkeeper and ball (Save!)
    const distToBall = this.position.distanceTo(ball.position);
    if (distToBall < 1.4 && ball.position.z < -PITCH_LENGTH / 2 + 3) {
      // Save deflected!
      const deflectVel = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        4 + Math.random() * 4,
        14 + Math.random() * 6
      );
      ball.velocity.copy(deflectVel);
      soundEngine.playKick(0.7);
    }
  }

  private dive(dir: 'left' | 'right', targetX: number) {
    this.isDiving = true;
    this.diveTimer = 1.0;
    this.position.x = targetX;
    const sign = dir === 'right' ? 1 : -1;
    this.bodyMesh.rotation.z = -sign * 1.2; // Sideways dive pose
    this.bodyMesh.position.y = 0.4;
  }
}

export class OpponentDefenderAI {
  public group: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, -22);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private homePos: THREE.Vector3 = new THREE.Vector3(0, 0, -22);

  constructor() {
    const { group } = this.buildDefenderMesh();
    this.group = group;
    this.reset();
  }

  private buildDefenderMesh() {
    const group = new THREE.Group();

    // Crimson jersey for away team
    const jerseyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.3), jerseyMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    head.position.y = 1.62;
    head.castShadow = true;
    group.add(head);

    const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.35, 0.28), shortsMat);
    shorts.position.y = 0.85;
    group.add(shorts);

    const legGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.7, 8);
    const leftLeg = new THREE.Mesh(legGeom, skinMat);
    leftLeg.position.set(-0.16, 0.35, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, skinMat);
    rightLeg.position.set(0.16, 0.35, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    const shadowMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.45, 16),
      new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.5 })
    );
    shadowMesh.rotateX(-Math.PI / 2);
    shadowMesh.position.y = 0.02;
    group.add(shadowMesh);

    return { group };
  }

  public reset() {
    this.position.copy(this.homePos);
    this.velocity.set(0, 0, 0);
    this.group.position.copy(this.position);
  }

  public update(dt: number, ball: SoccerBall, playerPos: THREE.Vector3) {
    const clampedDt = Math.min(dt, 0.05);

    // Defender decision logic:
    // If player crosses halfway line (z < 10), defender moves to close down and press!
    let targetPos: THREE.Vector3;
    const playerInDangerousZone = playerPos.z < 12;

    if (playerInDangerousZone) {
      // Position between player and goal
      const toGoal = new THREE.Vector3(0, 0, -PITCH_LENGTH / 2).sub(playerPos).normalize();
      targetPos = playerPos.clone().add(toGoal.multiplyScalar(2.0));
      targetPos.y = 0;
    } else {
      // Guard defensive zone
      targetPos = this.homePos.clone();
      targetPos.x = ball.position.x * 0.4;
    }

    const moveDir = targetPos.clone().sub(this.position);
    const dist = moveDir.length();

    if (dist > 0.4) {
      moveDir.normalize();
      const speed = playerInDangerousZone ? 4.8 : 3.0;
      this.velocity.lerp(moveDir.multiplyScalar(speed), clampedDt * 5);
      this.position.add(this.velocity.clone().multiplyScalar(clampedDt));
      this.group.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
    } else {
      this.velocity.set(0, 0, 0);
    }

    this.group.position.copy(this.position);

    // Tackle check: If ball is very close to defender, poke it away!
    const distToBall = this.position.distanceTo(ball.position);
    if (distToBall < 1.3 && ball.lastKicker === 'player') {
      const tackleImpulse = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        2.5,
        12 + Math.random() * 4
      );
      ball.applyKick(tackleImpulse, 0, 'opponent');
    }
  }
}
