/**
 * 3D Fireworks & Confetti Celebration Particle System
 * Launches high-altitude explosive fireworks with colorful particle sparks,
 * gravity fallout, trailing sparks, and falling stadium confetti.
 */

import * as THREE from 'three';
import { soundEngine } from './audio';

interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export class FireworksManager {
  public group: THREE.Group;
  private particles: Particle[] = [];
  private maxParticles: number = 1800;
  private pointsMesh: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private positions: Float32Array;
  private colors: Float32Array;
  private isCelebrating: boolean = false;
  private launchTimer: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // Particle material with soft circle glow
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTex = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.pointsMesh = new THREE.Points(this.geometry, material);
    this.group.add(this.pointsMesh);
  }

  /**
   * Triggers grand celebration with sequential firework rockets
   */
  public triggerCelebration(originZ: number = -52.5) {
    this.isCelebrating = true;
    this.launchTimer = 0;

    // Immediately explode 2 shells
    this.explodeShell(new THREE.Vector3(-12, 28, originZ - 6));
    this.explodeShell(new THREE.Vector3(12, 28, originZ - 6));
    soundEngine.playFireworkBoom();

    // Staggered explosions over the next 4 seconds
    for (let i = 1; i <= 6; i++) {
      setTimeout(() => {
        if (!this.isCelebrating) return;
        const rx = (Math.random() - 0.5) * 40;
        const ry = 22 + Math.random() * 15;
        const rz = originZ + (Math.random() - 0.5) * 20;
        this.explodeShell(new THREE.Vector3(rx, ry, rz));
        soundEngine.playFireworkBoom();
      }, i * 500);
    }
  }

  public stopCelebration() {
    this.isCelebrating = false;
  }

  /**
   * Explodes a single shell into ~150 spherical sparkling particles
   */
  public explodeShell(center: THREE.Vector3) {
    const palette = [
      new THREE.Color('#fbbf24'), // Gold
      new THREE.Color('#ef4444'), // Crimson
      new THREE.Color('#38bdf8'), // Sky Blue
      new THREE.Color('#22c55e'), // Emerald
      new THREE.Color('#f43f5e'), // Rose
      new THREE.Color('#a855f7'), // Purple
    ];
    const baseColor = palette[Math.floor(Math.random() * palette.length)];
    const count = 160;

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 8.0 + Math.random() * 16.0;

      const vel = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed,
        Math.cos(phi) * speed
      );

      // Color variation
      const pColor = baseColor.clone();
      pColor.offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1);

      this.particles.push({
        pos: center.clone(),
        vel: vel,
        color: pColor,
        size: 1.8 + Math.random() * 1.5,
        alpha: 1.0,
        life: 0,
        maxLife: 1.4 + Math.random() * 0.8,
      });
    }
  }

  public update(dt: number) {
    const clampedDt = Math.min(dt, 0.05);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += clampedDt;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Gravity and air drag
      p.vel.y -= 12.0 * clampedDt;
      p.vel.multiplyScalar(0.96);
      p.pos.add(p.vel.clone().multiplyScalar(clampedDt));
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    }

    // Update Three.js buffer attributes
    const count = this.particles.length;
    for (let i = 0; i < this.maxParticles; i++) {
      if (i < count) {
        const p = this.particles[i];
        this.positions[i * 3] = p.pos.x;
        this.positions[i * 3 + 1] = p.pos.y;
        this.positions[i * 3 + 2] = p.pos.z;

        // Modulate color by alpha
        this.colors[i * 3] = p.color.r * p.alpha;
        this.colors[i * 3 + 1] = p.color.g * p.alpha;
        this.colors[i * 3 + 2] = p.color.b * p.alpha;
      } else {
        this.positions[i * 3] = 0;
        this.positions[i * 3 + 1] = -100;
        this.positions[i * 3 + 2] = 0;
        this.colors[i * 3] = 0;
        this.colors[i * 3 + 1] = 0;
        this.colors[i * 3 + 2] = 0;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }
}
