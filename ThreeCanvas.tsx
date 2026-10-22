import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Plane, Compass, Sparkles, ChevronDown, ChevronUp, RotateCw, ZoomIn, Eye } from 'lucide-react';
import { luxuryAudio } from './AudioEngine';

interface ThreeCanvasProps {
  accentColor?: string;
  celebrityName?: string;
  onExplodeToggle?: (exploded: boolean) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  accentColor = '#D4AF37',
  celebrityName = 'Julian Vance',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<'jet' | 'pass'>('jet');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [viewPreset, setViewPreset] = useState<'quarter' | 'top' | 'front'>('quarter');
  const [autoRotate, setAutoRotate] = useState(true);

  // Mutable refs to pass into render loop
  const stateRef = useRef({
    modelType,
    accentColor,
    viewPreset,
    autoRotate,
    mouseX: 0,
    mouseY: 0,
    targetRotationX: 0,
    targetRotationY: 0,
  });

  useEffect(() => {
    stateRef.current.modelType = modelType;
    stateRef.current.accentColor = accentColor;
    stateRef.current.viewPreset = viewPreset;
    stateRef.current.autoRotate = autoRotate;
  }, [modelType, accentColor, viewPreset, autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.04);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment map using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting rig (Key, Rim, Fill)
    const keyLight = new THREE.DirectionalLight(0xfff0d4, 2.5);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x1a2035, 0x08080a, 1.2);
    scene.add(fillLight);

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.98;
    scene.add(shadowMesh);

    // Procedural Particle Constellation
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = Math.random() * 4 - 1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // -------------------------------------------------------------
    // Procedural Model 1: Composite Gulfstream Private Jet (Group)
    // -------------------------------------------------------------
    const jetGroup = new THREE.Group();

