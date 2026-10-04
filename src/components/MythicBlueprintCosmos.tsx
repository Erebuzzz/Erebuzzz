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
  const sporeParticlesRef = useRef<THREE.Points | null>(null);

  // Mouse orbit & cursor state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    radius: 9.0
  });
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 0));
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // 1. Initialize Scene, Botanical Tree Trunk, Branches, Leaves, and Fruit
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // A. Subterranean Cavern Scene & Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(theme === 'dark' ? 0x080604 : 0xf4eee4, 0.07);

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
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    // B. Lighting
    const ambientLight = new THREE.AmbientLight(theme === 'dark' ? 0x221810 : 0xf0e4d2, 0.95);
    scene.add(ambientLight);

    // Warm amber glow from the heartwood of the tree
    const heartwoodLight = new THREE.PointLight(0xf59e0b, 2.5, 15);
    heartwoodLight.position.set(0, -0.6, 0);
    scene.add(heartwoodLight);

    // Apollo's golden god-ray spotlight tracking the cursor
    const apolloSpotlight = new THREE.SpotLight(0xffca3a, 5.0, 26, Math.PI / 3.2, 0.4, 1.2);
    apolloSpotlight.position.set(0, 10, 6);
    apolloSpotlight.target.position.set(0, 0.4, 0);
    scene.add(apolloSpotlight);
    scene.add(apolloSpotlight.target);
    apolloSpotlightRef.current = apolloSpotlight;

    // C. Floating Bioluminescent Cavern Spores / Embers
    const sporeCount = 200;
    const sporeGeom = new THREE.BufferGeometry();
    const sporePos = new Float32Array(sporeCount * 3);
    for (let i = 0; i < sporeCount; i++) {
      sporePos[i * 3] = (Math.random() - 0.5) * 16;
      sporePos[i * 3 + 1] = (Math.random() - 0.5) * 12 + 0.5;
      sporePos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    sporeGeom.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));
    const sporeMat = new THREE.PointsMaterial({
      color: theme === 'dark' ? 0xf59e0b : 0xb45309,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const sporeParticles = new THREE.Points(sporeGeom, sporeMat);
    scene.add(sporeParticles);
    sporeParticlesRef.current = sporeParticles;

    // D. Build the Main Ancient Wooden Trunk (Base up to Heartwood fork)
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -3.4, 0),
      new THREE.Vector3(-0.05, -2.4, 0.05),
      new THREE.Vector3(0.04, -1.5, -0.03),
      new THREE.Vector3(0, -0.6, 0)
    ]);
    const trunkGeom = new THREE.TubeGeometry(trunkCurve, 32, 0.16, 12, false);
    const barkMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(theme === 'dark' ? 0x221811 : 0x3d2c20),
      roughness: 0.88,
      metalness: 0.12
    });
    const trunkMesh = new THREE.Mesh(trunkGeom, barkMaterial);
    scene.add(trunkMesh);

    // Inner glowing sap vein through the trunk
    const trunkSapGeom = new THREE.TubeGeometry(trunkCurve, 32, 0.035, 8, false);
    const sapMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.8
    });
    const trunkSapMesh = new THREE.Mesh(trunkSapGeom, sapMaterial);
    scene.add(trunkSapMesh);

    // Root flutes anchoring into the subterranean ground
    const rootFlutePoints = [
      [new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(-0.7, -3.5, 0.4)],
      [new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0.6, -3.6, -0.5)],
      [new THREE.Vector3(0, -3.2, 0), new THREE.Vector3(0.1, -3.6, 0.7)]
    ];
    rootFlutePoints.forEach((pts) => {
      const fluteCurve = new THREE.CatmullRomCurve3(pts);
      const fluteGeom = new THREE.TubeGeometry(fluteCurve, 12, 0.08, 8, false);
      const fluteMesh = new THREE.Mesh(fluteGeom, barkMaterial);
      scene.add(fluteMesh);
    });

    // E. Botanical Mesh Generators: Laurel Leaf Sprig & Hanging Golden Olive
    // 1. A single sculpted golden laurel leaf
    const createLeafShape = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.quadraticCurveTo(0.2, 0.35, 0, 0.7);
      shape.quadraticCurveTo(-0.2, 0.35, 0, 0);
      return new THREE.ExtrudeGeometry(shape, {
        depth: 0.02,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015
      });
    };

    const leafSharedGeom = createLeafShape();
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.82,
      roughness: 0.22,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    // 2. Hanging Golden Olive / Amber Fruit
    const createFruitMesh = (size: number) => {
      const fruitGroup = new THREE.Group();

      // Slender curved stem pedicel hanging down
      const stemCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.4, 0),
        new THREE.Vector3(0.06, 0.2, 0),
        new THREE.Vector3(0, 0, 0)
      ]);
      const stemGeom = new THREE.TubeGeometry(stemCurve, 12, 0.018, 6, false);
      const stemMesh = new THREE.Mesh(stemGeom, barkMaterial);
      fruitGroup.add(stemMesh);

      // Smooth translucent teardrop amber olive
      const oliveGeom = new THREE.SphereGeometry(size * 0.45, 24, 24);
      oliveGeom.scale(0.85, 1.3, 0.85);
      const oliveMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.12,
        metalness: 0.05,
        transparent: true,
        opacity: 0.85,
        emissive: 0xd97706,
        emissiveIntensity: 0.65
      });
      const oliveMesh = new THREE.Mesh(oliveGeom, oliveMat);
      oliveMesh.position.set(0, -0.15, 0);
      fruitGroup.add(oliveMesh);

      // Glowing inner golden seed core
      const seedGeom = new THREE.SphereGeometry(size * 0.18, 12, 12);
      const seedMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
      const seedMesh = new THREE.Mesh(seedGeom, seedMat);
      seedMesh.position.set(0, -0.15, 0);
      fruitGroup.add(seedMesh);

      return fruitGroup;
    };

    // 3. Trifoliate Golden Laurel Leaf Sprig
    const createLaurelSprig = (size: number) => {
      const sprigGroup = new THREE.Group();

      // Central stem
      const stemGeom = new THREE.CylinderGeometry(0.015, 0.025, size * 0.9, 8);
      const stemMesh = new THREE.Mesh(stemGeom, barkMaterial);
      stemMesh.position.set(0, -size * 0.3, 0);
      sprigGroup.add(stemMesh);

      // Center leaf
      const centerLeaf = new THREE.Mesh(leafSharedGeom, leafMaterial);
      centerLeaf.scale.set(size, size, size);
      centerLeaf.position.set(0, 0, 0);
      sprigGroup.add(centerLeaf);

      // Left leaf
      const leftLeaf = new THREE.Mesh(leafSharedGeom, leafMaterial);
      leftLeaf.scale.set(size * 0.85, size * 0.85, size * 0.85);
      leftLeaf.rotation.z = -Math.PI / 4.5;
      leftLeaf.rotation.y = Math.PI / 6;
      leftLeaf.position.set(-0.06, -size * 0.15, 0.02);
      sprigGroup.add(leftLeaf);

      // Right leaf
      const rightLeaf = new THREE.Mesh(leafSharedGeom, leafMaterial);
      rightLeaf.scale.set(size * 0.85, size * 0.85, size * 0.85);
      rightLeaf.rotation.z = Math.PI / 4.5;
      rightLeaf.rotation.y = -Math.PI / 6;
      rightLeaf.position.set(0.06, -size * 0.15, 0.02);
      sprigGroup.add(rightLeaf);

      return sprigGroup;
    };

    // 4. Heartwood Knot at the Tree Fork
    const createHeartwoodKnot = (size: number) => {
      const knotGroup = new THREE.Group();

      // Ancient gnarled wooden knot bole
      const boleGeom = new THREE.DodecahedronGeometry(size * 0.48, 1);
      const boleMesh = new THREE.Mesh(boleGeom, barkMaterial);
      knotGroup.add(boleMesh);

      // Aperture revealing Prometheus' amber flame
      const flameGeom = new THREE.SphereGeometry(size * 0.28, 16, 16);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
      const flameMesh = new THREE.Mesh(flameGeom, flameMat);
      knotGroup.add(flameMesh);

      return knotGroup;
    };

    // F. Instantiate Botanical Nodes
    const nodeGroupsMap = new Map<string, THREE.Group>();

    graph.nodes.forEach((node) => {
      const group = new THREE.Group();
      group.position.set(...node.position);
      group.userData = { nodeId: node.id, nodeData: node };

      if (node.botanicalType === 'trunk') {
        const knot = createHeartwoodKnot(node.size);
        group.add(knot);
      } else if (node.botanicalType === 'fruit') {
        const fruit = createFruitMesh(node.size);
        group.add(fruit);
      } else {
        // 'leaf' (default)
        const sprig = createLaurelSprig(node.size);
        group.add(sprig);
      }

      // Initial scale 0 for Anime.js staggered sprouting
      group.scale.set(0.001, 0.001, 0.001);
      scene.add(group);
      nodeGroupsMap.set(node.id, group);
    });
    nodeMeshesRef.current = nodeGroupsMap;

    // G. Create Curving Organic Tree Branches (`graph.edges`)
    const sapPulseList: { mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; speed: number; offset: number }[] = [];

    graph.edges.forEach((edge, idx) => {
      const srcNode = graph.nodes.find(n => n.id === edge.source);
      const tgtNode = graph.nodes.find(n => n.id === edge.target);
      if (!srcNode || !tgtNode) return;

      const p1 = new THREE.Vector3(...srcNode.position);
      const p2 = new THREE.Vector3(...tgtNode.position);

      // Organic curved bough midpoint with natural downward sag and botanical twist
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(dir, up).normalize();

      // Alternate branch bends
      const bend = (idx % 2 === 0 ? 0.35 : -0.35);
      mid.addScaledVector(normal, bend);
      mid.y -= 0.15; // Natural botanical droop

      const boughCurve = new THREE.CatmullRomCurve3([p1, mid, p2]);

      // 1. Outer Dark Bark Branch Tube
      const branchGeom = new THREE.TubeGeometry(boughCurve, 24, 0.045, 8, false);
      const branchMesh = new THREE.Mesh(branchGeom, barkMaterial);
      scene.add(branchMesh);

      // 2. Inner Glowing Liquid Amber Sap Vein
      const sapVeinGeom = new THREE.TubeGeometry(boughCurve, 24, 0.018, 6, false);
      const sapVeinMesh = new THREE.Mesh(sapVeinGeom, sapMaterial);
      scene.add(sapVeinMesh);

      // 3. Flowing Golden Sap Droplet
      const dropletGeom = new THREE.SphereGeometry(0.045, 8, 8);
      const dropletMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
      const dropletMesh = new THREE.Mesh(dropletGeom, dropletMat);
      scene.add(dropletMesh);

      sapPulseList.push({
        mesh: dropletMesh,
        curve: boughCurve,
        speed: 0.22 + (idx % 3) * 0.06,
        offset: (idx * 0.2) % 1.0
      });
    });
    sapPulseMeshesRef.current = sapPulseList;

    // H. Master Anime.js Botanical Sprouting Timeline
    const masterTimeline = anime.timeline({ easing: 'easeOutExpo' });

    // Step 1: Apollo's sunray beam sweeps from above
    masterTimeline.add({
      targets: apolloSpotlight.position,
      x: [0, 3],
      y: [14, 10],
      z: [8, 6],
      duration: 800,
      easing: 'easeOutCubic'
    });

    // Step 2: Sprouting tree nodes with elastic spring physics
    const groupsArray = Array.from(nodeGroupsMap.values());
    masterTimeline.add({
      targets: groupsArray.map(g => g.scale),
      x: [0.001, 1],
      y: [0.001, 1],
      z: [0.001, 1],
      delay: anime.stagger(90, { from: 'first', start: 100 }),
      duration: 900,
      easing: 'easeOutElastic(1.3, 0.5)'
    }, '-=500');

    // Step 3: SVG delicate leaf halos
    if (svgOverlayRef.current) {
      const paths = svgOverlayRef.current.querySelectorAll('.meandros-line, .branch-filament');
      masterTimeline.add({
        targets: paths,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 750,
        delay: anime.stagger(30),
        easing: 'easeInOutSine'
      }, '-=600');
    }

    // I. Render Loop: Fluttering leaves, swaying fruit, flowing sap & camera orbit
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

      // Authentic botanical wind oscillation
      nodeGroupsMap.forEach((group, id) => {
        const node = group.userData.nodeData as RepoGraphNode;
        const seed = id.charCodeAt(0) * 0.5;

        if (node.botanicalType === 'leaf') {
          // Leaves flutter gracefully in the breeze
          group.rotation.z = Math.sin(elapsed * 2.2 + seed) * 0.09;
          group.rotation.x = Math.cos(elapsed * 1.7 + seed) * 0.06;
        } else if (node.botanicalType === 'fruit') {
          // Hanging olives sway gently like pendulums
          group.rotation.z = Math.sin(elapsed * 1.8 + seed) * 0.12;
          group.rotation.x = Math.cos(elapsed * 1.4 + seed) * 0.07;
        } else {
          // Heartwood breathes slowly
          group.rotation.y += delta * 0.15;
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

      // Flowing amber sap droplets along branches
      sapPulseList.forEach((pulse) => {
        const t = (elapsed * pulse.speed + pulse.offset) % 1.0;
        const pt = pulse.curve.getPointAt(t);
        pulse.mesh.position.copy(pt);
      });

      // Ambient cavern spores drifting
      if (sporeParticlesRef.current) {
        sporeParticlesRef.current.rotation.y = elapsed * 0.015;
      }

      // Project 3D node coordinates to 2D screen positions for SVG tags
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
        y: y * 2.5 + 0.4,
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
      4.2,
      Math.min(14.0, cameraAngleRef.current.radius + e.deltaY * 0.004)
    );
  };

  // Node Selection: Elastic Spring Bounce on Leaf / Fruit & Camera Pan
  const handleSelectNode = (node: RepoGraphNode) => {
    soundManager.playChime();
    onSelectNode(node);

    // Pan camera gently towards selected leaf or fruit
    anime({
      targets: targetLookAtRef.current,
      x: node.position[0] * 0.5,
      y: node.position[1] * 0.5,
      z: node.position[2] * 0.5,
      duration: 600,
      easing: 'easeOutCubic'
    });

    // Tactile elastic spring bounce on selected leaf/fruit group
    const group = nodeMeshesRef.current.get(node.id);
    if (group) {
      anime({
        targets: group.scale,
        x: [1.35, 1.12],
        y: [1.35, 1.12],
        z: [1.35, 1.12],
        duration: 450,
        easing: 'easeOutElastic(1.4, 0.4)'
      });
    }

    // Ripple wave to other tree nodes
    const otherGroups: THREE.Group[] = [];
    nodeMeshesRef.current.forEach((g, id) => {
      if (id !== node.id) otherGroups.push(g);
    });

    anime({
      targets: otherGroups.map(g => g.scale),
      x: [1, 1.06, 1],
      y: [1, 1.06, 1],
      z: [1, 1.06, 1],
      delay: anime.stagger(45, { from: 'first' }),
      duration: 380,
      easing: 'easeOutBack(1.3)'
    });
  };

  const handleResetCamera = () => {
    soundManager.playClick();
    anime({
      targets: targetLookAtRef.current,
      x: 0,
      y: 0.4,
      z: 0,
      duration: 550,
      easing: 'easeOutCubic'
    });
    cameraAngleRef.current = {
      theta: Math.PI / 4,
      phi: Math.PI / 3.4,
      radius: 9.0
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

      {/* Delicate 2D SVG Leaf Tags & Connections */}
      <svg 
        ref={svgOverlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="leafGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sacred Meandros Corner Labyrinths */}
        <g stroke="#f59e0b" strokeWidth="1.2" fill="none" opacity="0.3">
          <path className="meandros-line" d="M 12 36 L 12 12 L 36 12 M 20 36 L 20 20 L 36 20" />
          <path className="meandros-line" d="M 12 calc(100% - 36px) L 12 calc(100% - 12px) L 36 calc(100% - 12px)" />
        </g>

        {/* Dynamic Branch Filaments */}
        {graph.edges.map((edge, idx) => {
          const p1 = projectedPositions[edge.source];
          const p2 = projectedPositions[edge.target];
          if (!p1 || !p2 || !p1.visible || !p2.visible) return null;

          const isConnected = selectedNode?.id === edge.source || selectedNode?.id === edge.target;

          return (
            <line
              key={`branch-edge-${idx}`}
              className="branch-filament"
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isConnected ? "#f59e0b" : "#684826"}
              strokeWidth={isConnected ? "2.2" : "1.0"}
              strokeOpacity={isConnected ? "0.9" : "0.3"}
              strokeDasharray={isConnected ? "none" : "3,3"}
              filter={isConnected ? "url(#leafGlow)" : undefined}
            />
          );
        })}

        {/* 2D Projected Botanical Sigil Badges and Labels */}
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
              {/* Outer pulsing ring for selected node */}
              {isSelected && (
                <circle
                  r="18"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  className="animate-spin-slow"
                  opacity="0.85"
                />
              )}

              {/* Delicate Botanical Sigil Badge */}
              <circle
                r={isSelected ? "13" : "10"}
                fill="#16100a"
                stroke={node.color}
                strokeWidth={isSelected ? "2.2" : "1.4"}
                filter="url(#leafGlow)"
              />
              <text
                textAnchor="middle"
                dy=".35em"
                fontSize={isSelected ? "11" : "9"}
                fill={node.color}
                fontWeight="bold"
                fontFamily="Georgia, serif"
              >
                {node.mythicSigil}
              </text>

              {/* Subsystem Name & Botanical Type */}
              <text
                x="16"
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
          title="Re-center Tree View"
          className="px-2.5 py-1.5 rounded-lg border border-border/80 bg-surface/80 backdrop-blur-md hover:bg-surface-elevated text-text-muted hover:text-text font-mono text-xs flex items-center gap-1.5 transition-colors shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
          <span>Re-center Tree</span>
        </button>

        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-text-dim px-2.5 py-1 rounded-lg bg-surface/70 backdrop-blur-md border border-border/60">
          <Compass className="w-3 h-3 text-amber-500" />
          <span>Click leaf/fruit or drag to orbit</span>
        </div>
      </div>

    </div>
  );
};
