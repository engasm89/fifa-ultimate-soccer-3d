/**
 * Realistic Rigidbody Physics Engine for 3D Soccer Ball
 * - Gravity, velocity integration, angular rotation (rolling)
 * - Ground bounce restitution & friction
 * - Magnus effect curve physics (aerodynamic spin)
 * - Goal post & crossbar cylindrical collision detection
 * - Goal net collision damping
 * - Visual ball trail for powerful shots
 */

import * as THREE from 'three';
import { GOAL_HEIGHT, GOAL_WIDTH, PITCH_LENGTH, PITCH_WIDTH } from './stadium';
import { soundEngine } from './audio';
import { ClothGoalNet } from './clothNet';
import { getWorldCup2026BallTextures, WorldCupBallEdition } from './worldCupBall2026';

export const BALL_RADIUS = 0.22; // Regulation size 5

export interface BallPhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  isGrounded: boolean;
  speedKmh: number;
}

export class SoccerBall {
  public mesh: THREE.Mesh;
  public shadowMesh: THREE.Mesh;
  public trail: THREE.Line;
  public trailPoints: THREE.Vector3[] = [];
  public position: THREE.Vector3 = new THREE.Vector3(0, BALL_RADIUS, 0);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public angularVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public spin: THREE.Vector3 = new THREE.Vector3(0, 0, 0); // Magnus spin vector
  public isGrounded: boolean = true;
  public lastKicker: 'player' | 'opponent' | null = null;
  public edition: WorldCupBallEdition = 'trionda_official';

  private gravity: number = -9.81 * 2.2; // Game feel gravity
  private restitution: number = 0.65;    // Bounce elasticity
  private rollingFriction: number = 0.988;
  private airFriction: number = 0.995;
  private spinCurveMultiplier: number = 0.12;
  private trailMax: number = 18;

