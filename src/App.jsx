import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Constants & Data ─────────────────────────────────────────────
const BODY_POINTS_STANDING = [
  { id: "head", label: "Head / Cervical", x: 0, y: 1.68, z: 0, score: 92 },
  { id: "neck", label: "Neck C7", x: 0, y: 1.52, z: 0, score: 78 },
  {
    id: "shoulderL",
    label: "Left Shoulder",
    x: -0.2,
    y: 1.42,
    z: 0,
    score: 85,
  },
  {
    id: "shoulderR",
    label: "Right Shoulder",
    x: 0.2,
    y: 1.42,
    z: 0,
    score: 64,
  },
  {
    id: "upperBack",
    label: "Thoracic Spine",
    x: 0,
    y: 1.28,
    z: 0.02,
    score: 71,
  },
  { id: "elbowL", label: "Left Elbow", x: -0.3, y: 1.1, z: 0.02, score: 90 },
  { id: "elbowR", label: "Right Elbow", x: 0.3, y: 1.1, z: 0.02, score: 88 },
  { id: "wristL", label: "Left Wrist", x: -0.3, y: 0.9, z: 0.06, score: 94 },
  { id: "wristR", label: "Right Wrist", x: 0.3, y: 0.9, z: 0.06, score: 91 },
  { id: "lowerBack", label: "Lumbar Spine", x: 0, y: 1.05, z: 0.02, score: 55 },
  { id: "hipL", label: "Left Hip", x: -0.12, y: 0.9, z: 0, score: 82 },
  { id: "hipR", label: "Right Hip", x: 0.12, y: 0.9, z: 0, score: 79 },
  { id: "kneeL", label: "Left Knee", x: -0.12, y: 0.5, z: 0, score: 95 },
  { id: "kneeR", label: "Right Knee", x: 0.12, y: 0.5, z: 0, score: 93 },
  { id: "ankleL", label: "Left Ankle", x: -0.12, y: 0.08, z: 0, score: 97 },
  { id: "ankleR", label: "Right Ankle", x: 0.12, y: 0.08, z: 0, score: 96 },
];

const BODY_POINTS_SITTING = [
  { id: "head", label: "Head / Cervical", x: 0, y: 1.32, z: -0.02, score: 72 },
  { id: "neck", label: "Neck C7", x: 0, y: 1.18, z: 0.01, score: 65 },
  {
    id: "shoulderL",
    label: "Left Shoulder",
    x: -0.2,
    y: 1.1,
    z: 0.02,
    score: 70,
  },
  {
    id: "shoulderR",
    label: "Right Shoulder",
    x: 0.2,
    y: 1.1,
    z: 0.02,
    score: 58,
  },
  {
    id: "upperBack",
    label: "Thoracic Spine",
    x: 0,
    y: 0.98,
    z: 0.05,
    score: 60,
  },
  { id: "elbowL", label: "Left Elbow", x: -0.28, y: 0.82, z: 0.12, score: 85 },
  { id: "elbowR", label: "Right Elbow", x: 0.28, y: 0.82, z: 0.12, score: 83 },
  { id: "wristL", label: "Left Wrist", x: -0.2, y: 0.68, z: 0.22, score: 88 },
  { id: "wristR", label: "Right Wrist", x: 0.2, y: 0.68, z: 0.22, score: 86 },
  { id: "lowerBack", label: "Lumbar Spine", x: 0, y: 0.78, z: 0.06, score: 45 },
  { id: "hipL", label: "Left Hip", x: -0.14, y: 0.62, z: 0.05, score: 68 },
  { id: "hipR", label: "Right Hip", x: 0.14, y: 0.62, z: 0.05, score: 66 },
  { id: "kneeL", label: "Left Knee", x: -0.14, y: 0.55, z: 0.38, score: 90 },
  { id: "kneeR", label: "Right Knee", x: 0.14, y: 0.55, z: 0.38, score: 88 },
  { id: "ankleL", label: "Left Ankle", x: -0.14, y: 0.08, z: 0.4, score: 95 },
  { id: "ankleR", label: "Right Ankle", x: 0.14, y: 0.08, z: 0.4, score: 94 },
];

const NEWS_ITEMS = [
  {
    id: 1,
    date: "Feb 10, 2026",
    title: "AI-Powered Posture Correction Reduces Back Pain by 47%",
    excerpt:
      "A new clinical study published in The Lancet Digital Health demonstrates that real-time AI posture monitoring significantly reduces chronic lower back pain in office workers over a 12-week intervention period.",
    tag: "Research",
    img: "📊",
  },
  {
    id: 2,
    date: "Feb 8, 2026",
    title: "PostureAI™ v3.2 Released — Now with Sleep Posture Tracking",
    excerpt:
      "Our latest firmware update introduces overnight posture monitoring, providing comprehensive 24-hour postural health data and personalized sleep position recommendations.",
    tag: "Product",
    img: "🚀",
  },
  {
    id: 3,
    date: "Feb 5, 2026",
    title: "Partnership with Mayo Clinic for Scoliosis Early Detection",
    excerpt:
      "Seston Health announces a landmark partnership with Mayo Clinic to develop AI screening protocols for early scoliosis detection in adolescents using wearable sensor arrays.",
    tag: "Partnership",
    img: "🏥",
  },
  {
    id: 4,
    date: "Feb 1, 2026",
    title: "Workplace Ergonomics: The $87B Problem We're Solving",
    excerpt:
      "Poor workplace ergonomics costs the global economy an estimated $87 billion annually. Learn how distributed sensor networks and machine learning are transforming occupational health.",
    tag: "Industry",
    img: "💡",
  },
  {
    id: 5,
    date: "Jan 28, 2026",
    title: "FDA Grants Breakthrough Device Designation to PostureBand Pro",
    excerpt:
      "The FDA has granted Breakthrough Device designation to our PostureBand Pro wearable, accelerating the pathway to clinical deployment for spinal health monitoring.",
    tag: "Regulatory",
    img: "✅",
  },
];

const DEVICES = [
  {
    id: "pb-pro",
    name: "PostureBand Pro",
    type: "Wearable Band",
    icon: "⌚",
    desc: "Clinical-grade spinal monitor",
  },
  {
    id: "ps-clip",
    name: "PostureSense Clip",
    type: "Clip Sensor",
    icon: "📎",
    desc: "Lightweight shirt-mount sensor",
  },
  {
    id: "pm-pad",
    name: "PostureMat",
    type: "Seat Pad",
    icon: "🪑",
    desc: "Smart pressure-mapping seat pad",
  },
  {
    id: "pc-cam",
    name: "PostureCam",
    type: "Camera",
    icon: "📷",
    desc: "AI vision posture tracker",
  },
];

const lerp = (a, b, t) => a + (b - a) * t;
const scoreColor = (s) =>
  s >= 85 ? "#00e5a0" : s >= 65 ? "#f0c040" : "#ff6b6b";
const scoreLabel = (s) => (s >= 85 ? "Good" : s >= 65 ? "Fair" : "Poor");

