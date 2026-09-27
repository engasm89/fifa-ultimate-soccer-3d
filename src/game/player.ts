/**
 * 3D Third Person Soccer Player Controller & Mechanics
 * - Anatomically detailed athletic player model with realistic facial features, hair,
 *   authentic soccer kit (ribbed collar, club badge, detailed boots with studs, socks, shorts)
 * - Analog Touch Joystick control: speed and direction smoothly mapped to finger displacement
 * - Smooth turning with athletic banking/lean into turns
 * - Dynamic Dribbling: ball stays glued to player's feet with micro-touches
 * - Power-Charged Shooting with aiming arrow and curl
 * - Slide tackles & ground passes with physical collisions
 */

import * as THREE from 'three';
import { SoccerBall, BALL_RADIUS } from './physics';
import { PITCH_LENGTH, PITCH_WIDTH } from './stadium';
import { SUPERSTARS, SuperstarProfile } from './superstars';
import { soundEngine } from './audio';

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  shootCharge: boolean;
  passOrTackle: boolean;
  analogX?: number; // -1.0 (left) to +1.0 (right)
  analogZ?: number; // -1.0 (forward) to +1.0 (backward)
  analogMagnitude?: number; // 0.0 to 1.0
}

export class SoccerPlayer {
  public group: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 15);
  public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public rotationY: number = -Math.PI; // Facing north towards opponent goal
  public currentLean: number = 0; // Dynamic athletic lean when cornering
  public stamina: number = 100;
  public hasBallControl: boolean = false;
  public isChargingShot: boolean = false;
  public shotPower: number = 0; // 0 to 1
  public aimDirection: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
  public isKickingAnim: boolean = false;
  public superstar: SuperstarProfile = SUPERSTARS[0]; // Default: Kylian Mbappé #9

  // Falling & Slide-Tackle State
  public isFalling: boolean = false;
  public fallTimer: number = 0;
  public fallType: 'slide_tackle' | 'tripped' | 'celebration' = 'tripped';

  // Visual Meshes for animation & anatomy
  private bodyMesh: THREE.Group;
  private headMesh: THREE.Group;
  private hairMesh: THREE.Mesh;
  private torsoMesh: THREE.Group;
  private leftUpperLeg: THREE.Group;
  private rightUpperLeg: THREE.Group;
  private leftLowerLeg: THREE.Group;
  private rightLowerLeg: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private shadowMesh: THREE.Mesh;
  private badgeMesh: THREE.Mesh;
  private jerseyMat: THREE.MeshStandardMaterial;
  private shortsMat: THREE.MeshStandardMaterial;
  private skinMat: THREE.MeshStandardMaterial;
  private hairMat: THREE.MeshStandardMaterial;
  private bootMat: THREE.MeshStandardMaterial;
  private aimArrow: THREE.ArrowHelper;
  private selectionRing: THREE.Mesh;
  private identityBadge: THREE.Sprite;

  // Locomotion tuning
  private walkSpeed: number = 6.2;
  private sprintSpeed: number = 10.8;
  private turnSpeed: number = 14.0;
  private animTimer: number = 0;
  private kickAnimTimer: number = 0;
  private dribbleTouchTimer: number = 0;

  constructor(isPlayerTeam: boolean = true) {
    const kit = this.buildRealisticPlayer(isPlayerTeam);
    this.group = kit.group;
    this.bodyMesh = kit.bodyMesh;
    this.headMesh = kit.headMesh;
    this.hairMesh = kit.hairMesh;
    this.torsoMesh = kit.torsoMesh;
    this.leftUpperLeg = kit.leftUpperLeg;
    this.rightUpperLeg = kit.rightUpperLeg;
    this.leftLowerLeg = kit.leftLowerLeg;
    this.rightLowerLeg = kit.rightLowerLeg;
    this.leftArm = kit.leftArm;
    this.rightArm = kit.rightArm;
    this.shadowMesh = kit.shadowMesh;
    this.badgeMesh = kit.badgeMesh;
    this.jerseyMat = kit.jerseyMat;
    this.shortsMat = kit.shortsMat;
    this.skinMat = kit.skinMat;
    this.hairMat = kit.hairMat;
    this.bootMat = kit.bootMat;

    // Clear ownership markers without changing the team kit.
    const ringGeometry = new THREE.RingGeometry(0.48, 0.58, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false });
    this.selectionRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.selectionRing.rotation.x = -Math.PI / 2;
    this.selectionRing.position.y = 0.035;
    this.group.add(this.selectionRing);
    const selectionLight = new THREE.PointLight(0x38bdf8, 1.2, 4.5);
    selectionLight.position.set(0, 0.7, 0);
    this.group.add(selectionLight);

    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 512;
    badgeCanvas.height = 128;
    const badgeContext = badgeCanvas.getContext('2d')!;
    badgeContext.fillStyle = 'rgba(2, 6, 23, .85)';
    badgeContext.roundRect(8, 12, 496, 104, 44);
    badgeContext.fill();
    badgeContext.fillStyle = '#ffffff';
    badgeContext.font = '900 42px sans-serif';
    badgeContext.textAlign = 'center';
    badgeContext.fillText(`${this.superstar.nameAr}  #${this.superstar.jerseyNumber}`, 256, 75);
    this.identityBadge = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(badgeCanvas), transparent: true, depthTest: false }));
    this.identityBadge.scale.set(1.55, 0.39, 1);
    this.identityBadge.position.set(0, 2.35, 0);
    this.group.add(this.identityBadge);

    // Pitch aiming indicator arrow
    this.aimArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 0.05, 0),
      4.0,
      0xfacc15,
      0.8,
      0.5
    );
    this.aimArrow.visible = false;
    this.group.add(this.aimArrow);

    this.reset(0, 15);
  }

  public setSuperstar(star: SuperstarProfile) {
    this.superstar = star;
    this.walkSpeed = star.traits.walkSpeed;
    this.sprintSpeed = star.traits.sprintSpeed;
    this.turnSpeed = star.traits.turnSpeed;

    // The selected footballer never changes the team kit colours.

    // Superstar-specific skin & hair customization
    if (star.id === 'mbappe') {
      this.skinMat.color.setHex(0xb27c4d);
      this.hairMat.color.setHex(0x18181b); // Black buzz cut
    } else if (star.id === 'ronaldo') {
      this.skinMat.color.setHex(0xd49b6a);
      this.hairMat.color.setHex(0x27272a); // Dark brown slick fade
    } else if (star.id === 'haaland') {
      this.skinMat.color.setHex(0xf3cbb1);
      this.hairMat.color.setHex(0xfacc15); // Nordic blonde hair
    } else if (star.id === 'messi') {
      this.skinMat.color.setHex(0xe8be99);
      this.hairMat.color.setHex(0x3f2e20); // Brown hair & beard
    } else if (star.id === 'neymar') {
      this.skinMat.color.setHex(0xb88755);
      this.hairMat.color.setHex(0xd97706); // Amber blonde tinted curls
    }

    // Update jersey back number
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(`${star.jerseyNumber}`, 128, 128);
    ctx.fillText(`${star.jerseyNumber}`, 128, 128);
    const numTex = new THREE.CanvasTexture(canvas);
    (this.badgeMesh.material as THREE.MeshBasicMaterial).map = numTex;
    (this.badgeMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    this.updateIdentityBadge();
  }

  private updateIdentityBadge() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(2, 6, 23, .85)';
    ctx.roundRect(8, 12, 496, 104, 44);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.superstar.nameAr}  #${this.superstar.jerseyNumber}`, 256, 75);
    (this.identityBadge.material as THREE.SpriteMaterial).map?.dispose();
    (this.identityBadge.material as THREE.SpriteMaterial).map = new THREE.CanvasTexture(canvas);
    (this.identityBadge.material as THREE.SpriteMaterial).needsUpdate = true;
  }

  /**
   * Builds an anatomically realistic sculpted soccer player model
   */
  private buildRealisticPlayer(isPlayerTeam: boolean) {
    const group = new THREE.Group();
    group.name = 'SoccerPlayerRoot';

    const bodyMesh = new THREE.Group();
    bodyMesh.name = 'BodyMesh';
    group.add(bodyMesh);

    // Materials
    const jerseyMat = new THREE.MeshStandardMaterial({
      color: isPlayerTeam ? 0x123b78 : 0x7f1d1d, // Dark blue home / dark red away
      roughness: 0.55,
      metalness: 0.1,
    });

    const shortsMat = new THREE.MeshStandardMaterial({
      color: isPlayerTeam ? 0xf8fafc : 0x111827, // White home shorts / black away shorts
      roughness: 0.6,
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xc89262, // Natural athletic tan
      roughness: 0.7,
      metalness: 0.05,
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.9,
    });

    const bootMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Team-blue cleats
      roughness: 0.35,
      metalness: 0.4,
    });

    const sockMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.65,
    });

    // 1. Torso & Upper Athletic Body
    const torsoMesh = new THREE.Group();
    torsoMesh.position.y = 1.15;
    bodyMesh.add(torsoMesh);

    // Muscular V-taper chest
    const chestGeom = new THREE.CylinderGeometry(0.28, 0.23, 0.48, 16);
    chestGeom.scale(1.0, 1.0, 0.72); // Athletic flat depth
    const chest = new THREE.Mesh(chestGeom, jerseyMat);
    chest.castShadow = true;
    chest.receiveShadow = true;
    torsoMesh.add(chest);

    // Athletic V-Neck Collar
    const collarGeom = new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI);
    collarGeom.rotateX(Math.PI / 2);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.set(0, 0.24, 0.08);
    torsoMesh.add(collar);

    // Club Crest Badge on Left Chest
    const crestGeom = new THREE.CircleGeometry(0.045, 12);
    const crestMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const crest = new THREE.Mesh(crestGeom, crestMat);
    crest.position.set(-0.12, 0.12, 0.17);
    torsoMesh.add(crest);

    // Number Badge on Back
    const badgeGeom = new THREE.PlaneGeometry(0.28, 0.28);
    badgeGeom.rotateY(Math.PI);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#000000';
    ctx.strokeText('9', 128, 128);
    ctx.fillText('9', 128, 128);
    const numTex = new THREE.CanvasTexture(canvas);
    const badgeMat = new THREE.MeshBasicMaterial({ map: numTex, transparent: true });
    const badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
    badgeMesh.position.set(0, 0.08, -0.175);
    torsoMesh.add(badgeMesh);

    // 2. Sculpted Head with Face & Hair
    const headMesh = new THREE.Group();
    headMesh.position.set(0, 1.55, 0);
    bodyMesh.add(headMesh);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.085, 0.095, 0.16, 12);
    const neck = new THREE.Mesh(neckGeom, skinMat);
    neck.position.y = -0.1;
    neck.castShadow = true;
    headMesh.add(neck);

    // Head base (oval cranium)
    const headGeom = new THREE.SphereGeometry(0.155, 16, 16);
    headGeom.scale(0.92, 1.08, 1.0);
    const headBase = new THREE.Mesh(headGeom, skinMat);
    headBase.castShadow = true;
    headMesh.add(headBase);

    // Hair cap
    const hairGeom = new THREE.SphereGeometry(0.162, 16, 14, 0, Math.PI * 2, 0, Math.PI / 2.35);
    hairGeom.scale(0.94, 1.09, 1.02);
    const hairMesh = new THREE.Mesh(hairGeom, hairMat);
    hairMesh.position.set(0, 0.02, -0.01);
    hairMesh.castShadow = true;
    headMesh.add(hairMesh);

    // Facial Features: Eyes
    const eyeGeom = new THREE.SphereGeometry(0.022, 8, 8);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisGeom = new THREE.SphereGeometry(0.012, 8, 8);
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x26170d });

    const leftEye = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    leftEye.position.set(-0.048, 0.02, 0.135);
    const leftIris = new THREE.Mesh(irisGeom, irisMat);
    leftIris.position.set(-0.048, 0.02, 0.15);
    headMesh.add(leftEye);
    headMesh.add(leftIris);

    const rightEye = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    rightEye.position.set(0.048, 0.02, 0.135);
    const rightIris = new THREE.Mesh(irisGeom, irisMat);
    rightIris.position.set(0.048, 0.02, 0.15);
    headMesh.add(rightEye);
    headMesh.add(rightIris);

    // Eyebrows
    const browGeom = new THREE.BoxGeometry(0.038, 0.008, 0.01);
    const leftBrow = new THREE.Mesh(browGeom, hairMat);
    leftBrow.position.set(-0.048, 0.045, 0.145);
    leftBrow.rotation.z = -0.08;
    headMesh.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, hairMat);
    rightBrow.position.set(0.048, 0.045, 0.145);
    rightBrow.rotation.z = 0.08;
    headMesh.add(rightBrow);

    // Sculpted Nose
    const noseGeom = new THREE.ConeGeometry(0.018, 0.048, 6);
    noseGeom.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeom, skinMat);
    nose.position.set(0, -0.01, 0.155);
    headMesh.add(nose);

    // Mouth / Lips
    const mouthGeom = new THREE.BoxGeometry(0.045, 0.01, 0.015);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x9f5b40, roughness: 0.8 });
    const mouth = new THREE.Mesh(mouthGeom, mouthMat);
    mouth.position.set(0, -0.052, 0.14);
    headMesh.add(mouth);

    // 3. Shorts & Hips
    const hipsGeom = new THREE.CylinderGeometry(0.24, 0.25, 0.28, 16);
    hipsGeom.scale(1.0, 1.0, 0.76);
    const hips = new THREE.Mesh(hipsGeom, shortsMat);
    hips.position.y = 0.82;
    hips.castShadow = true;
    bodyMesh.add(hips);

    // 4. Two-Part Articulated Legs (Upper Thigh + Lower Calf with Shin Guards & Cleats)
    const createArticulatedLeg = (isRight: boolean) => {
      const upperLegGroup = new THREE.Group();
      upperLegGroup.position.set(isRight ? 0.12 : -0.12, 0.72, 0);

      // Thigh
      const thighGeom = new THREE.CylinderGeometry(0.085, 0.07, 0.36, 12);
      const thigh = new THREE.Mesh(thighGeom, skinMat);
      thigh.position.y = -0.18;
      thigh.castShadow = true;
      upperLegGroup.add(thigh);

      // Shorts leg sleeve
      const shortLegGeom = new THREE.CylinderGeometry(0.095, 0.09, 0.2, 12);
      const shortLeg = new THREE.Mesh(shortLegGeom, shortsMat);
      shortLeg.position.y = -0.1;
      upperLegGroup.add(shortLeg);

      // Knee Joint & Lower Leg Group
      const lowerLegGroup = new THREE.Group();
      lowerLegGroup.position.set(0, -0.36, 0);
      upperLegGroup.add(lowerLegGroup);

      // Knee
      const kneeGeom = new THREE.SphereGeometry(0.068, 10, 10);
      const knee = new THREE.Mesh(kneeGeom, skinMat);
      lowerLegGroup.add(knee);

      // Shin & Calf (in high ribbed soccer socks)
      const calfGeom = new THREE.CylinderGeometry(0.065, 0.055, 0.34, 12);
      const calf = new THREE.Mesh(calfGeom, sockMat);
      calf.position.y = -0.17;
      calf.castShadow = true;
      lowerLegGroup.add(calf);

      // Sculpted 3D Football Cleat (Boot)
      const bootGroup = new THREE.Group();
      bootGroup.position.set(0, -0.34, 0.04);
      lowerLegGroup.add(bootGroup);

      // Boot Upper
      const bootGeom = new THREE.BoxGeometry(0.1, 0.085, 0.24);
      const boot = new THREE.Mesh(bootGeom, bootMat);
      boot.position.set(0, 0.04, 0.03);
      boot.castShadow = true;
      bootGroup.add(boot);

      // Boot Studs / Sole
      const soleGeom = new THREE.BoxGeometry(0.105, 0.02, 0.25);
      const soleMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
      const sole = new THREE.Mesh(soleGeom, soleMat);
      sole.position.set(0, -0.01, 0.03);
      bootGroup.add(sole);

      // Neon brand stripe on boot
      const stripeGeom = new THREE.BoxGeometry(0.108, 0.02, 0.1);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stripe = new THREE.Mesh(stripeGeom, stripeMat);
      stripe.position.set(0, 0.05, 0.03);
      bootGroup.add(stripe);

      return { upperLegGroup, lowerLegGroup };
    };

    const leftLegData = createArticulatedLeg(false);
    const rightLegData = createArticulatedLeg(true);
    bodyMesh.add(leftLegData.upperLegGroup);
    bodyMesh.add(rightLegData.upperLegGroup);

    // 5. Articulated Arms
    const createArticulatedArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      armGroup.position.set(isRight ? 0.32 : -0.32, 1.34, 0);

      // Shoulder cap
      const shoulderGeom = new THREE.SphereGeometry(0.085, 12, 12);
      const shoulder = new THREE.Mesh(shoulderGeom, jerseyMat);
      armGroup.add(shoulder);

      // Bicep / Upper Arm
      const bicepGeom = new THREE.CylinderGeometry(0.065, 0.058, 0.26, 10);
      const bicep = new THREE.Mesh(bicepGeom, skinMat);
      bicep.position.y = -0.13;
      bicep.castShadow = true;
      armGroup.add(bicep);

      // Forearm & Hand
      const forearmGeom = new THREE.CylinderGeometry(0.055, 0.048, 0.26, 10);
      const forearm = new THREE.Mesh(forearmGeom, skinMat);
      forearm.position.y = -0.36;
      forearm.castShadow = true;
      armGroup.add(forearm);

      // Wristband
      const wristGeom = new THREE.CylinderGeometry(0.057, 0.057, 0.05, 10);
      const wristMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const wrist = new THREE.Mesh(wristGeom, wristMat);
      wrist.position.y = -0.46;
      armGroup.add(wrist);

      // Hand
      const handGeom = new THREE.BoxGeometry(0.07, 0.09, 0.04);
      const hand = new THREE.Mesh(handGeom, skinMat);
      hand.position.y = -0.52;
      hand.castShadow = true;
      armGroup.add(hand);

      return armGroup;
    };

    const leftArm = createArticulatedArm(false);
    const rightArm = createArticulatedArm(true);
    bodyMesh.add(leftArm);
    bodyMesh.add(rightArm);

    // Dynamic Turf Shadow
    const shadowGeom = new THREE.CircleGeometry(0.48, 16);
    shadowGeom.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.position.y = 0.02;
    group.add(shadowMesh);

    return {
      group,
      bodyMesh,
      headMesh,
      hairMesh,
      torsoMesh,
      leftUpperLeg: leftLegData.upperLegGroup,
      rightUpperLeg: rightLegData.upperLegGroup,
      leftLowerLeg: leftLegData.lowerLegGroup,
      rightLowerLeg: rightLegData.lowerLegGroup,
      leftArm,
      rightArm,
      shadowMesh,
      badgeMesh,
      jerseyMat,
      shortsMat,
      skinMat,
      hairMat,
      bootMat,
    };
  }

  public reset(x: number = 0, z: number = 15) {
    this.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.rotationY = -Math.PI; // Face north towards opposing goal
    this.currentLean = 0;
    this.stamina = 100;
    this.hasBallControl = false;
    this.isChargingShot = false;
    this.shotPower = 0;
    this.isFalling = false;
    this.fallTimer = 0;
    this.bodyMesh.position.set(0, 0, 0);
    this.bodyMesh.rotation.set(0, 0, 0);
    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
    this.aimArrow.visible = false;
  }

  public triggerFall(type: 'slide_tackle' | 'tripped' | 'celebration' = 'tripped', duration: number = 0.9) {
    if (this.isFalling) return;
    this.isFalling = true;
    this.fallTimer = duration;
    this.fallType = type;

    if (type === 'slide_tackle') {
      const forwardDir = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
      this.velocity.copy(forwardDir.multiplyScalar(12.0));
      this.stamina = Math.max(0, this.stamina - 12);
    } else if (type === 'tripped') {
      this.velocity.multiplyScalar(0.3);
      this.hasBallControl = false;
    }
  }

  /**
   * Main player physics & controller update loop
   * Supports smooth analog joystick touch control + smooth turning and body banking
   */
  public update(
    dt: number,
    controls: PlayerControls,
    ball: SoccerBall,
    cameraAngle: number = 0,
    camForward?: THREE.Vector3,
    camRight?: THREE.Vector3
  ) {
    const clampedDt = Math.min(dt, 0.05);

    // If currently sliding / fallen on pitch:
    if (this.isFalling) {
      this.velocity.multiplyScalar(0.91);
      this.position.add(this.velocity.clone().multiplyScalar(clampedDt));
      this.position.y = 0;
      this.position.x = THREE.MathUtils.clamp(this.position.x, -PITCH_WIDTH / 2 + 1.2, PITCH_WIDTH / 2 - 1.2);
      this.position.z = THREE.MathUtils.clamp(this.position.z, -PITCH_LENGTH / 2 + 1.2, PITCH_LENGTH / 2 - 1.2);
      this.group.position.copy(this.position);

      if (this.fallType === 'slide_tackle' && this.fallTimer > 0.25) {
        const dist = this.position.distanceTo(ball.position);
        if (dist < 2.0) {
          const tackleKick = new THREE.Vector3(Math.sin(this.rotationY), 0.15, Math.cos(this.rotationY))
            .normalize()
            .multiplyScalar(20.0);
          ball.applyKick(tackleKick, 0.5, 'player');
          soundEngine.playKick(0.7);
        }
      }

      this.updateAnimations(clampedDt, false, false, 0);
      return;
    }

    // 1. Calculate Input Direction & Magnitude (Smooth Touch Control)
    let inputX = 0;
    let inputZ = 0;
    let inputMag = 0;

    // Check if analog joystick coordinates were passed
    if (controls.analogX !== undefined && controls.analogZ !== undefined) {
      inputX = controls.analogX;
      inputZ = controls.analogZ;
      inputMag = controls.analogMagnitude ?? Math.min(Math.sqrt(inputX * inputX + inputZ * inputZ), 1.0);
    } else {
      // Fallback boolean buttons / keyboard
      if (controls.forward) inputZ -= 1;
      if (controls.backward) inputZ += 1;
      if (controls.left) inputX -= 1;
      if (controls.right) inputX += 1;
      const len = Math.sqrt(inputX * inputX + inputZ * inputZ);
      if (len > 0.05) {
        inputX /= len;
        inputZ /= len;
        inputMag = 1.0;
      }
    }

    const isMoving = inputMag > 0.06;

    // Direction calculation relative to camera forward/right
    let moveDir = new THREE.Vector3(0, 0, 0);
    if (isMoving) {
      if (camRight && camForward) {
        moveDir.addScaledVector(camRight, inputX);
        moveDir.addScaledVector(camForward, -inputZ); // forward is negative Z
      } else {
        const cosCam = Math.cos(cameraAngle);
        const sinCam = Math.sin(cameraAngle);
        moveDir.x = inputX * cosCam - inputZ * sinCam;
        moveDir.z = inputX * sinCam + inputZ * cosCam;
      }
      if (moveDir.lengthSq() > 0.001) {
        moveDir.normalize();
      }
    }

    // 2. Proportional Speed & Stamina
    const wantsSprint = controls.sprint && isMoving && this.stamina > 5;
    const baseSpeed = wantsSprint ? this.sprintSpeed : this.walkSpeed;
    const targetSpeed = isMoving ? baseSpeed * THREE.MathUtils.clamp(inputMag, 0.25, 1.0) : 0;

    if (wantsSprint) {
      this.stamina = Math.max(0, this.stamina - clampedDt * 18);
    } else {
      this.stamina = Math.min(100, this.stamina + clampedDt * 14);
    }

    // Smooth responsive velocity interpolation
    const targetVel = moveDir.clone().multiplyScalar(targetSpeed);
    const accelRate = isMoving ? 18 : 22; // Quick stop, fluid start
    this.velocity.lerp(targetVel, clampedDt * accelRate);
    this.position.add(this.velocity.clone().multiplyScalar(clampedDt));

    // Clamp inside pitch lines
    const maxX = PITCH_WIDTH / 2 - 1.2;
    const maxZ = PITCH_LENGTH / 2 - 1.2;
    this.position.x = THREE.MathUtils.clamp(this.position.x, -maxX, maxX);
    this.position.z = THREE.MathUtils.clamp(this.position.z, -maxZ, maxZ);

    // 3. Smooth Turning & Athletic Lean / Banking ("الحركة باللف قليل")
    if (isMoving && this.velocity.lengthSq() > 0.15) {
      const targetAngle = Math.atan2(this.velocity.x, this.velocity.z);
      let diff = targetAngle - this.rotationY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;

      // Smooth turning interpolation
      const smoothTurnRate = Math.min(clampedDt * this.turnSpeed, 1.0);
      this.rotationY += diff * smoothTurnRate;

      // Athletic lean: tilt body into sharp turns!
      const targetLean = THREE.MathUtils.clamp(-diff * 0.45, -0.28, 0.28);
      this.currentLean = THREE.MathUtils.lerp(this.currentLean, targetLean, clampedDt * 10);
    } else {
      this.currentLean = THREE.MathUtils.lerp(this.currentLean, 0, clampedDt * 10);
    }

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
    this.bodyMesh.rotation.z = this.currentLean;

    // 4. Aiming Direction for shooting
    const forwardDir = new THREE.Vector3(Math.sin(this.rotationY), 0, Math.cos(this.rotationY));
    const targetXCorner = Math.sin(this.rotationY) > 0 ? 3.0 : -3.0;
    const goalTarget = new THREE.Vector3(targetXCorner, 1.2, -PITCH_LENGTH / 2);
    const toGoal = goalTarget.clone().sub(this.position).normalize();
    this.aimDirection.copy(forwardDir.clone().multiplyScalar(0.4).add(toGoal.multiplyScalar(0.6)).normalize());

    // 5. Ball Proximity & Responsive Dribbling
    const distToBall = this.position.distanceTo(ball.position);
    const dribbleRadius = 2.4;

    if (distToBall < dribbleRadius) {
      this.hasBallControl = true;
      ball.lastKicker = 'player';

      const idealBallOffset = forwardDir.clone().multiplyScalar(0.85);
      idealBallOffset.y = BALL_RADIUS;
      const idealBallPos = this.position.clone().add(idealBallOffset);

      if (isMoving) {
        this.dribbleTouchTimer += clampedDt * (wantsSprint ? 16 : 11);
        if (this.dribbleTouchTimer > Math.PI) {
          this.dribbleTouchTimer -= Math.PI;
          const tapForce = forwardDir.clone().multiplyScalar(wantsSprint ? 4.2 : 2.4);
          ball.velocity.copy(tapForce);
        } else {
          ball.position.lerp(idealBallPos, clampedDt * 13);
        }
      } else {
        ball.position.lerp(idealBallPos, clampedDt * 10);
        ball.velocity.multiplyScalar(0.86);
      }
    } else if (distToBall < 3.2 && isMoving) {
      this.hasBallControl = false;
      const toFeet = this.position.clone().add(forwardDir.multiplyScalar(0.7)).sub(ball.position);
      toFeet.y = 0;
      ball.velocity.add(toFeet.normalize().multiplyScalar(clampedDt * 5.5));
    } else {
      this.hasBallControl = false;
    }

    // 6. Shooting Mechanics: Hold & Release Power System
    if (controls.shootCharge && (this.hasBallControl || distToBall < 2.0)) {
      this.isChargingShot = true;
      this.shotPower = Math.min(1.0, this.shotPower + clampedDt * 0.9);

      this.aimArrow.visible = true;
      this.aimArrow.setDirection(this.aimDirection);
      this.aimArrow.setLength(2.5 + this.shotPower * 5.0, 0.8, 0.4);
      const powerColor = this.shotPower < 0.5 ? 0x22c55e : (this.shotPower < 0.8 ? 0xeab308 : 0xef4444);
      this.aimArrow.setColor(powerColor);
    } else if (this.isChargingShot) {
      this.executeShot(ball, this.shotPower);
      this.isChargingShot = false;
      this.shotPower = 0;
      this.aimArrow.visible = false;
    } else {
      this.aimArrow.visible = false;
    }

    // 7. Ground Pass / Tackle Mechanics
    if (controls.passOrTackle) {
      if (this.hasBallControl) {
        this.executeGroundPass(ball);
      } else {
        this.executeTackle(ball);
      }
    }

    // 8. Animations
    this.updateAnimations(clampedDt, isMoving, wantsSprint, this.velocity.length());
  }

  private executeShot(ball: SoccerBall, power: number) {
    this.isKickingAnim = true;
    this.kickAnimTimer = 0.3;

    const minSpeed = 16.0;
    const maxSpeed = this.superstar?.traits?.maxShotPower ?? 36.0;
    const speed = minSpeed + power * (maxSpeed - minSpeed);

    const elevation = 0.22 + power * 0.38;
    const shotVel = this.aimDirection.clone();
    shotVel.y = elevation;
    shotVel.normalize().multiplyScalar(speed);

    const curveCoeff = this.superstar?.traits?.curveMultiplier ?? 1.6;
    const curveSpin = this.aimDirection.x * curveCoeff;

    ball.applyKick(shotVel, curveSpin, 'player');
    this.hasBallControl = false;
  }

  private executeGroundPass(ball: SoccerBall) {
    this.isKickingAnim = true;
    this.kickAnimTimer = 0.2;

    const passDir = this.aimDirection.clone();
    passDir.y = 0.05;
    const passVel = passDir.normalize().multiplyScalar(14.5);

    ball.applyKick(passVel, 0, 'player');
    this.hasBallControl = false;
  }

  private executeTackle(ball: SoccerBall) {
    this.triggerFall('slide_tackle', 0.85);
  }

  /**
   * Realistic running, kicking, and joint bending animation
   */
  private updateAnimations(dt: number, isMoving: boolean, isSprinting: boolean, currentSpeed: number) {
    if (this.isFalling) {
      this.fallTimer -= dt;
      if (this.fallTimer <= 0) {
        this.isFalling = false;
        this.bodyMesh.position.set(0, 0, 0);
        this.bodyMesh.rotation.set(0, 0, 0);
      } else {
        if (this.fallType === 'slide_tackle') {
          this.bodyMesh.position.y = -0.12;
          this.bodyMesh.rotation.x = -Math.PI / 2.7;
          this.bodyMesh.rotation.z = 0.35;
          this.rightUpperLeg.rotation.x = -1.2;
          this.leftUpperLeg.rotation.x = 0.6;
        } else if (this.fallType === 'celebration') {
          this.bodyMesh.position.y = -0.1;
          this.bodyMesh.rotation.x = -0.35;
          this.leftArm.rotation.x = -2.2;
          this.rightArm.rotation.x = -2.2;
        } else {
          this.bodyMesh.position.y = -0.14;
          this.bodyMesh.rotation.x = -Math.PI / 2.2;
          this.bodyMesh.rotation.z = Math.sin(this.fallTimer * 8) * 0.2;
        }
        return;
      }
    }

    if (this.isKickingAnim) {
      this.kickAnimTimer -= dt;
      if (this.kickAnimTimer <= 0) {
        this.isKickingAnim = false;
      }
      this.rightUpperLeg.rotation.x = -Math.PI / 3;
      this.rightLowerLeg.rotation.x = Math.PI / 4;
      this.leftUpperLeg.rotation.x = Math.PI / 6;
      this.leftArm.rotation.x = -Math.PI / 4;
      this.rightArm.rotation.x = Math.PI / 4;
      return;
    }

    if (this.isChargingShot) {
      this.rightUpperLeg.rotation.x = Math.PI / 2.6 * this.shotPower;
      this.rightLowerLeg.rotation.x = -Math.PI / 2.8 * this.shotPower;
      this.leftUpperLeg.rotation.x = -Math.PI / 10;
      this.torsoMesh.rotation.y = 0.2;
      return;
    }

    if (isMoving) {
      const animFreq = isSprinting ? 16 : 11;
      this.animTimer += dt * animFreq;

      const legSwing = Math.sin(this.animTimer) * (isSprinting ? 0.95 : 0.65);
      const armSwing = Math.sin(this.animTimer + Math.PI) * (isSprinting ? 0.8 : 0.5);

      // Thigh swings
      this.leftUpperLeg.rotation.x = legSwing;
      this.rightUpperLeg.rotation.x = -legSwing;

      // Realistic knee flexion on the backswing
      this.leftLowerLeg.rotation.x = legSwing < 0 ? Math.abs(legSwing) * 0.85 : 0.1;
      this.rightLowerLeg.rotation.x = legSwing > 0 ? Math.abs(legSwing) * 0.85 : 0.1;

      // Arm counter-swings
      this.leftArm.rotation.x = armSwing;
      this.rightArm.rotation.x = -armSwing;

      // Subtle torso forward lean during running
      this.torsoMesh.rotation.x = isSprinting ? 0.22 : 0.1;
      this.torsoMesh.rotation.y = 0;
    } else {
      this.animTimer += dt * 2.5;
      const breathe = Math.sin(this.animTimer) * 0.03;

      this.leftUpperLeg.rotation.x = 0;
      this.rightUpperLeg.rotation.x = 0;
      this.leftLowerLeg.rotation.x = 0;
      this.rightLowerLeg.rotation.x = 0;
      this.leftArm.rotation.x = breathe;
      this.rightArm.rotation.x = -breathe;
      this.torsoMesh.rotation.x = 0;
      this.torsoMesh.position.y = 1.15 + breathe;
    }
  }
}