  constructor(edition: WorldCupBallEdition = 'trionda_official') {
    this.edition = edition;
    const { mesh, shadowMesh } = this.buildBallMesh(edition);
    this.mesh = mesh;
    this.shadowMesh = shadowMesh;

    // Shot trail line
    const trailGeom = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(this.trailMax * 3);
    trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.LineBasicMaterial({
      color: edition === 'trionda_final' ? 0xfbbf24 : 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    this.trail = new THREE.Line(trailGeom, trailMat);

    this.reset(0, 0);
  }

  private buildBallMesh(edition: WorldCupBallEdition): { mesh: THREE.Mesh; shadowMesh: THREE.Mesh } {
    const { diffuseMap, bumpMap, roughnessMap } = getWorldCup2026BallTextures(edition);

    const ballGeom = new THREE.SphereGeometry(BALL_RADIUS, 48, 48);
    const ballMat = new THREE.MeshStandardMaterial({
      map: diffuseMap,
      bumpMap: bumpMap,
      bumpScale: 0.032, // Aerodynamic seams and thermo-bonded dimples depth
      roughnessMap: roughnessMap,
      roughness: edition === 'trionda_final' ? 0.35 : 0.28,
      metalness: edition === 'trionda_final' ? 0.45 : 0.12,
    });

    const mesh = new THREE.Mesh(ballGeom, ballMat);
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    // Contact drop shadow on pitch
    const shadowGeom = new THREE.CircleGeometry(BALL_RADIUS * 1.35, 24);
    shadowGeom.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.position.y = 0.02;

    return { mesh, shadowMesh };
  }

  public setEdition(newEdition: WorldCupBallEdition) {
    if (this.edition === newEdition) return;
    this.edition = newEdition;
    const { diffuseMap, bumpMap, roughnessMap } = getWorldCup2026BallTextures(newEdition);
    const mat = this.mesh.material as THREE.MeshStandardMaterial;
    mat.map = diffuseMap;
    mat.bumpMap = bumpMap;
    mat.bumpScale = 0.032;
    mat.roughnessMap = roughnessMap;
    mat.roughness = newEdition === 'trionda_final' ? 0.35 : 0.28;
    mat.metalness = newEdition === 'trionda_final' ? 0.45 : 0.12;
    mat.needsUpdate = true;

    // Trail color update
    (this.trail.material as THREE.LineBasicMaterial).color.setHex(
      newEdition === 'trionda_final' ? 0xfbbf24 : 0x38bdf8
    );
  }

  public reset(x: number = 0, z: number = 0) {
    this.position.set(x, BALL_RADIUS, z);
    this.velocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0, 0);
    this.spin.set(0, 0, 0);
    this.isGrounded = true;
    this.mesh.position.copy(this.position);
    this.shadowMesh.position.set(x, 0.02, z);
    this.trailPoints = [];
  }

  /**
   * Applies an impulse force to the ball (Kick / Pass / Shoot)
   */
  public applyKick(impulse: THREE.Vector3, spinAmount: number = 0, kicker: 'player' | 'opponent' = 'player') {
    this.velocity.copy(impulse);
    this.lastKicker = kicker;
    this.isGrounded = false;

    // Angular velocity for rolling + spin
    this.spin.set(0, spinAmount, 0);
    this.angularVelocity.set(
      -impulse.z * 1.5,
      spinAmount * 12,
      impulse.x * 1.5
    );

    // Audio thud based on power
    soundEngine.playKick(impulse.length() / 25);
  }

  /**
   * Physics Integration Step
   */
  public update(dt: number, northNet: ClothGoalNet, southNet: ClothGoalNet): { goalScored: 'north' | 'south' | null; touchlineOut: boolean } {
    const clampedDt = Math.min(dt, 0.05);

    // 1. Magnus Effect: Ball curves in air due to spin
    if (!this.isGrounded && Math.abs(this.spin.y) > 0.01) {
      // Curve force is perpendicular to horizontal velocity: F = omega x V
      const curveForce = new THREE.Vector3(-this.velocity.z, 0, this.velocity.x).normalize();
      curveForce.multiplyScalar(this.spin.y * this.velocity.length() * this.spinCurveMultiplier);
      this.velocity.add(curveForce.multiplyScalar(clampedDt));
      this.spin.y *= 0.98; // spin decay
    }

    // 2. Gravity
    if (!this.isGrounded) {
      this.velocity.y += this.gravity * clampedDt;
      this.velocity.multiplyScalar(this.airFriction);
    } else {
      // Ground rolling friction
      this.velocity.x *= this.rollingFriction;
      this.velocity.z *= this.rollingFriction;
      if (this.velocity.length() < 0.02) {
        this.velocity.set(0, 0, 0);
      }
    }

    // 3. Position integration
    this.position.add(this.velocity.clone().multiplyScalar(clampedDt));

    // 4. Ground Collision & Restitution
    if (this.position.y <= BALL_RADIUS) {
      this.position.y = BALL_RADIUS;

      if (Math.abs(this.velocity.y) > 0.8) {
        // Bounce
        this.velocity.y = -this.velocity.y * this.restitution;
        this.isGrounded = false;
        // Small bounce sound
        if (Math.abs(this.velocity.y) > 2) {
          soundEngine.playKick(0.2);
        }
      } else {
        this.velocity.y = 0;
        this.isGrounded = true;
      }
    } else {
      this.isGrounded = false;
    }

    // 5. Angular Rotation from Movement
    if (this.velocity.lengthSq() > 0.001) {
      const rollDist = this.velocity.length() * clampedDt;
      const angle = rollDist / BALL_RADIUS;
      const rollAxis = new THREE.Vector3(-this.velocity.z, 0, this.velocity.x).normalize();
      this.mesh.rotateOnWorldAxis(rollAxis, angle);
    }

    // 6. Goal Post & Crossbar Cylindrical Collision Detection
    this.checkGoalCollisions();

    // 7. Goal Net Cloth Interaction
    const northHit = northNet.update(clampedDt, this.position, BALL_RADIUS, this.velocity);
    const southHit = southNet.update(clampedDt, this.position, BALL_RADIUS, this.velocity);
    if (northHit || southHit) {
      soundEngine.playNetRustle();
    }

    // Keep ball within back of net boundaries
    const halfGoalW = GOAL_WIDTH / 2;
    if (Math.abs(this.position.x) < halfGoalW + 0.2) {
      // Inside north net
      if (this.position.z < -PITCH_LENGTH / 2 && this.position.z > -PITCH_LENGTH / 2 - 2.5) {
        if (this.position.z < -PITCH_LENGTH / 2 - 2.2) {
          this.position.z = -PITCH_LENGTH / 2 - 2.2;
          this.velocity.z = -this.velocity.z * 0.2;
        }
      }
      // Inside south net
      if (this.position.z > PITCH_LENGTH / 2 && this.position.z < PITCH_LENGTH / 2 + 2.5) {
        if (this.position.z > PITCH_LENGTH / 2 + 2.2) {
          this.position.z = PITCH_LENGTH / 2 + 2.2;
          this.velocity.z = -this.velocity.z * 0.2;
        }
      }
    }

    // The ball is out once it completely crosses a touchline.
    const touchlineOut = Math.abs(this.position.x) > PITCH_WIDTH / 2 + BALL_RADIUS * 0.25;

    // 8. Update Three.js mesh positions
    this.mesh.position.copy(this.position);

    // Update Drop Shadow (scale and opacity adapt to ball height)
    this.shadowMesh.position.x = this.position.x;
    this.shadowMesh.position.z = this.position.z;
    const heightFactor = Math.max(0, 1 - (this.position.y - BALL_RADIUS) / 4);
    this.shadowMesh.scale.setScalar(1 + (this.position.y - BALL_RADIUS) * 0.4);
    (this.shadowMesh.material as THREE.MeshBasicMaterial).opacity = 0.45 * heightFactor;

    // 9. Update Trail
    this.updateTrail();

    // 10. Goal Detection Trigger
    const goalScored = this.checkGoalScored();

    return { goalScored, touchlineOut };
  }

  /**
   * Collision response against posts and crossbar
   */
  private checkGoalCollisions() {
    const postR = 0.12;
    const collisionDist = BALL_RADIUS + postR;
    const halfW = GOAL_WIDTH / 2;
    const goalsZ = [-PITCH_LENGTH / 2, PITCH_LENGTH / 2];

    for (const gz of goalsZ) {
      // Check left and right vertical posts
      const postsX = [-halfW, halfW];
      for (const px of postsX) {
        if (this.position.y < GOAL_HEIGHT + postR) {
          const dx = this.position.x - px;
          const dz = this.position.z - gz;
          const dist2D = Math.sqrt(dx * dx + dz * dz);
          if (dist2D < collisionDist) {
            // Collision normal
            const nx = dx / (dist2D || 1);
            const nz = dz / (dist2D || 1);
            this.position.x = px + nx * collisionDist;
            this.position.z = gz + nz * collisionDist;

            // Reflect velocity
            const dot = this.velocity.x * nx + this.velocity.z * nz;
            if (dot < 0) {
              this.velocity.x -= 1.8 * dot * nx;
              this.velocity.z -= 1.8 * dot * nz;
              soundEngine.playPostHit();
            }
          }
        }
      }

      // Check horizontal crossbar (x between -halfW and halfW, y = GOAL_HEIGHT, z = gz)
      if (Math.abs(this.position.x) <= halfW + postR) {
        const dy = this.position.y - GOAL_HEIGHT;
        const dz = this.position.z - gz;
        const distYZ = Math.sqrt(dy * dy + dz * dz);
        if (distYZ < collisionDist) {
          const ny = dy / (distYZ || 1);
          const nz = dz / (distYZ || 1);
          this.position.y = GOAL_HEIGHT + ny * collisionDist;
          this.position.z = gz + nz * collisionDist;

          const dot = this.velocity.y * ny + this.velocity.z * nz;
          if (dot < 0) {
            this.velocity.y -= 1.8 * dot * ny;
            this.velocity.z -= 1.8 * dot * nz;
            soundEngine.playPostHit();
          }
        }
      }
    }
  }

  /**
   * Detects if ball has fully crossed goal line inside the goal posts
   */
  private checkGoalScored(): 'north' | 'south' | null {
    const halfW = GOAL_WIDTH / 2;
    // Inside horizontal and vertical post boundaries
    const insidePosts = Math.abs(this.position.x) < halfW - 0.1;
    const belowBar = this.position.y < GOAL_HEIGHT;

    if (insidePosts && belowBar) {
      // North Goal (Opponent Goal: Player scores here)
      if (this.position.z < -PITCH_LENGTH / 2 - BALL_RADIUS && this.position.z > -PITCH_LENGTH / 2 - 2.5) {
        return 'north';
      }
      // South Goal (Home Goal)
      if (this.position.z > PITCH_LENGTH / 2 + BALL_RADIUS && this.position.z < PITCH_LENGTH / 2 + 2.5) {
        return 'south';
      }
    }
    return null;
  }

  private updateTrail() {
    const speed = this.velocity.length();
    if (speed > 8) {
      this.trailPoints.unshift(this.position.clone());
      if (this.trailPoints.length > this.trailMax) {
        this.trailPoints.pop();
      }
    } else {
      if (this.trailPoints.length > 0) {
        this.trailPoints.pop();
      }
    }

    const posAttr = this.trail.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < this.trailMax; i++) {
      const pt = this.trailPoints[i] || (this.trailPoints.length > 0 ? this.trailPoints[this.trailPoints.length - 1] : this.position);
      array[i * 3] = pt.x;
      array[i * 3 + 1] = pt.y;
      array[i * 3 + 2] = pt.z;
    }
    posAttr.needsUpdate = true;
    (this.trail.material as THREE.LineBasicMaterial).opacity = Math.min(speed / 30, 0.75);
  }

  public getSpeedKmh(): number {
    return Math.round(this.velocity.length() * 3.6);
  }
}