// ─── High-poly anatomical body builder ───────────────────────────
function buildAnatomicalBody(pose) {
  const pts = pose === "sitting" ? BODY_POINTS_SITTING : BODY_POINTS_STANDING;
  const bp = {};
  pts.forEach((p) => (bp[p.id] = new THREE.Vector3(p.x, p.y, p.z)));
  const group = new THREE.Group();
  const SEG = 28;

  const wireMat = (color = 0x00e5a0, opacity = 0.22) =>
    new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
    });
  const ghostMat = (color = 0x00e5a0, opacity = 0.04) =>
    new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

  // Helper: create tapered tube limb with muscle bulge
  const makeMuscularLimb = (
    start,
    end,
    rStart,
    rMid,
    rEnd,
    segs = 16,
    color = 0x00c890,
  ) => {
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();
    const points = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const skew = Math.sin(t * Math.PI * 0.8);
      const r = lerp(rStart, rEnd, t) + (rMid - lerp(rStart, rEnd, 0.5)) * skew;
      points.push(new THREE.Vector2(Math.max(r, 0.003), t * len));
    }
    const geo = new THREE.LatheGeometry(points, SEG);
    const mesh = new THREE.Mesh(geo, wireMat(color, 0.2));
    const ghostMesh = new THREE.Mesh(geo.clone(), ghostMat(color, 0.03));
    const axis = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(
      axis,
      dir.clone().normalize(),
    );
    mesh.quaternion.copy(quat);
    mesh.position.copy(start);
    ghostMesh.quaternion.copy(quat);
    ghostMesh.position.copy(start);
    group.add(mesh);
    group.add(ghostMesh);
  };

  const makeJoint = (pos, radius = 0.025, color = 0x00e5a0) => {
    const geo = new THREE.SphereGeometry(radius, 16, 12);
    const mesh = new THREE.Mesh(geo, wireMat(color, 0.3));
    mesh.position.copy(pos);
    group.add(mesh);
  };

  // ═══ HEAD — Multi-part cranium ═══
  const headC = bp.head.clone();
  const craniumProfile = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const angle = t * Math.PI;
    let r = Math.sin(angle) * 0.092;
    if (t > 0.7) r *= lerp(1, 0.6, (t - 0.7) / 0.3);
    if (t < 0.15) r *= lerp(0.4, 1, t / 0.15);
    craniumProfile.push(
      new THREE.Vector2(Math.max(r, 0.001), (t - 0.5) * 0.22),
    );
  }
  const craniumGeo = new THREE.LatheGeometry(craniumProfile, SEG);
  const cranium = new THREE.Mesh(craniumGeo, wireMat(0x00e5a0, 0.25));
  cranium.position.copy(headC);
  group.add(cranium);
  const craniumGhost = new THREE.Mesh(
    craniumGeo.clone(),
    ghostMat(0x00e5a0, 0.04),
  );
  craniumGhost.position.copy(headC);
  group.add(craniumGhost);

  // Brow ridge
  const browGeo = new THREE.TorusGeometry(0.06, 0.008, 8, 20, Math.PI);
  const brow = new THREE.Mesh(browGeo, wireMat(0x00c890, 0.2));
  brow.position.set(headC.x, headC.y + 0.01, headC.z + 0.065);
  brow.rotation.x = -0.2;
  group.add(brow);

  // Jaw / mandible
  const jawProfile = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const r =
      lerp(0.065, 0.04, t) * Math.sin(lerp(0.3, 1, t) * Math.PI * 0.5 + 0.3);
    jawProfile.push(new THREE.Vector2(Math.max(r, 0.003), t * 0.08));
  }
  const jawGeo = new THREE.LatheGeometry(jawProfile, 20);
  const jaw = new THREE.Mesh(jawGeo, wireMat(0x00aa77, 0.18));
  jaw.position.set(headC.x, headC.y - 0.08, headC.z + 0.015);
  group.add(jaw);

  // Eye sockets
  for (let side of [-1, 1]) {
    const eyeGeo = new THREE.RingGeometry(0.012, 0.022, 12);
    const eye = new THREE.Mesh(eyeGeo, wireMat(0x44ffcc, 0.3));
    eye.position.set(headC.x + side * 0.032, headC.y + 0.015, headC.z + 0.088);
    group.add(eye);
  }

  // Nose bridge
  const noseGeo = new THREE.CylinderGeometry(0.006, 0.01, 0.04, 8, 3);
  const nose = new THREE.Mesh(noseGeo, wireMat(0x00c890, 0.15));
  nose.position.set(headC.x, headC.y - 0.01, headC.z + 0.09);
  nose.rotation.x = 0.3;
  group.add(nose);

  // Ears
  for (let side of [-1, 1]) {
    const earGeo = new THREE.TorusGeometry(0.018, 0.005, 6, 10, Math.PI);
    const ear = new THREE.Mesh(earGeo, wireMat(0x00aa77, 0.2));
    ear.position.set(headC.x + side * 0.09, headC.y, headC.z);
    ear.rotation.y = (side * Math.PI) / 2;
    group.add(ear);
  }

  // ═══ NECK ═══
  const neckProfile = [];
  const neckLen = headC.y - bp.neck.y - 0.04;
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    neckProfile.push(new THREE.Vector2(lerp(0.038, 0.048, t), t * neckLen));
  }
  const neckGeo = new THREE.LatheGeometry(neckProfile, SEG);
  const neckMesh = new THREE.Mesh(neckGeo, wireMat(0x00c890, 0.2));
  neckMesh.position.set(bp.neck.x, bp.neck.y + 0.02, bp.neck.z);
  group.add(neckMesh);

  // Neck tendons
  for (let side of [-1, 1]) {
    const tc = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.015, bp.neck.y + neckLen, bp.neck.z + 0.025),
      new THREE.Vector3(
        side * 0.03,
        bp.neck.y + neckLen * 0.5,
        bp.neck.z + 0.03,
      ),
      new THREE.Vector3(side * 0.04, bp.neck.y + 0.02, bp.neck.z + 0.01),
    ]);
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(tc, 12, 0.004, 6, false),
        wireMat(0x008866, 0.15),
      ),
    );
  }

  // ═══ CLAVICLES & SHOULDERS ═══
  const clavCurve = new THREE.CatmullRomCurve3([
    bp.shoulderL.clone(),
    new THREE.Vector3(-0.06, bp.neck.y - 0.06, bp.neck.z + 0.04),
    new THREE.Vector3(0, bp.neck.y - 0.06, bp.neck.z + 0.045),
    new THREE.Vector3(0.06, bp.neck.y - 0.06, bp.neck.z + 0.04),
    bp.shoulderR.clone(),
  ]);
  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(clavCurve, 24, 0.009, 8, false),
      wireMat(0x00c890, 0.25),
    ),
  );

  for (const sp of [bp.shoulderL, bp.shoulderR]) {
    const dGeo = new THREE.SphereGeometry(
      0.048,
      16,
      12,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.6,
    );
    const d = new THREE.Mesh(dGeo, wireMat(0x00e5a0, 0.2));
    d.position.set(sp.x, sp.y + 0.01, sp.z);
    group.add(d);
    const dg = new THREE.Mesh(dGeo.clone(), ghostMat(0x00e5a0, 0.03));
    dg.position.copy(d.position);
    group.add(dg);
  }

  // ═══ TORSO — Ribcage + Abdomen + Pelvis ═══
  const ribTop = bp.neck.y - 0.04;
  const ribBot = bp.upperBack.y - 0.02;
  const ribH = ribTop - ribBot;
  const ribProfile = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const rx = lerp(0.1, 0.155, Math.sin(t * Math.PI * 0.85 + 0.2));
    ribProfile.push(new THREE.Vector2(rx, t * ribH));
  }
  const ribGeo = new THREE.LatheGeometry(ribProfile, SEG);
  ribGeo.scale(1, 1, 0.62);
  const ribMesh = new THREE.Mesh(ribGeo, wireMat(0x00e5a0, 0.18));
  ribMesh.position.set(0, ribBot, bp.upperBack.z * 0.4);
  group.add(ribMesh);
  group.add(
    new THREE.Mesh(ribGeo.clone(), ghostMat(0x00e5a0, 0.03))
      .translateY(ribBot)
      .translateZ(bp.upperBack.z * 0.4),
  );

  // Rib arcs
  for (let i = 0; i < 12; i += 2) {
    const t = i / 11;
    const ry = lerp(ribTop - 0.01, ribBot + 0.01, t);
    const rW = lerp(0.1, 0.155, Math.sin(t * Math.PI * 0.85 + 0.2));
    const ribArcGeo = new THREE.TorusGeometry(rW, 0.003, 5, SEG, Math.PI * 0.9);
    const rib = new THREE.Mesh(ribArcGeo, wireMat(0x007755, 0.12));
    rib.position.set(0, ry, bp.upperBack.z * 0.4);
    rib.rotation.x = Math.PI / 2;
    rib.rotation.z = Math.PI / 2;
    rib.scale.set(1, 0.62, 1);
    group.add(rib);
  }

  // Abdomen
  const abdTop = bp.upperBack.y - 0.02;
  const abdBot = bp.lowerBack.y - 0.02;
  const abdH = abdTop - abdBot;
  const abdProfile = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    abdProfile.push(new THREE.Vector2(lerp(0.145, 0.12, t), t * abdH));
  }
  const abdGeo = new THREE.LatheGeometry(abdProfile, SEG);
  abdGeo.scale(1, 1, 0.58);
  const abdMesh = new THREE.Mesh(abdGeo, wireMat(0x00c890, 0.15));
  abdMesh.position.set(0, abdBot, (bp.upperBack.z + bp.lowerBack.z) * 0.3);
  group.add(abdMesh);
  group.add(
    new THREE.Mesh(abdGeo.clone(), ghostMat(0x00c890, 0.025))
      .translateY(abdBot)
      .translateZ((bp.upperBack.z + bp.lowerBack.z) * 0.3),
  );

  // Abdominal midline
  const mlC = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, abdTop, bp.upperBack.z * 0.4 + 0.09),
    new THREE.Vector3(
      0,
      (abdTop + abdBot) / 2,
      (bp.upperBack.z + bp.lowerBack.z) * 0.3 + 0.08,
    ),
    new THREE.Vector3(0, abdBot, bp.lowerBack.z + 0.07),
  ]);
  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(mlC, 12, 0.003, 4, false),
      wireMat(0x006644, 0.15),
    ),
  );

  // Pelvis
  const pelTop = bp.lowerBack.y - 0.02;
  const pelBot = (bp.hipL.y + bp.hipR.y) / 2 - 0.05;
  const pelH = pelTop - pelBot;
  const pelProfile = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    pelProfile.push(
      new THREE.Vector2(
        lerp(0.11, 0.14, Math.sin(t * Math.PI * 0.7 + 0.3)),
        t * pelH,
      ),
    );
  }
  const pelGeo = new THREE.LatheGeometry(pelProfile, SEG);
  pelGeo.scale(1.15, 1, 0.58);
  const pelMesh = new THREE.Mesh(pelGeo, wireMat(0x00c890, 0.18));
  pelMesh.position.set(0, pelBot, (bp.hipL.z + bp.hipR.z) / 2);
  group.add(pelMesh);
  group.add(
    new THREE.Mesh(pelGeo.clone(), ghostMat(0x00c890, 0.025))
      .translateY(pelBot)
      .translateZ((bp.hipL.z + bp.hipR.z) / 2),
  );

  // Iliac crest
  const ilGeo = new THREE.TorusGeometry(0.145, 0.007, 6, SEG, Math.PI * 1.2);
  const il = new THREE.Mesh(ilGeo, wireMat(0x00aa77, 0.2));
  il.position.set(0, (bp.hipL.y + bp.hipR.y) / 2, (bp.hipL.z + bp.hipR.z) / 2);
  il.rotation.x = Math.PI / 2;
  il.scale.set(1.15, 0.58, 1);
  group.add(il);

  // ═══ SPINE — S-curve with vertebrae ═══
  const spPts = [];
  const sacrum = new THREE.Vector3(
    0,
    (bp.hipL.y + bp.hipR.y) / 2,
    (bp.hipL.z + bp.hipR.z) / 2 + 0.04,
  );
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    let pt;
    if (t < 0.25) {
      const lt = t / 0.25;
      pt = bp.neck.clone().lerp(bp.upperBack.clone(), lt);
      pt.z += 0.04 + Math.sin(lt * Math.PI) * -0.012;
    } else if (t < 0.6) {
      const lt = (t - 0.25) / 0.35;
      pt = bp.upperBack.clone().lerp(bp.lowerBack.clone(), lt);
      pt.z += 0.04 + Math.sin(lt * Math.PI) * 0.018;
    } else {
      const lt = (t - 0.6) / 0.4;
      pt = bp.lowerBack.clone().lerp(sacrum, lt);
      pt.z += Math.sin(lt * Math.PI) * -0.01;
    }
    spPts.push(pt);
  }
  const spCurve = new THREE.CatmullRomCurve3(spPts);
  group.add(
    new THREE.Mesh(
      new THREE.TubeGeometry(spCurve, 50, 0.007, 8, false),
      wireMat(0x44ffbb, 0.35),
    ),
  );

  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const pt = spCurve.getPointAt(t);
    const tan = spCurve.getTangentAt(t);
    const dGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.004, 10);
    const disc = new THREE.Mesh(dGeo, wireMat(0x00aa77, 0.2));
    disc.position.copy(pt);
    disc.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      tan.normalize(),
    );
    group.add(disc);
    if (i % 2 === 0) {
      const sGeo = new THREE.ConeGeometry(0.004, 0.02, 4);
      const spike = new THREE.Mesh(sGeo, wireMat(0x007755, 0.15));
      spike.position.set(pt.x, pt.y, pt.z + 0.015);
      group.add(spike);
    }
  }

  // Scapulae
  for (let side of [-1, 1]) {
    const ss = new THREE.Shape();
    ss.moveTo(0, 0);
    ss.quadraticCurveTo(0.03, 0.05, 0, 0.1);
    ss.quadraticCurveTo(-0.025, 0.05, 0, 0);
    const sg = new THREE.ShapeGeometry(ss, 8);
    const sm = new THREE.Mesh(sg, wireMat(0x006644, 0.12));
    sm.position.set(side * 0.07, bp.shoulderL.y - 0.06, bp.upperBack.z + 0.06);
    sm.rotation.y = side * 0.15;
    group.add(sm);
  }

  // ═══ ARMS ═══
  const buildArm = (shoulder, elbow, wrist) => {
    makeMuscularLimb(shoulder, elbow, 0.032, 0.044, 0.026, 14, 0x00c890);
    makeJoint(elbow, 0.026, 0x00e5a0);
    makeMuscularLimb(elbow, wrist, 0.028, 0.034, 0.018, 12, 0x00b880);
    makeJoint(wrist, 0.018, 0x00e5a0);
    const hDir = new THREE.Vector3()
      .subVectors(wrist, elbow)
      .normalize()
      .multiplyScalar(0.06);
    const hTip = wrist.clone().add(hDir);
    const hGeo = new THREE.BoxGeometry(0.042, 0.06, 0.018, 5, 7, 2);
    const hand = new THREE.Mesh(hGeo, wireMat(0x00b880, 0.18));
    hand.position.copy(wrist.clone().add(hTip).multiplyScalar(0.5));
    hand.quaternion.copy(
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        hDir.clone().normalize(),
      ),
    );
    group.add(hand);
    for (let f = -2; f <= 2; f++) {
      const fDir = hDir.clone().normalize();
      const fSide = new THREE.Vector3(-fDir.z, 0, fDir.x)
        .normalize()
        .multiplyScalar(f * 0.008);
      const fStart = hTip.clone().add(fSide);
      const fEnd = fStart
        .clone()
        .add(
          fDir.clone().multiplyScalar(lerp(0.025, 0.04, 1 - Math.abs(f) / 2)),
        );
      group.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([fStart, fEnd]),
            6,
            0.003,
            4,
            false,
          ),
          wireMat(0x009977, 0.15),
        ),
      );
    }
  };
  buildArm(bp.shoulderL, bp.elbowL, bp.wristL);
  buildArm(bp.shoulderR, bp.elbowR, bp.wristR);

  // ═══ LEGS ═══
  const buildLeg = (hip, knee, ankle) => {
    makeJoint(hip, 0.035, 0x00c890);
    makeMuscularLimb(hip, knee, 0.055, 0.072, 0.038, 18, 0x00c890);
    makeJoint(knee, 0.038, 0x00e5a0);
    const kcGeo = new THREE.SphereGeometry(
      0.025,
      12,
      8,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.5,
    );
    const kc = new THREE.Mesh(kcGeo, wireMat(0x00aa77, 0.2));
    kc.position.set(knee.x, knee.y, knee.z + 0.035);
    group.add(kc);
    makeMuscularLimb(knee, ankle, 0.036, 0.046, 0.022, 16, 0x00b880);
    makeJoint(ankle, 0.022, 0x00e5a0);
    const fProfile = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      fProfile.push(new THREE.Vector2(lerp(0.028, 0.015, t), t * 0.12));
    }
    const fGeo = new THREE.LatheGeometry(fProfile, 14);
    fGeo.scale(0.6, 1, 1);
    const foot = new THREE.Mesh(fGeo, wireMat(0x00b880, 0.18));
    foot.position.copy(ankle);
    foot.position.y -= 0.015;
    foot.rotation.x = -Math.PI / 2;
    foot.rotation.z = Math.PI;
    group.add(foot);
    const footGhost = new THREE.Mesh(fGeo.clone(), ghostMat(0x00b880, 0.025));
    footGhost.position.copy(foot.position);
    footGhost.rotation.copy(foot.rotation);
    group.add(footGhost);
    for (let t = -2; t <= 2; t++) {
      const tGeo = new THREE.SphereGeometry(0.006, 6, 4);
      const toe = new THREE.Mesh(tGeo, wireMat(0x009977, 0.15));
      toe.position.set(
        ankle.x + t * 0.009,
        ankle.y - 0.02,
        ankle.z + 0.12 * 0.85,
      );
      group.add(toe);
    }
  };
  buildLeg(bp.hipL, bp.kneeL, bp.ankleL);
  buildLeg(bp.hipR, bp.kneeR, bp.ankleR);

  // ═══ CHAIR (sitting) ═══
  if (pose === "sitting") {
    const cm = wireMat(0x335577, 0.14);
    const sGeo = new THREE.BoxGeometry(0.4, 0.03, 0.38, 8, 1, 8);
    group.add(new THREE.Mesh(sGeo, cm).translateY(0.48).translateZ(0.18));
    const bGeo = new THREE.BoxGeometry(0.38, 0.5, 0.03, 8, 10, 1);
    group.add(new THREE.Mesh(bGeo, cm).translateY(0.75).translateZ(0.005));
    const lmGeo = new THREE.TorusGeometry(0.08, 0.015, 8, 16, Math.PI);
    group.add(
      new THREE.Mesh(lmGeo, wireMat(0x446688, 0.12))
        .translateY(0.68)
        .translateZ(0.02),
    );
    for (let cx of [-0.17, 0.17])
      for (let cz of [0.02, 0.35]) {
        group.add(
          new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 8), cm)
            .translateX(cx)
            .translateY(0.24)
            .translateZ(cz),
        );
      }
    group.add(
      new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.015, 0.015, 6, 1, 1), cm)
        .translateY(0.15)
        .translateZ(0.18),
    );
  }

  return group;
}

