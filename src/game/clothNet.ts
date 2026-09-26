/**
 * Cloth Physics Simulation for Soccer Goal Net
 * Spring-Mass system with pinned anchor points on goal frame
 * Reacts physically when ball strikes the net, bulging and dampening the ball.
 */

import * as THREE from 'three';

export interface NetParticle {
  pos: THREE.Vector3;
  prevPos: THREE.Vector3;
  velocity: THREE.Vector3;
  originalPos: THREE.Vector3;
  isPinned: boolean;
  mass: number;
}

export interface NetSpring {
  p1: number;
  p2: number;
  restLength: number;
  stiffness: number;
}

export class ClothGoalNet {
  public mesh: THREE.Mesh;
  public particles: NetParticle[] = [];
  public springs: NetSpring[] = [];
  private widthSegments: number = 14;
  private heightSegments: number = 10;
  private depthSegments: number = 6;
  private geometry: THREE.BufferGeometry;
  private goalWidth: number;
  private goalHeight: number;
  private goalDepth: number;
  private position: THREE.Vector3;
  private isSouth: boolean;

  constructor(
    position: THREE.Vector3,
    goalWidth: number = 7.32,
    goalHeight: number = 2.44,
    goalDepth: number = 2.2,
    isSouth: boolean = false
  ) {
    this.position = position.clone();
    this.goalWidth = goalWidth;
    this.goalHeight = goalHeight;
    this.goalDepth = goalDepth;
    this.isSouth = isSouth;

    const { mesh, geometry } = this.buildNetGeometry();
    this.mesh = mesh;
    this.geometry = geometry;
  }