    // Materials
    const jetHullMat = new THREE.MeshPhysicalMaterial({
      color: 0x16181d,
      metalness: 0.85,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const jetGoldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentColor),
      metalness: 0.95,
      roughness: 0.14,
      clearcoat: 1.0,
    });
    const cockpitGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a121c,
      metalness: 0.3,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.6 : 0.95,
      ior: 1.5,
    });

    // 1. Main Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(0.24, 0.22, 2.4, 32);
    const fuselage = new THREE.Mesh(fuselageGeo, jetHullMat);
    fuselage.rotation.x = Math.PI / 2;
    jetGroup.add(fuselage);

    // 2. Nose Cone (Tapered)
    const noseGeo = new THREE.ConeGeometry(0.24, 0.75, 32);
    const nose = new THREE.Mesh(noseGeo, jetHullMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 1.55;
    jetGroup.add(nose);

    // 3. Cockpit Windshield (Glossy glass wrap)
    const glassGeo = new THREE.SphereGeometry(0.25, 24, 16, 0, Math.PI, 0, Math.PI * 0.4);
    const glass = new THREE.Mesh(glassGeo, cockpitGlassMat);
    glass.position.set(0, 0.08, 1.25);
    glass.rotation.x = -0.3;
    jetGroup.add(glass);

    // 4. Swept Main Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(2.2, -0.65);
    wingShape.lineTo(2.1, -0.9);
    wingShape.lineTo(0, -0.35);
    wingShape.closePath();

    const wingExtrude = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.01,
      bevelSegments: 2,
    });

    const rightWing = new THREE.Mesh(wingExtrude, jetHullMat);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.position.set(0.12, -0.04, 0.3);
    jetGroup.add(rightWing);

    const leftWing = new THREE.Mesh(wingExtrude, jetHullMat);
    leftWing.rotation.x = Math.PI / 2;
    leftWing.scale.x = -1;
    leftWing.position.set(-0.12, -0.04, 0.3);
    jetGroup.add(leftWing);

    // 5. Gold Winglets
    const wingletGeo = new THREE.BoxGeometry(0.04, 0.25, 0.15);
    const rightWinglet = new THREE.Mesh(wingletGeo, jetGoldMat);
    rightWinglet.position.set(2.18, 0.1, -0.45);
    rightWinglet.rotation.z = -0.3;
    jetGroup.add(rightWinglet);

    const leftWinglet = new THREE.Mesh(wingletGeo, jetGoldMat);
    leftWinglet.position.set(-2.18, 0.1, -0.45);
    leftWinglet.rotation.z = 0.3;
    jetGroup.add(leftWinglet);

    // 6. Dual Rolls-Royce Jet Turbines (Aft mount)
    const engineGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.65, 24);
    const rightEngine = new THREE.Mesh(engineGeo, jetGoldMat);
    rightEngine.rotation.x = Math.PI / 2;
    rightEngine.position.set(0.38, 0.08, -0.65);
    jetGroup.add(rightEngine);

    const leftEngine = new THREE.Mesh(engineGeo, jetGoldMat);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.position.set(-0.38, 0.08, -0.65);
    jetGroup.add(leftEngine);

    // 7. T-Tail Stabilizers
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0, 0.7);
    finShape.lineTo(-0.35, 0.7);
    finShape.lineTo(-0.55, 0);
    finShape.closePath();
    const finExtrude = new THREE.ExtrudeGeometry(finShape, { depth: 0.03, bevelEnabled: false });
    const verticalFin = new THREE.Mesh(finExtrude, jetHullMat);
    verticalFin.rotation.y = Math.PI / 2;
    verticalFin.position.set(0.015, 0.12, -0.9);
    jetGroup.add(verticalFin);

    const horizFinGeo = new THREE.BoxGeometry(1.0, 0.03, 0.24);
    const horizFin = new THREE.Mesh(horizFinGeo, jetGoldMat);
    horizFin.position.set(0, 0.78, -1.1);
    jetGroup.add(horizFin);

    jetGroup.scale.set(0.9, 0.9, 0.9);
    jetGroup.position.set(0, 0.1, 0);
    scene.add(jetGroup);

    // -------------------------------------------------------------
    // Procedural Model 2: Sovereign VIP Pass / Talisman (Group)
    // -------------------------------------------------------------
    const passGroup = new THREE.Group();

    // 1. Faceted Card Body (Obsidian Dark Glass with Gold Trim)
    const cardShape = new THREE.Shape();
    const cardW = 1.3;
    const cardH = 2.0;
    const r = 0.12;
    cardShape.moveTo(-cardW + r, -cardH);
    cardShape.lineTo(cardW - r, -cardH);
    cardShape.quadraticCurveTo(cardW, -cardH, cardW, -cardH + r);
    cardShape.lineTo(cardW, cardH - r);
    cardShape.quadraticCurveTo(cardW, cardH, cardW - r, cardH);
    cardShape.lineTo(-cardW + r, cardH);
    cardShape.quadraticCurveTo(-cardW, cardH, -cardW, cardH - r);
    cardShape.lineTo(-cardW, -cardH + r);
    cardShape.quadraticCurveTo(-cardW, -cardH, -cardW + r, -cardH);

    const cardGeo = new THREE.ExtrudeGeometry(cardShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    });

    const cardMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c0d11,
      metalness: 0.92,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    passGroup.add(cardMesh);

    // 2. Beveled Gold Border Inlay
    const borderMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentColor),
      metalness: 0.98,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const borderGeo = new THREE.TorusGeometry(0.7, 0.03, 16, 64);
    const borderRing = new THREE.Mesh(borderGeo, borderMat);
    borderRing.position.set(0, 0.2, 0.06);
    passGroup.add(borderRing);

    // 3. Central Sovereign Monogram Octahedron
    const octaGeo = new THREE.OctahedronGeometry(0.38, 0);
    const octa = new THREE.Mesh(octaGeo, borderMat);
    octa.position.set(0, 0.2, 0.08);
    passGroup.add(octa);

    // 4. NFC Chip Gold Contacts
    const chipGeo = new THREE.BoxGeometry(0.45, 0.35, 0.02);
    const chipMesh = new THREE.Mesh(chipGeo, borderMat);
    chipMesh.position.set(-0.7, 1.2, 0.055);
    passGroup.add(chipMesh);

    passGroup.scale.set(0.75, 0.75, 0.75);
    passGroup.position.set(0, 0.1, 0);
    passGroup.visible = false;
    scene.add(passGroup);

    // Mouse pointer listener
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      stateRef.current.mouseX = x;
      stateRef.current.mouseY = y;
    };

    window.addEventListener('mousemove', onPointerMove);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Render loop with exponential damping and software GL safety
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Visibility toggling
      const isJet = stateRef.current.modelType === 'jet';
      jetGroup.visible = isJet;
      passGroup.visible = !isJet;

      // Update accent color dynamically
      const targetColor = new THREE.Color(stateRef.current.accentColor);
      jetGoldMat.color.lerp(targetColor, 0.05);
      borderMat.color.lerp(targetColor, 0.05);

      // Camera preset interpolation
      let targetCamX = 0;
      let targetCamY = 1.4;
      let targetCamZ = 4.2;

      if (stateRef.current.viewPreset === 'top') {
        targetCamX = 0;
        targetCamY = 4.8;
        targetCamZ = 0.01;
      } else if (stateRef.current.viewPreset === 'front') {
        targetCamX = 0;
        targetCamY = 0.4;
        targetCamZ = 3.6;
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, dt);
      camera.lookAt(0, 0.1, 0);

      // Model animation
      const activeObj = isJet ? jetGroup : passGroup;

      if (stateRef.current.autoRotate) {
        activeObj.rotation.y += 0.4 * dt;
      }

      // Parallax mouse responsiveness
      const mouseFactorX = stateRef.current.mouseX * 0.35;
      const mouseFactorY = stateRef.current.mouseY * 0.25;

      activeObj.rotation.x = THREE.MathUtils.damp(
        activeObj.rotation.x,
        isJet ? -0.15 + mouseFactorY : 0.2 - mouseFactorY,
        4,
        dt
      );
      if (!stateRef.current.autoRotate) {
        activeObj.rotation.y = THREE.MathUtils.damp(
          activeObj.rotation.y,
          mouseFactorX * 1.5,
          4,
          dt
        );
      }

      // Pass octahedron spin & hovering
      octa.rotation.y += 1.2 * dt;
      octa.rotation.z = Math.sin(time * 2) * 0.2;
      activeObj.position.y = 0.1 + Math.sin(time * 1.5) * 0.04;

      // Particle subtle flow
      particleSystem.rotation.y = time * 0.02;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      fuselageGeo.dispose();
      jetHullMat.dispose();
      jetGoldMat.dispose();
      cardGeo.dispose();
      cardMat.dispose();
      borderGeo.dispose();
      borderMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0D0E14] via-[#08080A] to-[#040406] border border-[#23242E]">
      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Spec Badging (Zero Viewport Occlusion) */}
      <div className="absolute top-4 left-5 right-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-[#0E0F14]/80 px-3.5 py-2 rounded-xl border border-white/5 backdrop-blur-md pointer-events-auto">
          <Sparkles className="w-4 h-4 text-[#C9A86A]" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#9E9A92] font-mono">
              3D Interactive Showcase
            </div>
            <div className="text-sm font-semibold text-white tracking-wide">
              {modelType === 'jet' ? 'Gulfstream G650ER Private Jet' : 'Sovereign VIP Pass Obsidian Specimen'}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#0E0F14]/80 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-md pointer-events-auto text-xs text-[#B5B0A6]">
          <span>Curated for {celebrityName}</span>
          <span className="text-[#D4AF37]">·</span>
          <span className="font-mono text-[#D4AF37]">92% Payout Tier</span>
        </div>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Follows Section 5 Directives) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[840px] z-20 transition-all duration-300">
        {/* Toggle Collapse Pill */}
        <div className="flex justify-center mb-1.5">
          <button
            onClick={() => {
              luxuryAudio.playClick();
              setIsDockCollapsed(!isDockCollapsed);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#12131A]/90 hover:bg-[#1A1C26] text-[11px] font-medium text-[#C8C4BC] rounded-full border border-white/10 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Show Controls (Cinema Mode)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Container */}
        {!isDockCollapsed && (
          <div className="bg-[#0E1017]/90 border border-white/10 rounded-2xl p-3 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Model Switcher Segmented Control */}
            <div className="flex items-center bg-[#07080B] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => {
                  luxuryAudio.playClick();
                  setModelType('jet');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  modelType === 'jet'
                    ? 'bg-[#1E202B] text-white shadow-sm'
                    : 'text-[#8E8B83] hover:text-[#EDE8DF]'
                }`}
              >
                <Plane className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>Private Jet Fleet</span>
              </button>
              <button
                onClick={() => {
                  luxuryAudio.playClick();
                  setModelType('pass');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  modelType === 'pass'
                    ? 'bg-[#1E202B] text-white shadow-sm'
                    : 'text-[#8E8B83] hover:text-[#EDE8DF]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>VIP Pass Artifact</span>
              </button>
            </div>

            {/* Camera Angle Presets */}
            <div className="flex items-center gap-1.5 text-[#8E8B83]">
              <span className="text-[11px] uppercase tracking-wider font-mono mr-1">Angle:</span>
              {(['quarter', 'front', 'top'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    luxuryAudio.playClick();
                    setViewPreset(preset);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono text-[11px] capitalize transition-colors cursor-pointer ${
                    viewPreset === preset
                      ? 'bg-[#C9A86A] text-black font-semibold'
                      : 'bg-[#14151D] text-[#A6A29A] hover:bg-[#1E202B]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Auto-rotation Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  luxuryAudio.playClick();
                  setAutoRotate(!autoRotate);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                  autoRotate
                    ? 'bg-[#C9A86A]/10 border-[#C9A86A]/40 text-[#E5C378]'
                    : 'bg-[#12131A] border-white/5 text-[#88857E]'
                }`}
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>{autoRotate ? 'Auto Orbit ON' : 'Orbit Paused'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
