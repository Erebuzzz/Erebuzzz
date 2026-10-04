import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import anime from 'animejs';
import { RepoGraph, RepoGraphNode, getRepoGraph } from '../data/repoGraphs';
import { Project } from '../data/projects';
import { soundManager } from '../utils/audio';
import { RotateCcw, Compass } from 'lucide-react';

interface MythicBlueprintCosmosProps {
  project: Project;
  selectedNode: RepoGraphNode | null;
  onSelectNode: (node: RepoGraphNode) => void;
  activeCluster: string | null;
  theme?: 'dark' | 'light';
}

interface ProjectedPoint {
  x: number;
  y: number;
  visible: boolean;
}

export const MythicBlueprintCosmos: React.FC<MythicBlueprintCosmosProps> = ({
  project,
  selectedNode,
  onSelectNode,
  activeCluster,
  theme = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  const [projectedPositions, setProjectedPositions] = useState<Record<string, ProjectedPoint>>({});

  const graph: RepoGraph = useMemo(() => {
    return getRepoGraph(project.id, project);
  }, [project]);

  // Three.js scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const apolloSpotlightRef = useRef<THREE.SpotLight | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const sapPulseMeshesRef = useRef<{ mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; speed: number; offset: number }[]>([]);
  const sporesParticlesRef = useRef<THREE.Points | null>(null);

  // Mouse orbit & cursor state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    radius: 8.5
  });
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // 1. Initialize Scene, Botanical Roots, Leaves, and Sap Pulses
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // A. Scene & Atmosphere (Subterranean Underworld Cavern)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(theme === 'dark' ? 0x070503 : 0xf2ebe0, 0.075);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // B. Lighting: Deep Erebus shadows + Apollo's golden god-ray spotlight
    const ambientLight = new THREE.AmbientLight(theme === 'dark' ? 0x1f1610 : 0xede0cf, 0.9);
    scene.add(ambientLight);

    // Warm subterranean root hearth light at origin
    const hearthLight = new THREE.PointLight(0xf59e0b, 2.8, 16);
    hearthLight.position.set(0, -0.4, 0);
    scene.add(hearthLight);

    // Apollo's penetrating sunray spotlight tracking cursor
    const apolloSpotlight = new THREE.SpotLight(0xffca3a, 5.0, 24, Math.PI / 3.5, 0.45, 1.2);
    apolloSpotlight.position.set(0, 9, 5);
    apolloSpotlight.target.position.set(0, 0, 0);
    scene.add(apolloSpotlight);
    scene.add(apolloSpotlight.target);
    apolloSpotlightRef.current = apolloSpotlight;

    // C. Floating Bioluminescent Cavern Spores & Embers
    const sporeCount = 220;
    const sporeGeom = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    for (let i = 0; i < sporeCount; i++) {
      sporePos[i * 3] = (Math.random() - 0.5) * 16;
      sporePos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      sporePos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    sporeGeom.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));
    const sporeMat = new THREE.PointsMaterial({
      color: theme === 'dark' ? 0xf59e0b : 0xb45309,
      size: 0.085,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const sporesParticles = new THREE.Points(sporeGeom, sporeMat);
    scene.add(sporesParticles);
    sporesParticlesRef.current = sporesParticles;

    // D. Helper to Create Organic 3D Leaf Geometry
    const createLeafGeometry = (size: number) => {
      const shape = new THREE.Shape();
      const length = size * 1.8;
      const width = size * 0.95;
      shape.moveTo(0, -length * 0.5);
      shape.quadraticCurveTo(width, 0, 0, length * 0.5);
      shape.quadraticCurveTo(-width, 0, 0, -length * 0.5);
      return new THREE.ExtrudeGeometry(shape, {
        depth: size * 0.08,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: size * 0.04,
        bevelThickness: size * 0.04
      });
    };

    // E. Helper to Create Amber Seed Bulb / Pod Geometry
    const createBulbGeometry = (size: number) => {
      return new THREE.SphereGeometry(size * 0.85, 24, 24);
    };

    // F. Construct 3D Botanical Nodes (Roots, Leaves, and Seed Bulbs)
    const nodeGroupsMap = new Map<string, THREE.Group>();

    graph.nodes.forEach((node) => {
      const group = new THREE.Group();
      group.position.set(...node.position);
      group.userData = { nodeId: node.id, nodeData: node };

      if (node.botanicalType === 'taproot') {
        // Primordial Root Knot: Ancient gnarled root cluster with inner amber flame
        const knotGeom = new THREE.TorusKnotGeometry(node.size * 0.75, node.size * 0.22, 64, 16, 2, 3);
        const knotMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(theme === 'dark' ? 0x1f1610 : 0x3d2c20),
          roughness: 0.8,
          metalness: 0.2,
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.4
        });
        const knotMesh = new THREE.Mesh(knotGeom, knotMat);
        group.add(knotMesh);

        // Core glowing amber hearth
        const hearthCore = new THREE.Mesh(
          new THREE.SphereGeometry(node.size * 0.45, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.9 })
        );
        group.add(hearthCore);
      } else if (node.botanicalType === 'leaf') {
        // Golden Laurel Leaf: Shimmering metallic laurel leaf with delicate curved stem
        const leafGeom = createLeafGeometry(node.size);
        const leafMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xf59e0b),
          metalness: 0.8,
          roughness: 0.25,
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.45,
          side: THREE.DoubleSide
        });
        const leafMesh = new THREE.Mesh(leafGeom, leafMat);
        // Tilt leaf naturally along root axis
        leafMesh.rotation.x = Math.PI / 4;
        leafMesh.rotation.z = Math.PI / 6;
        group.add(leafMesh);

        // Vein filament
        const stemGeom = new THREE.CylinderGeometry(0.015, 0.025, node.size * 1.6, 8);
        const stemMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
        const stemMesh = new THREE.Mesh(stemGeom, stemMat);
        group.add(stemMesh);
      } else if (node.botanicalType === 'bulb') {
        // Amber Seed Pod: Translucent amber resin bulb with inner golden seed
        const bulbGeom = createBulbGeometry(node.size);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xf59e0b),
          roughness: 0.15,
          metalness: 0.1,
          transparent: true,
          opacity: 0.8,
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.6
        });
        const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
        group.add(bulbMesh);

        const innerSeed = new THREE.Mesh(
          new THREE.SphereGeometry(node.size * 0.4, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        group.add(innerSeed);
      } else {
        // Bough or Tendril Node: Gnarled wooden root joint with glowing runic bark
        const boughGeom = new THREE.DodecahedronGeometry(node.size * 0.8, 1);
        const boughMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(theme === 'dark' ? 0x221a12 : 0x4a3a2c),
          roughness: 0.75,
          metalness: 0.25,
          emissive: new THREE.Color(node.color),
          emissiveIntensity: 0.35
        });
        const boughMesh = new THREE.Mesh(boughGeom, boughMat);
        group.add(boughMesh);

        // Core pulse
        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(node.size * 0.35, 12, 12),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(node.color), transparent: true, opacity: 0.8 })
        );
        group.add(pulse);
      }

      // Start scaled down for Anime.js staggered growth entrance
      group.scale.set(0.001, 0.001, 0.001);
      scene.add(group);
      nodeGroupsMap.set(node.id, group);
    });
    nodeMeshesRef.current = nodeGroupsMap;

    // G. Create Curving Organic Subterranean Root Tubes & Flowing Sap Droplets
    const sapPulseList: { mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; speed: number; offset: number }[] = [];

    graph.edges.forEach((edge, idx) => {
      const srcNode = graph.nodes.find(n => n.id === edge.source);
      const tgtNode = graph.nodes.find(n => n.id === edge.target);
      if (!srcNode || !tgtNode) return;

      const p1 = new THREE.Vector3(...srcNode.position);
      const p2 = new THREE.Vector3(...tgtNode.position);

      // Construct organic curving botanical midpoint
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(dir, up).normalize();

      // Alternating root twists
      const bendFactor = (idx % 2 === 0 ? 0.45 : -0.45);
      mid.addScaledVector(normal, bendFactor);
      mid.y += (idx % 3 === 0 ? 0.3 : -0.35);

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);

      // 1. Outer Gnarled Bark Tube
      const outerTubeGeom = new THREE.TubeGeometry(curve, 28, 0.045, 8, false);
      const outerTubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(theme === 'dark' ? 0x1c1510 : 0x3d3024),
        roughness: 0.85,
        metalness: 0.15
      });
      const outerTube = new THREE.Mesh(outerTubeGeom, outerTubeMat);
      scene.add(outerTube);

      // 2. Inner Glowing Liquid Amber Sap Conduit
      const sapTubeGeom = new THREE.TubeGeometry(curve, 28, 0.02, 6, false);
      const sapTubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(edge.color || '#f59e0b'),
        emissive: new THREE.Color(edge.color || '#f59e0b'),
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.8
      });
      const sapTube = new THREE.Mesh(sapTubeGeom, sapTubeMat);
      scene.add(sapTube);

      // 3. Traveling Golden Sap Pulse Particle
      const pulseGeom = new THREE.SphereGeometry(0.065, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xffedd5,
        transparent: true,
        opacity: 0.95
      });
      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
      scene.add(pulseMesh);

      sapPulseList.push({
        mesh: pulseMesh,
        curve,
        speed: 0.25 + (idx % 3) * 0.08,
        offset: (idx * 0.18) % 1.0
      });
    });
    sapPulseMeshesRef.current = sapPulseList;

    // H. Master Anime.js Subterranean Growth Timeline
    const masterTimeline = anime.timeline({ easing: 'easeOutExpo' });

    // Step 1: Apollo's sunray penetrates subterranean gloom
    masterTimeline.add({
      targets: apolloSpotlight.position,
      x: [0, 3],
      y: [14, 8],
      z: [8, 5],
      duration: 850,
      easing: 'easeOutCubic'
    });

    // Step 2: Staggered root & leaf growth explosion
    const groupsArray = Array.from(nodeGroupsMap.values());
    masterTimeline.add({
      targets: groupsArray.map(g => g.scale),
      x: [0.001, 1],
      y: [0.001, 1],
      z: [0.001, 1],
      delay: anime.stagger(85, { from: 'center', start: 120 }),
      duration: 950,
      easing: 'easeOutElastic(1.3, 0.5)'
    }, '-=550');

    // Step 3: Sacred Greek Meandros & constellation link trace
    if (svgOverlayRef.current) {
      const paths = svgOverlayRef.current.querySelectorAll('.meandros-line, .root-filament');
      masterTimeline.add({
        targets: paths,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 800,
        delay: anime.stagger(35),
        easing: 'easeInOutSine'
      }, '-=650');
    }

    // I. Render Loop: Camera interpolation, sap pulses & organic breathing
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation based on spherical coordinates
      const { theta, phi, radius } = cameraAngleRef.current;
      const targetCamX = targetLookAtRef.current.x + radius * Math.sin(phi) * Math.sin(theta);
      const targetCamY = targetLookAtRef.current.y + radius * Math.cos(phi);
      const targetCamZ = targetLookAtRef.current.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;

      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.08);
      camera.lookAt(currentLookAtRef.current);

      // Organic gentle swaying of leaves and roots
      nodeGroupsMap.forEach((group, id) => {
        const node = group.userData.nodeData as RepoGraphNode;
        if (node.botanicalType === 'leaf') {
          group.rotation.z = Math.sin(elapsed * 1.8 + id.charCodeAt(0)) * 0.08;
          group.rotation.y += delta * 0.25;
        } else if (node.botanicalType === 'taproot') {
          group.rotation.y += delta * 0.15;
        } else {
          group.rotation.y += delta * 0.3;
        }

        // Dim nodes outside active cluster if filter is active
        if (activeCluster && node.cluster !== activeCluster) {
          group.traverse((child) => {
            if ((child as THREE.Mesh).material) {
              const mat = (child as THREE.Mesh).material as THREE.Material;
              mat.transparent = true;
              mat.opacity = 0.2;
            }
          });
        } else {
          group.traverse((child) => {
            if ((child as THREE.Mesh).material) {
              const mat = (child as THREE.Mesh).material as THREE.Material;
              mat.opacity = 1.0;
            }
          });
        }
      });

      // Animate golden sap droplets flowing through root conduits
      sapPulseList.forEach((pulse) => {
        const t = (elapsed * pulse.speed + pulse.offset) % 1.0;
        const pt = pulse.curve.getPointAt(t);
        pulse.mesh.position.copy(pt);
      });

      // Drift cavern spores
      if (sporesParticlesRef.current) {
        sporesParticlesRef.current.rotation.y = elapsed * 0.02;
        sporesParticlesRef.current.rotation.x = Math.sin(elapsed * 0.015) * 0.03;
      }

      // Project 3D node coordinates to 2D screen coordinates for SVG overlay
      const curW = container.clientWidth;
      const curH = container.clientHeight;
      const projections: Record<string, ProjectedPoint> = {};

      nodeGroupsMap.forEach((group, id) => {
        const tempV = new THREE.Vector3();
        group.getWorldPosition(tempV);
        tempV.project(camera);

        const x = (tempV.x * 0.5 + 0.5) * curW;
        const y = (-(tempV.y * 0.5) + 0.5) * curH;
        const visible = tempV.z < 1.0;
        projections[id] = { x, y, visible };
      });

      setProjectedPositions(projections);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      masterTimeline.pause();
      renderer.dispose();
    };
  }, [graph, theme, activeCluster]);

  // Pointer move: Apollo Spotlight tracking & camera dragging
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Glide Apollo spotlight with cursor
    if (apolloSpotlightRef.current) {
      anime({
        targets: apolloSpotlightRef.current.target.position,
        x: x * 3.5,
        y: y * 2.5,
        z: 0,
        duration: 220,
        easing: 'easeOutQuad'
      });
    }

    // Camera Orbit Dragging
    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      cameraAngleRef.current.theta -= deltaX * 0.0055;
      cameraAngleRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, cameraAngleRef.current.phi - deltaY * 0.0055)
      );

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasDragging = Math.hypot(
      e.clientX - prevMousePosRef.current.x,
      e.clientY - prevMousePosRef.current.y
    ) > 4;

    isDraggingRef.current = false;

    // Quick click triggers 3D raycast selection
    if (!wasDragging && cameraRef.current && sceneRef.current) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycasterRef.current.setFromCamera(mouse, cameraRef.current);
      const groups = Array.from(nodeMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(groups, true);

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && !hitObj.userData.nodeData && hitObj.parent) {
          hitObj = hitObj.parent;
        }

        if (hitObj && hitObj.userData.nodeData) {
          const clickedNode: RepoGraphNode = hitObj.userData.nodeData;
          handleSelectNode(clickedNode);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    cameraAngleRef.current.radius = Math.max(
      3.8,
      Math.min(14.0, cameraAngleRef.current.radius + e.deltaY * 0.004)
    );
  };

  // Node Selection: Elastic Spring Bounce & Shockwave Pulse through Root System
  const handleSelectNode = (node: RepoGraphNode) => {
    soundManager.playChime();
    onSelectNode(node);

    // Pan camera gently towards selected root / leaf
    anime({
      targets: targetLookAtRef.current,
      x: node.position[0] * 0.5,
      y: node.position[1] * 0.5,
      z: node.position[2] * 0.5,
      duration: 600,
      easing: 'easeOutCubic'
    });

    // Tactile elastic spring bounce on selected node
    const group = nodeMeshesRef.current.get(node.id);
    if (group) {
      anime({
        targets: group.scale,
        x: [1.4, 1.15],
        y: [1.4, 1.15],
        z: [1.4, 1.15],
        duration: 450,
        easing: 'easeOutElastic(1.4, 0.4)'
      });
    }

    // Ripple shockwave through neighboring root branches
    const otherGroups: THREE.Group[] = [];
    nodeMeshesRef.current.forEach((g, id) => {
      if (id !== node.id) otherGroups.push(g);
    });

    anime({
      targets: otherGroups.map(g => g.scale),
      x: [1, 1.08, 1],
      y: [1, 1.08, 1],
      z: [1, 1.08, 1],
      delay: anime.stagger(55, { from: 'first' }),
      duration: 400,
      easing: 'easeOutBack(1.4)'
    });
  };

  const handleResetCamera = () => {
    soundManager.playClick();
    anime({
      targets: targetLookAtRef.current,
      x: 0,
      y: 0,
      z: 0,
      duration: 550,
      easing: 'easeOutCubic'
    });
    cameraAngleRef.current = {
      theta: Math.PI / 4,
      phi: Math.PI / 3.2,
      radius: 8.5
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black select-none"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      {/* 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Dual-Layer SVG Botanical Tendrils & Sigil Halos */}
      <svg 
        ref={svgOverlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sacred Meandros Corner Labyrinths */}
        <g stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.35">
          <path className="meandros-line" d="M 12 36 L 12 12 L 36 12 M 20 36 L 20 20 L 36 20" />
          <path className="meandros-line" d="M 12 calc(100% - 36px) L 12 calc(100% - 12px) L 36 calc(100% - 12px)" />
        </g>

        {/* Dynamic Projected Root Filaments */}
        {graph.edges.map((edge, idx) => {
          const p1 = projectedPositions[edge.source];
          const p2 = projectedPositions[edge.target];
          if (!p1 || !p2 || !p1.visible || !p2.visible) return null;

          const isConnected = selectedNode?.id === edge.source || selectedNode?.id === edge.target;

          return (
            <line
              key={`root-edge-${idx}`}
              className="root-filament"
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isConnected ? "#f59e0b" : "#785330"}
              strokeWidth={isConnected ? "2.4" : "1.2"}
              strokeOpacity={isConnected ? "0.9" : "0.35"}
              strokeDasharray={isConnected ? "none" : "3,3"}
              filter={isConnected ? "url(#amberGlow)" : undefined}
            />
          );
        })}

        {/* 2D Projected Botanical Sigil Tags and Interactive Labels */}
        {graph.nodes.map((node) => {
          const pt = projectedPositions[node.id];
          if (!pt || !pt.visible) return null;

          const isSelected = selectedNode?.id === node.id;

          return (
            <g 
              key={`node-tag-${node.id}`} 
              className="pointer-events-auto cursor-pointer"
              transform={`translate(${pt.x}, ${pt.y})`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectNode(node);
              }}
            >
              {/* Outer pulsing ring for selected leaf/root */}
              {isSelected && (
                <circle
                  r="24"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1.8"
                  strokeDasharray="4,4"
                  className="animate-spin-slow"
                  opacity="0.85"
                />
              )}

              {/* Node Sigil Halo */}
              <circle
                r={isSelected ? "16" : "12"}
                fill="#120c08"
                stroke={node.color}
                strokeWidth={isSelected ? "2.5" : "1.5"}
                filter="url(#amberGlow)"
              />
              <text
                textAnchor="middle"
                dy=".35em"
                fontSize={isSelected ? "12" : "10"}
                fill={node.color}
                fontWeight="bold"
                fontFamily="Georgia, serif"
              >
                {node.mythicSigil}
              </text>

              {/* Subsystem Botanical Label */}
              <text
                x="20"
                y="4"
                fontSize="11"
                fill={isSelected ? "#ffffff" : "#d8c7b8"}
                fontFamily="monospace"
                fontWeight={isSelected ? "bold" : "normal"}
                opacity={isSelected ? "1" : "0.85"}
                className="drop-shadow-md select-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Canvas Quick Controls (Top-Left) */}
      <div className="absolute top-3 left-3 z-20 pointer-events-auto flex items-center gap-2">
        <button
          onClick={handleResetCamera}
          title="Re-center Apollo Spotlight & Tree Camera"
          className="px-2.5 py-1.5 rounded-lg border border-border/80 bg-surface/80 backdrop-blur-md hover:bg-surface-elevated text-text-muted hover:text-text font-mono text-xs flex items-center gap-1.5 transition-colors shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>Re-center Tree</span>
        </button>

        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-text-dim px-2.5 py-1 rounded-lg bg-surface/70 backdrop-blur-md border border-border/60">
          <Compass className="w-3 h-3 text-amber-500" />
          <span>Click leaf or drag to orbit</span>
        </div>
      </div>

    </div>
  );
};