// ─── Sub-components ───────────────────────────────────────────────
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setDisplay(Math.round(lerp(0, value, p * p)));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display}</span>;
}

function CircularGauge({ score, size = 120, sub }) {
  const r = (size - 12) / 2,
    circ = 2 * Math.PI * r,
    offset = circ - (score / 100) * circ,
    col = scoreColor(score);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1a2a3a"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div
        style={{
          marginTop: -size / 2 - 18,
          marginBottom: size / 2 - 28,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: size * 0.3,
            fontWeight: 700,
            color: col,
            fontFamily: "'Orbitron',sans-serif",
          }}
        >
          <AnimatedNumber value={score} />
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: "#6b8299", marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function GlowCard({ children, style, onClick, glow }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:
          "linear-gradient(135deg, rgba(10,25,47,0.95), rgba(15,32,56,0.9))",
        border: `1px solid ${glow || "rgba(0,229,160,0.15)"}`,
        borderRadius: 16,
        padding: 20,
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${glow || "rgba(0,229,160,0.3)"}, transparent)`,
        }}
      />
      {children}
    </div>
  );
}

// ─── Three.js Scene ───────────────────────────────────────────────
function WireframeBody({ onPointClick, selectedPoint, pose }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});
  const frameRef = useRef(0);
  const bodyGroupRef = useRef(null);
  const pointMeshesRef = useRef({});
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const w = container.clientWidth,
      h = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 0.9, 3.4);
    camera.lookAt(0, 0.85, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x1a3a5a, 0.8));
    const pl1 = new THREE.PointLight(0x00e5a0, 1.8, 12);
    pl1.position.set(2, 3, 3);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0x0088ff, 1.2, 10);
    pl2.position.set(-2, 1, -2);
    scene.add(pl2);
    const pl3 = new THREE.PointLight(0x44aaff, 0.5, 8);
    pl3.position.set(0, -1, 3);
    scene.add(pl3);

    const grid = new THREE.GridHelper(5, 30, 0x0a3d5c, 0x061828);
    grid.position.y = -0.05;
    scene.add(grid);
    const gnd = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 48),
      new THREE.MeshBasicMaterial({
        color: 0x00e5a0,
        transparent: true,
        opacity: 0.025,
        side: THREE.DoubleSide,
      }),
    );
    gnd.rotation.x = -Math.PI / 2;
    gnd.position.y = -0.04;
    scene.add(gnd);

    sceneRef.current = { scene, camera, renderer };
    let prevX = 0,
      prevY = 0;
    const el = renderer.domElement;
    const onDown = (e) => {
      isDraggingRef.current = true;
      prevX = e.clientX ?? e.touches?.[0]?.clientX;
      prevY = e.clientY ?? e.touches?.[0]?.clientY;
    };
    const onMove = (e) => {
      if (!isDraggingRef.current || !bodyGroupRef.current) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX,
        cy = e.clientY ?? e.touches?.[0]?.clientY;
      bodyGroupRef.current.rotation.y += (cx - prevX) * 0.006;
      bodyGroupRef.current.rotation.x = Math.max(
        -0.3,
        Math.min(0.3, bodyGroupRef.current.rotation.x + (cy - prevY) * 0.003),
      );
      prevX = cx;
      prevY = cy;
    };
    const onUp = () => {
      isDraggingRef.current = false;
    };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp);

    const raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2();
    const onClick = (e) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      if (!bodyGroupRef.current) return;
      const hits = raycaster.intersectObjects(
        bodyGroupRef.current.children,
        false,
      );
      for (const hit of hits) {
        const id = hit.object.userData?.pointId;
        if (id) {
          onPointClick(id);
          return;
        }
      }
    };
    el.addEventListener("click", onClick);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;
      if (!isDraggingRef.current && bodyGroupRef.current)
        bodyGroupRef.current.rotation.y += 0.002;
      Object.entries(pointMeshesRef.current).forEach(([id, meshes]) => {
        const s = id === selectedPoint ? 1.5 + Math.sin(t * 5) * 0.5 : 1;
        meshes.forEach((m) => m.scale.setScalar(s));
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = container.clientWidth,
        nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(el)) container.removeChild(el);
    };
  }, []);

  useEffect(() => {
    const { scene, camera } = sceneRef.current;
    if (!scene) return;
    if (bodyGroupRef.current) {
      scene.remove(bodyGroupRef.current);
      bodyGroupRef.current.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
    }
    const bodyGroup = buildAnatomicalBody(pose);
    const pts = pose === "sitting" ? BODY_POINTS_SITTING : BODY_POINTS_STANDING;
    const newPM = {};
    pts.forEach((p) => {
      const col = new THREE.Color(scoreColor(p.score));
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      hit.position.set(p.x, p.y, p.z);
      hit.userData = { pointId: p.id };
      bodyGroup.add(hit);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.013, 14, 14),
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.95,
        }),
      );
      dot.position.set(p.x, p.y, p.z);
      dot.userData = { pointId: p.id };
      bodyGroup.add(dot);
      const r1 = new THREE.Mesh(
        new THREE.RingGeometry(0.02, 0.032, 20),
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        }),
      );
      r1.position.set(p.x, p.y, p.z + 0.001);
      r1.userData = { pointId: p.id };
      bodyGroup.add(r1);
      const r2 = new THREE.Mesh(
        new THREE.RingGeometry(0.032, 0.046, 20),
        new THREE.MeshBasicMaterial({
          color: col,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide,
        }),
      );
      r2.position.set(p.x, p.y, p.z + 0.002);
      r2.userData = { pointId: p.id };
      bodyGroup.add(r2);
      newPM[p.id] = [dot, r1, r2];
    });
    scene.add(bodyGroup);
    bodyGroupRef.current = bodyGroup;
    pointMeshesRef.current = newPM;
    if (pose === "sitting") {
      camera.position.set(0, 0.75, 3.0);
      camera.lookAt(0, 0.7, 0);
    } else {
      camera.position.set(0, 0.9, 3.4);
      camera.lookAt(0, 0.85, 0);
    }
  }, [pose]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", cursor: "grab" }}
    />
  );
}

// ─── Pages ────────────────────────────────────────────────────────
function HomePage() {
  const pts = BODY_POINTS_STANDING;
  const overall = Math.round(pts.reduce((s, p) => s + p.score, 0) / pts.length);
  const alerts = pts.filter((p) => p.score < 70);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#e0f0ff",
              margin: 0,
              fontFamily: "'Orbitron',sans-serif",
            }}
          >
            Seston
          </h1>
          <div style={{ fontSize: 12, color: "#4a7a9b", marginTop: 2 }}>
            POSTURE INTELLIGENCE
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              color: "#4a7a9b",
              letterSpacing: 2,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {time.toLocaleTimeString()}
          </div>
          <div style={{ fontSize: 10, color: "#2a5a7b" }}>LIVE MONITORING</div>
        </div>
      </div>
      <GlowCard style={{ textAlign: "center", marginBottom: 20, padding: 28 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "#4a8a9b",
            marginBottom: 12,
          }}
        >
          OVERALL POSTURE SCORE
        </div>
        <CircularGauge score={overall} size={150} sub={scoreLabel(overall)} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 16,
          }}
        >
          {["Spine", "Shoulders", "Hips"].map((z, i) => {
            const vals = [71, 75, 81];
            return (
              <div
                key={z}
                style={{
                  background: "rgba(0,229,160,0.06)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  flex: 1,
                }}
              >
                <div
                  style={{ fontSize: 10, color: "#4a8a9b", letterSpacing: 1 }}
                >
                  {z.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: scoreColor(vals[i]),
                    fontFamily: "'Orbitron',sans-serif",
                  }}
                >
                  <AnimatedNumber value={vals[i]} />
                </div>
              </div>
            );
          })}
        </div>
      </GlowCard>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "#4a8a9b",
          marginBottom: 10,
        }}
      >
        TODAY'S TREND
      </div>
      <GlowCard style={{ marginBottom: 20, padding: "16px 20px" }}>
        <svg viewBox="0 0 300 60" style={{ width: "100%", height: 60 }}>
          <defs>
            <linearGradient id="tF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00e5a0" stopOpacity="0" />
            </linearGradient>
          </defs>
          {(() => {
            const d = [72, 68, 74, 71, 78, 82, 80, 85, 83, overall],
              p = d.map((v, i) => ({
                x: (i / (d.length - 1)) * 280 + 10,
                y: 55 - ((v - 60) / 40) * 50,
              })),
              pD = p
                .map((pt, i) =>
                  i === 0 ? `M${pt.x},${pt.y}` : `L${pt.x},${pt.y}`,
                )
                .join(" "),
              aD = pD + ` L${p[p.length - 1].x},58 L${p[0].x},58 Z`;
            return (
              <>
                <path d={aD} fill="url(#tF)" />
                <path
                  d={pD}
                  fill="none"
                  stroke="#00e5a0"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                  strokeLinejoin="round"
                />
                {p.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === d.length - 1 ? 4 : 2}
                    fill={scoreColor(d[i])}
                  />
                ))}
              </>
            );
          })()}
        </svg>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
            color: "#3a6a8b",
          }}
        >
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>Now</span>
        </div>
      </GlowCard>
      {alerts.length > 0 && (
        <>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              color: "#ff6b6b",
              marginBottom: 10,
            }}
          >
            ⚠ ATTENTION AREAS
          </div>
          {alerts.map((a) => (
            <GlowCard
              key={a.id}
              glow="rgba(255,107,107,0.2)"
              style={{
                marginBottom: 10,
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 14, color: "#e0f0ff", fontWeight: 600 }}
                >
                  {a.label}
                </div>
                <div style={{ fontSize: 11, color: "#ff6b6b" }}>
                  Score: {a.score} — Needs improvement
                </div>
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: scoreColor(a.score),
                  fontFamily: "'Orbitron',sans-serif",
                }}
              >
                {a.score}
              </div>
            </GlowCard>
          ))}
        </>
      )}
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "#4a8a9b",
          margin: "20px 0 10px",
        }}
      >
        SESSION STATS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "Active Time", v: "4h 32m", i: "⏱" },
          { l: "Corrections", v: "23", i: "↺" },
          { l: "Best Streak", v: "48 min", i: "🔥" },
          { l: "Alerts Today", v: "7", i: "🔔" },
        ].map((s) => (
          <GlowCard
            key={s.l}
            style={{ padding: "14px 16px", textAlign: "center" }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.i}</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#e0f0ff",
                fontFamily: "'Orbitron',sans-serif",
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 10, color: "#4a8a9b", letterSpacing: 1 }}>
              {s.l.toUpperCase()}
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}

function MonitorPage() {
  const [selected, setSelected] = useState(null);
  const [pose, setPose] = useState("standing");
  const pts = pose === "sitting" ? BODY_POINTS_SITTING : BODY_POINTS_STANDING;
  const info = selected ? pts.find((p) => p.id === selected) : null;
  const poseOverall = Math.round(
    pts.reduce((s, p) => s + p.score, 0) / pts.length,
  );
  return (
    <div
      style={{
        padding: "12px 16px 100px",
        maxWidth: 480,
        margin: "0 auto",
        height: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 16,
              color: "#e0f0ff",
              margin: 0,
              fontFamily: "'Orbitron',sans-serif",
            }}
          >
            Active Monitor
          </h2>
          <div style={{ fontSize: 10, color: "#00e5a0", letterSpacing: 1 }}>
            ● LIVE — {pts.length} points
          </div>
        </div>
        <div
          style={{
            background: "rgba(0,229,160,0.1)",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 10,
            color: "#00e5a0",
            border: "1px solid rgba(0,229,160,0.2)",
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          Score: {poseOverall}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 8,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(0,229,160,0.15)",
        }}
      >
        {["standing", "sitting"].map((p) => (
          <button
            key={p}
            onClick={() => {
              setPose(p);
              setSelected(null);
            }}
            style={{
              flex: 1,
              padding: "9px 0",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1.5,
              background:
                pose === p ? "rgba(0,229,160,0.15)" : "rgba(10,25,47,0.8)",
              color: pose === p ? "#00e5a0" : "#4a7a9b",
              border: "none",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              transition: "all 0.3s",
            }}
          >
            {p === "standing" ? "🧍 STANDING" : "🪑 SITTING"}
          </button>
        ))}
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(0,229,160,0.1)",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(0,40,60,0.6), rgba(5,12,24,0.97))",
          position: "relative",
          boxShadow: "inset 0 0 60px rgba(0,229,160,0.03)",
        }}
      >
        <WireframeBody
          onPointClick={setSelected}
          selectedPoint={selected}
          pose={pose}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            fontSize: 9,
            color: "#2a5a7b",
            letterSpacing: 1,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          DRAG TO ROTATE • TAP POINTS
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontSize: 9,
            color: "#1a4a6b",
            fontFamily: "'JetBrains Mono',monospace",
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          MESH: HIGH-POLY
          <br />
          JOINTS: {pts.length}
          <br />
          POSE: {pose.toUpperCase()}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            display: "flex",
            gap: 12,
            fontSize: 9,
          }}
        >
          {[
            { c: "#00e5a0", l: "Good 85+" },
            { c: "#f0c040", l: "Fair 65-84" },
            { c: "#ff6b6b", l: "Poor <65" },
          ].map((x) => (
            <div
              key={x.l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#5b8a9b",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: x.c,
                  boxShadow: `0 0 6px ${x.c}44`,
                }}
              />
              {x.l}
            </div>
          ))}
        </div>
      </div>
      {info ? (
        <GlowCard
          glow={`${scoreColor(info.score)}33`}
          style={{ marginTop: 10, padding: 14 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#e0f0ff" }}>
                {info.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: scoreColor(info.score),
                  marginTop: 2,
                }}
              >
                {scoreLabel(info.score)} — Score {info.score}/100
              </div>
            </div>
            <CircularGauge score={info.score} size={56} />
          </div>
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 6,
            }}
          >
            {[
              { l: "Angle", v: `${(Math.random() * 15 + 5).toFixed(1)}°` },
              { l: "Deviation", v: `${(Math.random() * 8).toFixed(1)}mm` },
              { l: "Tension", v: `${(Math.random() * 40 + 30).toFixed(0)}%` },
              { l: "Trend", v: info.score > 75 ? "↑ +3" : "↓ -2" },
            ].map((m) => (
              <div
                key={m.l}
                style={{
                  background: "rgba(0,229,160,0.06)",
                  borderRadius: 8,
                  padding: "5px 6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 8, color: "#4a8a9b", letterSpacing: 1 }}
                >
                  {m.l.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e0f0ff",
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {m.v}
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      ) : (
        <div
          style={{
            marginTop: 10,
            textAlign: "center",
            fontSize: 12,
            color: "#3a6a8b",
            padding: 8,
          }}
        >
          Tap any sensor point on the body to inspect metrics
        </div>
      )}
      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "repeat(8,1fr)",
          gap: 3,
        }}
      >
        {pts.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            style={{
              background:
                selected === p.id
                  ? `${scoreColor(p.score)}22`
                  : "rgba(10,25,47,0.8)",
              border: `1px solid ${selected === p.id ? scoreColor(p.score) : "rgba(0,229,160,0.08)"}`,
              borderRadius: 6,
              padding: "5px 2px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: scoreColor(p.score),
                margin: "0 auto 2px",
                boxShadow:
                  selected === p.id ? `0 0 6px ${scoreColor(p.score)}` : "none",
              }}
            />
            <div
              style={{
                fontSize: 6,
                color: "#5b8a9b",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {p.label.split(" ")[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DevicesPage() {
  const [subTab, setSubTab] = useState("list");
  const [paired, setPaired] = useState([
    { ...DEVICES[0], paired: true, battery: 82, signal: "Strong" },
  ]);
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState([]);
  const [pairing, setPairing] = useState(null);
  const [pairStep, setPairStep] = useState(0);
  const [viewDevice, setViewDevice] = useState(null);
  const startScan = () => {
    setScanning(true);
    setFound([]);
    let i = 0;
    const add = () => {
      if (i < DEVICES.length) {
        const d = DEVICES[i];
        if (!paired.find((p) => p.id === d.id))
          setFound((prev) => [...prev, d]);
        i++;
        setTimeout(add, 600 + Math.random() * 800);
      } else setScanning(false);
    };
    setTimeout(add, 1200);
  };
  const startPair = (device) => {
    setPairing(device);
    setPairStep(0);
    [1, 2, 3, 4].forEach((s, i) =>
      setTimeout(() => setPairStep(s), (i + 1) * 1100),
    );
    setTimeout(() => {
      setPaired((prev) => [
        ...prev,
        {
          ...device,
          paired: true,
          battery: Math.round(Math.random() * 40 + 60),
          signal: "Strong",
        },
      ]);
      setPairing(null);
      setPairStep(0);
      setSubTab("list");
      setFound([]);
    }, 5200);
  };

  if (viewDevice) {
    const d = viewDevice;
    return (
      <div
        style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}
      >
        <button
          onClick={() => setViewDevice(null)}
          style={{
            background: "none",
            border: "none",
            color: "#00e5a0",
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
            marginBottom: 16,
            fontFamily: "'JetBrains Mono',monospace",
          }}
        >
          ← Back
        </button>
        <GlowCard
          style={{ padding: 24, textAlign: "center", marginBottom: 16 }}
        >
          <div style={{ fontSize: 52, marginBottom: 8 }}>{d.icon}</div>
          <h2
            style={{
              fontSize: 20,
              color: "#e0f0ff",
              margin: "0 0 4px",
              fontFamily: "'Orbitron',sans-serif",
            }}
          >
            {d.name}
          </h2>
          <div style={{ fontSize: 12, color: "#4a8a9b" }}>{d.type}</div>
          <div
            style={{
              display: "inline-block",
              marginTop: 10,
              background: "rgba(0,229,160,0.1)",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 11,
              color: "#00e5a0",
              border: "1px solid rgba(0,229,160,0.2)",
            }}
          >
            ● Connected
          </div>
        </GlowCard>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {[
            { l: "Battery", v: `${d.battery}%`, i: "🔋" },
            { l: "Signal", v: d.signal, i: "📶" },
            { l: "Firmware", v: "v3.2.1", i: "⚙️" },
            { l: "Uptime", v: "4h 12m", i: "⏱" },
          ].map((s) => (
            <GlowCard key={s.l} style={{ padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.i}</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#e0f0ff",
                  fontFamily: "'Orbitron',sans-serif",
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 10, color: "#4a8a9b", letterSpacing: 1 }}>
                {s.l.toUpperCase()}
              </div>
            </GlowCard>
          ))}
        </div>
        <GlowCard style={{ padding: 16, marginBottom: 10 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              color: "#4a8a9b",
              marginBottom: 10,
            }}
          >
            SENSOR OUTPUT
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {[
              { l: "Accel X", v: "0.12g" },
              { l: "Accel Y", v: "-0.98g" },
              { l: "Accel Z", v: "0.04g" },
              { l: "Gyro X", v: "1.2°/s" },
              { l: "Gyro Y", v: "-0.3°/s" },
              { l: "Gyro Z", v: "0.8°/s" },
            ].map((s) => (
              <div
                key={s.l}
                style={{
                  background: "rgba(0,229,160,0.04)",
                  borderRadius: 8,
                  padding: "6px 8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 8, color: "#3a6a8b", letterSpacing: 1 }}
                >
                  {s.l.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#00e5a0",
                    fontFamily: "'JetBrains Mono',monospace",
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
        <GlowCard style={{ padding: 16 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              color: "#4a8a9b",
              marginBottom: 10,
            }}
          >
            DATA STREAM
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              color: "#2a6a5b",
              lineHeight: 1.8,
              maxHeight: 100,
              overflow: "hidden",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ opacity: 1 - i * 0.1 }}>
                [{new Date(Date.now() - i * 2000).toLocaleTimeString()}] pos=(
                {(Math.random() * 0.2 - 0.1).toFixed(3)},
                {(Math.random() * 0.2 + 0.8).toFixed(3)},
                {(Math.random() * 0.1 - 0.05).toFixed(3)}) q=OK
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: 18,
          color: "#e0f0ff",
          margin: "0 0 16px",
          fontFamily: "'Orbitron',sans-serif",
        }}
      >
        Devices
      </h2>
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid rgba(0,229,160,0.15)",
        }}
      >
        {["list", "add"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setSubTab(t);
              if (t === "add") startScan();
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              background:
                subTab === t ? "rgba(0,229,160,0.15)" : "rgba(10,25,47,0.8)",
              color: subTab === t ? "#00e5a0" : "#4a7a9b",
              border: "none",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {t === "list" ? "MY DEVICES" : "＋ ADD DEVICE"}
          </button>
        ))}
      </div>
      {subTab === "list" ? (
        paired.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#3a6a8b" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
            <div>No devices paired yet</div>
            <button
              onClick={() => {
                setSubTab("add");
                startScan();
              }}
              style={{
                marginTop: 16,
                padding: "10px 24px",
                borderRadius: 10,
                background: "rgba(0,229,160,0.15)",
                border: "1px solid rgba(0,229,160,0.3)",
                color: "#00e5a0",
                cursor: "pointer",
              }}
            >
              Add a Device
            </button>
          </div>
        ) : (
          paired.map((d) => (
            <GlowCard
              key={d.id}
              onClick={() => setViewDevice(d)}
              style={{
                marginBottom: 10,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 32 }}>{d.icon}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#e0f0ff" }}
                >
                  {d.name}
                </div>
                <div style={{ fontSize: 11, color: "#4a8a9b" }}>{d.type}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#00e5a0" }}>
                  ● Connected
                </div>
                <div style={{ fontSize: 10, color: "#4a8a9b" }}>
                  🔋 {d.battery}%
                </div>
              </div>
            </GlowCard>
          ))
        )
      ) : pairing ? (
        <GlowCard style={{ padding: 30, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{pairing.icon}</div>
          <h3
            style={{
              color: "#e0f0ff",
              margin: "0 0 8px",
              fontFamily: "'Orbitron',sans-serif",
              fontSize: 16,
            }}
          >
            Pairing {pairing.name}
          </h3>
          <div style={{ margin: "20px 0" }}>
            {["Discovering", "Authenticating", "Calibrating", "Complete"].map(
              (step, i) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      background:
                        pairStep > i
                          ? "rgba(0,229,160,0.2)"
                          : pairStep === i
                            ? "rgba(240,192,64,0.2)"
                            : "rgba(10,25,47,0.5)",
                      border: `1px solid ${pairStep > i ? "#00e5a0" : pairStep === i ? "#f0c040" : "#1a3a5a"}`,
                      color:
                        pairStep > i
                          ? "#00e5a0"
                          : pairStep === i
                            ? "#f0c040"
                            : "#3a5a7b",
                    }}
                  >
                    {pairStep > i ? "✓" : pairStep === i ? "●" : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: pairStep >= i ? "#e0f0ff" : "#3a5a7b",
                    }}
                  >
                    {step}
                  </span>
                </div>
              ),
            )}
          </div>
          <div
            style={{
              width: "100%",
              height: 4,
              borderRadius: 2,
              background: "#0a1a2a",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #00e5a0, #0088ff)",
                borderRadius: 2,
                width: `${(pairStep / 4) * 100}%`,
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </GlowCard>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            {scanning && (
              <div
                style={{
                  display: "inline-block",
                  position: "relative",
                  width: 60,
                  height: 60,
                  marginBottom: 8,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px solid rgba(0,229,160,0.3)",
                      borderRadius: "50%",
                      animation: `scanPulse 2s ease-out ${i * 0.5}s infinite`,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    inset: 20,
                    background: "rgba(0,229,160,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  📡
                </div>
              </div>
            )}
            <div
              style={{ fontSize: 12, color: scanning ? "#00e5a0" : "#4a7a9b" }}
            >
              {scanning ? "Scanning..." : found.length + " device(s) found"}
            </div>
          </div>
          {found.map((d) => (
            <GlowCard
              key={d.id}
              style={{
                marginBottom: 10,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 32 }}>{d.icon}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: "#e0f0ff" }}
                >
                  {d.name}
                </div>
                <div style={{ fontSize: 11, color: "#4a8a9b" }}>{d.desc}</div>
              </div>
              <button
                onClick={() => startPair(d)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "rgba(0,229,160,0.15)",
                  border: "1px solid rgba(0,229,160,0.3)",
                  color: "#00e5a0",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Pair
              </button>
            </GlowCard>
          ))}
          {!scanning && found.length === 0 && (
            <div style={{ textAlign: "center", padding: 20 }}>
              <button
                onClick={startScan}
                style={{
                  padding: "10px 24px",
                  borderRadius: 10,
                  background: "rgba(0,229,160,0.1)",
                  border: "1px solid rgba(0,229,160,0.2)",
                  color: "#00e5a0",
                  cursor: "pointer",
                }}
              >
                Rescan
              </button>
            </div>
          )}
        </>
      )}
      <style>{`@keyframes scanPulse{0%{transform:scale(0.6);opacity:1}100%{transform:scale(1.8);opacity:0}}`}</style>
    </div>
  );
}

function NewsPage() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div
      style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: 18,
          color: "#e0f0ff",
          margin: "0 0 4px",
          fontFamily: "'Orbitron',sans-serif",
        }}
      >
        News & Updates
      </h2>
      <div
        style={{
          fontSize: 11,
          color: "#4a8a9b",
          letterSpacing: 1,
          marginBottom: 20,
        }}
      >
        POSTURE HEALTH INTELLIGENCE
      </div>
      {NEWS_ITEMS.map((n) => (
        <GlowCard
          key={n.id}
          onClick={() => setExpanded(expanded === n.id ? null : n.id)}
          style={{ marginBottom: 12, padding: 16, cursor: "pointer" }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28 }}>{n.img}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: 1,
                    color: "#00e5a0",
                    background: "rgba(0,229,160,0.1)",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}
                >
                  {n.tag.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, color: "#3a5a7b" }}>{n.date}</span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#e0f0ff",
                  lineHeight: 1.3,
                }}
              >
                {n.title}
              </div>
              {expanded === n.id && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#7899aa",
                    lineHeight: 1.6,
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  {n.excerpt}
                </div>
              )}
            </div>
          </div>
        </GlowCard>
      ))}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

function AboutPage() {
  return (
    <div
      style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <span
          style={{
            fontFamily: "'Orbitron',sans-serif",
            fontWeight: 900,
            fontSize: 28,
            background: "linear-gradient(135deg, #00e5a0, #0088ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Seston
        </span>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: "#4a8a9b",
            marginTop: 4,
          }}
        >
          POSTURE INTELLIGENCE SYSTEMS
        </div>
      </div>
      <GlowCard style={{ padding: 20, marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#8899aa", lineHeight: 1.7 }}>
          Seston Health is pioneering the future of postural health through
          AI-driven wearable sensor networks. Our mission is to eliminate
          preventable musculoskeletal disorders by making real-time posture
          intelligence accessible to everyone.
        </div>
      </GlowCard>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "#4a8a9b",
          marginBottom: 10,
        }}
      >
        BY THE NUMBERS
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          { v: "2.4M+", l: "Users Worldwide" },
          { v: "180+", l: "Clinical Partners" },
          { v: "47%", l: "Pain Reduction" },
          { v: "$32M", l: "Series B Funded" },
        ].map((s) => (
          <GlowCard key={s.l} style={{ padding: 16, textAlign: "center" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#00e5a0",
                fontFamily: "'Orbitron',sans-serif",
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#4a8a9b",
                marginTop: 4,
                letterSpacing: 1,
              }}
            >
              {s.l.toUpperCase()}
            </div>
          </GlowCard>
        ))}
      </div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "#4a8a9b",
          marginBottom: 10,
        }}
      >
        LEADERSHIP
      </div>
      {[
        {
          name: "Dr. Benz",
          role: "CEO & Co-Founder",
          bg: "Biomedical Engineering, Stanford",
        },
        {
          name: "Dr. Yok",
          role: "CTO & Co-Founder",
          bg: "ML Research, DeepMind",
        },
        {
          name: "Dr. Sal",
          role: "Chief Medical Officer",
          bg: "Orthopedic Surgery, Johns Hopkins",
        },
      ].map((p) => (
        <GlowCard
          key={p.name}
          style={{
            marginBottom: 10,
            padding: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              background:
                "linear-gradient(135deg, rgba(0,229,160,0.3), rgba(0,136,255,0.3))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#e0f0ff",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {p.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0f0ff" }}>
              {p.name}
            </div>
            <div style={{ fontSize: 11, color: "#00e5a0" }}>{p.role}</div>
            <div style={{ fontSize: 10, color: "#4a7a9b" }}>{p.bg}</div>
          </div>
        </GlowCard>
      ))}
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "#4a8a9b",
          margin: "20px 0 10px",
        }}
      >
        CONTACT
      </div>
      <GlowCard style={{ padding: 16 }}>
        {[
          { l: "Email", v: "hello@Seston.health" },
          { l: "HQ", v: "Bangkok Thailand" },
          { l: "Web", v: "www.Seston.health" },
          { l: "Support", v: "support@Seston.health" },
        ].map((c) => (
          <div
            key={c.l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              borderBottom: "1px solid rgba(0,229,160,0.05)",
            }}
          >
            <span style={{ fontSize: 11, color: "#4a7a9b" }}>{c.l}</span>
            <span style={{ fontSize: 11, color: "#8899aa" }}>{c.v}</span>
          </div>
        ))}
      </GlowCard>
      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          fontSize: 10,
          color: "#2a4a5b",
        }}
      >
        © 2026 Seston Health Inc.
        <br />
        v3.2.1 · Build 2026.02.10
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
const TABS = [
  { id: "home", label: "Home", icon: "⬡" },
  { id: "monitor", label: "Monitor", icon: "◎" },
  { id: "devices", label: "Devices", icon: "⊞" },
  { id: "news", label: "News", icon: "◈" },
  { id: "about", label: "About", icon: "ⓘ" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #050c18 0%, #0a1628 40%, #081020 100%)",
        color: "#c0d8ee",
        fontFamily: "'Instrument Sans','Segoe UI',sans-serif",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,229,160,0.2);border-radius:2px}button{font-family:inherit}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div
        style={{
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          animation: "slideUp 0.3s ease",
        }}
        key={tab}
      >
        {tab === "home" && <HomePage />}
        {tab === "monitor" && <MonitorPage />}
        {tab === "devices" && <DevicesPage />}
        {tab === "news" && <NewsPage />}
        {tab === "about" && <AboutPage />}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background:
            "linear-gradient(180deg, rgba(5,12,24,0.9), rgba(8,16,32,0.98))",
          borderTop: "1px solid rgba(0,229,160,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(20px)",
          zIndex: 100,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "8px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
              maxWidth: 80,
            }}
          >
            {tab === t.id && (
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  left: "25%",
                  right: "25%",
                  height: 2,
                  background: "#00e5a0",
                  borderRadius: 1,
                }}
              />
            )}
            <span
              style={{
                fontSize: 18,
                filter:
                  tab === t.id
                    ? "drop-shadow(0 0 6px rgba(0,229,160,0.6))"
                    : "none",
              }}
            >
              {t.icon}
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: 1,
                color: tab === t.id ? "#00e5a0" : "#3a5a7b",
                fontWeight: tab === t.id ? 700 : 400,
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              {t.label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