  private buildNetGeometry(): { mesh: THREE.Mesh; geometry: THREE.BufferGeometry } {
    // We construct a 3D box-shaped goal net with Open Front
    // Top face, Back face, Left face, Right face
    const particles: NetParticle[] = [];
    const springs: NetSpring[] = [];

    const dirZ = this.isSouth ? 1 : -1;
    const halfW = this.goalWidth / 2;
    const h = this.goalHeight;
    const d = this.goalDepth;

    // Create grid for back net (widthSegments x heightSegments)
    // and top net, side nets
    const cols = this.widthSegments + 1;
    const rows = this.heightSegments + 1;
    const depths = this.depthSegments + 1;

    // We'll create a unified particle structure:
    // 1. Back net particles (x: -halfW to halfW, y: 0 to h, z: goalDepth)
    const backIndices: number[][] = [];
    for (let r = 0; r < rows; r++) {
      backIndices[r] = [];
      const y = (r / this.heightSegments) * h;
      for (let c = 0; c < cols; c++) {
        const x = -halfW + (c / this.widthSegments) * this.goalWidth;
        const z = this.position.z + dirZ * d;
        const worldPos = new THREE.Vector3(this.position.x + x, y, z);
        
        // Pinned if on ground or side poles
        const isPinned = (r === 0) || (c === 0 && r === rows - 1) || (c === cols - 1 && r === rows - 1);
        
        const idx = particles.length;
        particles.push({
          pos: worldPos.clone(),
          prevPos: worldPos.clone(),
          velocity: new THREE.Vector3(0, 0, 0),
          originalPos: worldPos.clone(),
          isPinned: isPinned,
          mass: 0.12,
        });
        backIndices[r][c] = idx;
      }
    }

    // 2. Top net particles (x: -halfW to halfW, y: h, z: 0 to goalDepth)
    const topIndices: number[][] = [];
    for (let dep = 0; dep < depths; dep++) {
      topIndices[dep] = [];
      const zFrac = dep / this.depthSegments;
      const z = this.position.z + dirZ * (zFrac * d);
      for (let c = 0; c < cols; c++) {
        // If dep == depths - 1, reuse the top row of the back net!
        if (dep === depths - 1) {
          topIndices[dep][c] = backIndices[rows - 1][c];
          continue;
        }

        const x = -halfW + (c / this.widthSegments) * this.goalWidth;
        const worldPos = new THREE.Vector3(this.position.x + x, h, z);
        // Pinned if at front crossbar (dep === 0)
        const isPinned = (dep === 0);

        const idx = particles.length;
        particles.push({
          pos: worldPos.clone(),
          prevPos: worldPos.clone(),
          velocity: new THREE.Vector3(0, 0, 0),
          originalPos: worldPos.clone(),
          isPinned: isPinned,
          mass: 0.12,
        });
        topIndices[dep][c] = idx;
      }
    }

    // Connect structural springs for Back Net
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pCurrent = backIndices[r][c];
        // Horizontal spring
        if (c < cols - 1) {
          const pRight = backIndices[r][c + 1];
          const dist = particles[pCurrent].pos.distanceTo(particles[pRight].pos);
          springs.push({ p1: pCurrent, p2: pRight, restLength: dist, stiffness: 0.85 });
        }
        // Vertical spring
        if (r < rows - 1) {
          const pUp = backIndices[r + 1][c];
          const dist = particles[pCurrent].pos.distanceTo(particles[pUp].pos);
          springs.push({ p1: pCurrent, p2: pUp, restLength: dist, stiffness: 0.85 });
        }
        // Cross shear spring
        if (r < rows - 1 && c < cols - 1) {
          const pDiag = backIndices[r + 1][c + 1];
          const dist = particles[pCurrent].pos.distanceTo(particles[pDiag].pos);
          springs.push({ p1: pCurrent, p2: pDiag, restLength: dist, stiffness: 0.4 });
        }
      }
    }

    // Connect structural springs for Top Net
    for (let dep = 0; dep < depths; dep++) {
      for (let c = 0; c < cols; c++) {
        const pCurrent = topIndices[dep][c];
        if (c < cols - 1) {
          const pRight = topIndices[dep][c + 1];
          const dist = particles[pCurrent].pos.distanceTo(particles[pRight].pos);
          springs.push({ p1: pCurrent, p2: pRight, restLength: dist, stiffness: 0.85 });
        }
        if (dep < depths - 1) {
          const pDeeper = topIndices[dep + 1][c];
          const dist = particles[pCurrent].pos.distanceTo(particles[pDeeper].pos);
          springs.push({ p1: pCurrent, p2: pDeeper, restLength: dist, stiffness: 0.85 });
        }
      }
    }

    this.particles = particles;
    this.springs = springs;

    // Create Index Buffers for Rendering
    const indices: number[] = [];

    // Back net quads -> triangles
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const bl = backIndices[r][c];
        const br = backIndices[r][c + 1];
        const tl = backIndices[r + 1][c];
        const tr = backIndices[r + 1][c + 1];

        indices.push(bl, br, tl);
        indices.push(br, tr, tl);
        // Double-sided triangles
        indices.push(tl, br, bl);
        indices.push(tl, tr, br);
      }
    }

    // Top net quads -> triangles
    for (let dep = 0; dep < depths - 1; dep++) {
      for (let c = 0; c < cols - 1; c++) {
        const frontL = topIndices[dep][c];
        const frontR = topIndices[dep][c + 1];
        const backL = topIndices[dep + 1][c];
        const backR = topIndices[dep + 1][c + 1];

        indices.push(frontL, frontR, backL);
        indices.push(frontR, backR, backL);
        indices.push(backL, frontR, frontL);
        indices.push(backL, backR, frontR);
      }
    }

    // Build geometry
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(particles.length * 3);
    for (let i = 0; i < particles.length; i++) {
      positionArray[i * 3] = particles[i].pos.x;
      positionArray[i * 3 + 1] = particles[i].pos.y;
      positionArray[i * 3 + 2] = particles[i].pos.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Semi-transparent net wireframe / hexagonal grid material
    const material = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return { mesh, geometry };
  }

  /**
   * Physics step for the cloth goal net
   */
  public update(dt: number, ballPos: THREE.Vector3, ballRadius: number, ballVel: THREE.Vector3): boolean {
    const subSteps = 3;
    const subDt = Math.min(dt, 0.033) / subSteps;
    let netCollision = false;

    for (let s = 0; s < subSteps; s++) {
      // 1. Particle integration (Gravity + Velocity Damping)
      const gravity = -9.8 * 0.15; // light net gravity
      const damping = 0.96;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        if (p.isPinned) continue;

        // Apply restoring force towards original position to maintain goal shape
        const restoreForce = p.originalPos.clone().sub(p.pos).multiplyScalar(15.0);
        
        p.velocity.y += gravity * subDt;
        p.velocity.add(restoreForce.multiplyScalar(subDt));
        p.velocity.multiplyScalar(damping);

        // Verlet / Euler pos update
        p.pos.add(p.velocity.clone().multiplyScalar(subDt));

        // Ball Collision against Net Particles
        const distToBall = p.pos.distanceTo(ballPos);
        const collisionRadius = ballRadius + 0.15;
        if (distToBall < collisionRadius) {
          netCollision = true;
          // Push net particle outwards
          const pushDir = p.pos.clone().sub(ballPos).normalize();
          const penetration = collisionRadius - distToBall;
          p.pos.add(pushDir.clone().multiplyScalar(penetration * 0.8));
          p.velocity.add(pushDir.multiplyScalar(penetration * 20));

          // Retard ball velocity
          ballVel.multiplyScalar(0.92);
          ballVel.y *= 0.9;
        }
      }

      // 2. Spring constraints relaxation (Gauss-Seidel)
      for (let iter = 0; iter < 2; iter++) {
        for (let i = 0; i < this.springs.length; i++) {
          const sp = this.springs[i];
          const p1 = this.particles[sp.p1];
          const p2 = this.particles[sp.p2];

          const delta = p2.pos.clone().sub(p1.pos);
          const currentDist = delta.length();
          if (currentDist < 0.0001) continue;

          const error = currentDist - sp.restLength;
          const correction = delta.normalize().multiplyScalar(error * 0.5 * sp.stiffness);

          if (!p1.isPinned && !p2.isPinned) {
            p1.pos.add(correction);
            p2.pos.sub(correction);
          } else if (!p1.isPinned) {
            p1.pos.add(correction.multiplyScalar(2));
          } else if (!p2.isPinned) {
            p2.pos.sub(correction.multiplyScalar(2));
          }
        }
      }
    }

    // Update Three.js buffer geometry positions
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < this.particles.length; i++) {
      array[i * 3] = this.particles[i].pos.x;
      array[i * 3 + 1] = this.particles[i].pos.y;
      array[i * 3 + 2] = this.particles[i].pos.z;
    }
    posAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();

    return netCollision;
  }

  public reset() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].pos.copy(this.particles[i].originalPos);
      this.particles[i].velocity.set(0, 0, 0);
    }
    const posAttr = this.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    for (let i = 0; i < this.particles.length; i++) {
      array[i * 3] = this.particles[i].originalPos.x;
      array[i * 3 + 1] = this.particles[i].originalPos.y;
      array[i * 3 + 2] = this.particles[i].originalPos.z;
    }
    posAttr.needsUpdate = true;
  }
}
