import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import anime from 'animejs';
import { RepoGraph, RepoGraphNode, getRepoGraph } from '../data/repoGraphs';
import { Project } from '../data/projects';
import { CosmosHUD } from './CosmosHUD';
import { soundManager } from '../utils/audio';

interface MythicBlueprintCosmosProps {
  project: Project;
  onSwitchToCodex: () => void;
  theme?: 'dark' | 'light';
}

interface ProjectedPoint {
  x: number;
  y: number;
  visible: boolean;
}

export const MythicBlueprintCosmos: React.FC<MythicBlueprintCosmosProps> = ({
  project,
  onSwitchToCodex,
  theme = 'dark'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<RepoGraphNode | null>(null);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [projectedPositions, setProjectedPositions] = useState<Record<string, ProjectedPoint>>({});

  // Fetch or generate graph for this repository
  const graph: RepoGraph = useMemo(() => {
    return getRepoGraph(project.id, project);
  }, [project]);

  // Three.js scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const apolloSpotlightRef = useRef<THREE.SpotLight | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const edgeMeshesRef = useRef<THREE.Mesh[]>([]);
  const emberParticlesRef = useRef<THREE.Points | null>(null);

  // Mouse orbit & cursor state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3,
    radius: 7.5
  });
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const mouseNormRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // Set default selected node to the kernel node
  useEffect(() => {
    const kernelNode = graph.nodes.find(n => n.cluster === 'kernel') || graph.nodes[0];
    if (kernelNode) {
      setSelectedNode(kernelNode);
    }
  }, [graph]);

  // Initialize Three.js Scene, Anime.js Choreography, and Event Listeners
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Deep Erebus atmospheric fog
    scene.fog = new THREE.FogExp2(theme === 'dark' ? 0x090705 : 0xf4eee4, 0.08);

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
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // 2. Primordial & Apollo Sunray Lighting
    const ambientLight = new THREE.AmbientLight(theme === 'dark' ? 0x221a14 : 0xede4d4, 0.8);
    scene.add(ambientLight);

    // Warm central kernel hearth pointlight
    const hearthLight = new THREE.PointLight(0xf59e0b, 2.0, 15);
    hearthLight.position.set(0, 0, 0);
    scene.add(hearthLight);

    // Apollo's dynamic sunray spotlight that follows cursor in 3D
    const apolloSpotlight = new THREE.SpotLight(0xffca3a, 4.5, 22, Math.PI / 4, 0.45, 1.2);
    apolloSpotlight.position.set(0, 8, 4);
    apolloSpotlight.target.position.set(0, 0, 0);
    scene.add(apolloSpotlight);
    scene.add(apolloSpotlight.target);
    apolloSpotlightRef.current = apolloSpotlight;

    // 3. Floating Amber Embers in the Void
    const emberCount = 200;
    const emberGeometry = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberScales = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 14;
      emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      emberScales[i] = Math.random() * 0.8 + 0.2;
    }

    emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    emberGeometry.setAttribute('scale', new THREE.BufferAttribute(emberScales, 1));

    const emberMaterial = new THREE.PointsMaterial({
      color: theme === 'dark' ? 0xf59e0b : 0xb45309,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const emberParticles = new THREE.Points(emberGeometry, emberMaterial);
    scene.add(emberParticles);
    emberParticlesRef.current = emberParticles;

    // 4. Create 3D Nodes (Obsidian Polyhedra with Molten Cores)
    const nodeMeshesMap = new Map<string, THREE.Mesh>();

    graph.nodes.forEach((node) => {
      let geom: THREE.BufferGeometry;
      switch (node.geometryType) {
        case 'torusKnot':
          geom = new THREE.TorusKnotGeometry(node.size * 0.7, node.size * 0.22, 64, 16);
          break;
        case 'icosahedron':
          geom = new THREE.IcosahedronGeometry(node.size, 1);
          break;
        case 'dodecahedron':
          geom = new THREE.DodecahedronGeometry(node.size, 0);
          break;
        case 'octahedron':
          geom = new THREE.OctahedronGeometry(node.size, 0);
          break;
        case 'box':
        default:
          geom = new THREE.BoxGeometry(node.size * 1.3, node.size * 1.3, node.size * 1.3);
          break;
      }

      // Obsidian surface material with emissive glowing veins
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(theme === 'dark' ? 0x14100c : 0x3d3228),
        roughness: 0.25,
        metalness: 0.85,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.3
      });

      const mesh = new THREE.Mesh(geom, mat);
      // Start slightly scaled down for Anime.js staggered entrance
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.position.set(...node.position);
      mesh.userData = { nodeId: node.id, nodeData: node };

      // Inner glowing core
      const innerGeom = new THREE.SphereGeometry(node.size * 0.45, 16, 16);
      const innerMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.75
      });
      const innerMesh = new THREE.Mesh(innerGeom, innerMat);
      mesh.add(innerMesh);

      scene.add(mesh);
      nodeMeshesMap.set(node.id, mesh);
    });
    nodeMeshesRef.current = nodeMeshesMap;

    // 5. Create 3D Glowing Filament Tubes for Edges
    const edgeMeshes: THREE.Mesh[] = [];
    graph.edges.forEach((edge) => {
      const srcNode = graph.nodes.find(n => n.id === edge.source);
      const tgtNode = graph.nodes.find(n => n.id === edge.target);
      if (!srcNode || !tgtNode) return;

      const p1 = new THREE.Vector3(...srcNode.position);
      const p2 = new THREE.Vector3(...tgtNode.position);

      const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      // Subtle mythic arc curvature
      midPoint.y += 0.35;

      const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
      const tubeGeom = new THREE.TubeGeometry(curve, 24, 0.025, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(edge.color || '#f59e0b'),
        emissive: new THREE.Color(edge.color || '#f59e0b'),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.65,
        roughness: 0.3
      });

      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      scene.add(tubeMesh);
      edgeMeshes.push(tubeMesh);
    });
    edgeMeshesRef.current = edgeMeshes;

    // 6. Master Anime.js Ceremonial Timeline
    const masterTimeline = anime.timeline({
      easing: 'easeOutExpo'
    });

    // Step A: Apollo Spotlight sweep from celestial zenith
    masterTimeline.add({
      targets: apolloSpotlight.position,
      x: [0, 4],
      y: [12, 6],
      z: [8, 4],
      duration: 800,
      easing: 'easeOutCubic'
    });

    // Step B: Staggered Genesis radial node explosion
    const meshArray = Array.from(nodeMeshesMap.values());
    masterTimeline.add({
      targets: meshArray.map(m => m.scale),
      x: [0.001, 1],
      y: [0.001, 1],
      z: [0.001, 1],
      delay: anime.stagger(90, { from: 'center', start: 100 }),
      duration: 900,
      easing: 'easeOutElastic(1.2, 0.5)'
    }, '-=500');

    // Step C: SVG Meandros Labyrinth Line Drawing
    if (svgOverlayRef.current) {
      const paths = svgOverlayRef.current.querySelectorAll('.meandros-line, .constellation-path');
      masterTimeline.add({
        targets: paths,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 900,
        delay: anime.stagger(40),
        easing: 'easeInOutSine'
      }, '-=700');
    }

    // 7. Render Loop & Dynamic Projections
    let animationFrameId: number;
    let clock = new THREE.Clock();

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

      // Rotate obsidian nodes gently on their own axes
      nodeMeshesMap.forEach((mesh) => {
        mesh.rotation.y += delta * 0.4;
        mesh.rotation.x += delta * 0.2;

        // Dim nodes outside active cluster if a cluster is filtered
        if (activeCluster && mesh.userData.nodeData.cluster !== activeCluster) {
          (mesh.material as THREE.MeshStandardMaterial).opacity = 0.25;
          (mesh.material as THREE.MeshStandardMaterial).transparent = true;
        } else {
          (mesh.material as THREE.MeshStandardMaterial).opacity = 1.0;
          (mesh.material as THREE.MeshStandardMaterial).transparent = false;
        }
      });

      // Gently orbit amber embers
      if (emberParticlesRef.current) {
        emberParticlesRef.current.rotation.y = elapsed * 0.03;
        emberParticlesRef.current.rotation.x = Math.sin(elapsed * 0.02) * 0.05;
      }

      // Project 3D node coordinates to 2D screen positions for SVG overlay
      const currentWidth = container.clientWidth;
      const currentHeight = container.clientHeight;
      const projections: Record<string, ProjectedPoint> = {};

      nodeMeshesMap.forEach((mesh, id) => {
        const tempV = new THREE.Vector3();
        mesh.getWorldPosition(tempV);
        tempV.project(camera);

        const x = (tempV.x * 0.5 + 0.5) * currentWidth;
        const y = (-(tempV.y * 0.5) + 0.5) * currentHeight;
        const visible = tempV.z < 1.0;

        projections[id] = { x, y, visible };
      });

      setProjectedPositions(projections);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // 8. Resize Handler
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

  // Handle Raycasting Hover & Apollo Spotlight Cursor Tracking
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseNormRef.current = { x, y };

    // Tween Apollo Spotlight target towards mouse position in 3D
    if (apolloSpotlightRef.current) {
      anime({
        targets: apolloSpotlightRef.current.target.position,
        x: x * 3.5,
        y: y * 2.5,
        z: 0,
        duration: 250,
        easing: 'easeOutQuad'
      });
    }

    // Dragging Camera Orbit
    if (isDraggingRef.current) {
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      cameraAngleRef.current.theta -= deltaX * 0.006;
      cameraAngleRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, cameraAngleRef.current.phi - deltaY * 0.006)
      );

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with left click or primary touch
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

    // If it was a quick click rather than a drag, raycast to pick a 3D node
    if (!wasDragging && cameraRef.current && sceneRef.current) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycasterRef.current.setFromCamera(mouse, cameraRef.current);
      const meshes = Array.from(nodeMeshesRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let hitMesh: THREE.Object3D | null = intersects[0].object;
        while (hitMesh && !hitMesh.userData.nodeData && hitMesh.parent) {
          hitMesh = hitMesh.parent;
        }

        if (hitMesh && hitMesh.userData.nodeData) {
          const clickedNode: RepoGraphNode = hitMesh.userData.nodeData;
          handleSelectNode(clickedNode);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    cameraAngleRef.current.radius = Math.max(
      3.5,
      Math.min(13.0, cameraAngleRef.current.radius + e.deltaY * 0.004)
    );
  };

  // Node Selection with Tactile Elastic Spring & Topological Ripple Wave
  const handleSelectNode = (node: RepoGraphNode) => {
    soundManager.playChime();
    setSelectedNode(node);

    // 1. Smoothly glide camera target towards clicked node
    anime({
      targets: targetLookAtRef.current,
      x: node.position[0] * 0.5,
      y: node.position[1] * 0.5,
      z: node.position[2] * 0.5,
      duration: 650,
      easing: 'easeOutCubic'
    });

    // 2. Elastic spring bounce on the selected node mesh
    const selectedMesh = nodeMeshesRef.current.get(node.id);
    if (selectedMesh) {
      anime({
        targets: selectedMesh.scale,
        x: [1.35, 1.15],
        y: [1.35, 1.15],
        z: [1.35, 1.15],
        duration: 400,
        easing: 'easeOutElastic(1.4, 0.4)'
      });

      // Emissive flare
      const mat = selectedMesh.material as THREE.MeshStandardMaterial;
      anime({
        targets: mat,
        emissiveIntensity: [1.8, 0.7],
        duration: 500,
        easing: 'easeOutQuad'
      });
    }

    // 3. Topological Ripple Wave to all other nodes using anime.stagger
    const otherMeshes: THREE.Mesh[] = [];
    nodeMeshesRef.current.forEach((mesh, id) => {
      if (id !== node.id) {
        otherMeshes.push(mesh);
      }
    });

    anime({
      targets: otherMeshes.map(m => m.scale),
      x: [1, 1.1, 1],
      y: [1, 1.1, 1],
      z: [1, 1.1, 1],
      delay: anime.stagger(60, { from: 'first' }),
      duration: 450,
      easing: 'easeOutBack(1.5)'
    });
  };

  const handleResetView = () => {
    anime({
      targets: targetLookAtRef.current,
      x: 0,
      y: 0,
      z: 0,
      duration: 600,
      easing: 'easeOutCubic'
    });

    cameraAngleRef.current = {
      theta: Math.PI / 4,
      phi: Math.PI / 3,
      radius: 7.5
    };

    const kernelNode = graph.nodes.find(n => n.cluster === 'kernel') || graph.nodes[0];
    if (kernelNode) {
      setSelectedNode(kernelNode);
    }
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black/95 select-none transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[540px] sm:h-[620px] rounded-xl'
      }`}
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

      {/* Dual-Layer SVG Constellation Overlay */}
      <svg 
        ref={svgOverlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mythicGoldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sacred Meandros (Greek key) Corner Labyrinths */}
        <g stroke="#f59e0b" strokeWidth="1.5" fill="none" opacity="0.45">
          {/* Top-Left Corner */}
          <path 
            className="meandros-line" 
            d="M 12 40 L 12 12 L 40 12 M 20 40 L 20 20 L 40 20 M 28 32 L 28 28 L 32 28" 
          />
          {/* Top-Right Corner */}
          <path 
            className="meandros-line" 
            d="M calc(100% - 40px) 12 L calc(100% - 12px) 12 L calc(100% - 12px) 40 M calc(100% - 40px) 20 L calc(100% - 20px) 20 L calc(100% - 20px) 40" 
          />
          {/* Bottom-Left Corner */}
          <path 
            className="meandros-line" 
            d="M 12 calc(100% - 40px) L 12 calc(100% - 12px) L 40 calc(100% - 12px) M 20 calc(100% - 40px) L 20 calc(100% - 20px) L 40 calc(100% - 20px)" 
          />
          {/* Bottom-Right Corner */}
          <path 
            className="meandros-line" 
            d="M calc(100% - 40px) calc(100% - 12px) L calc(100% - 12px) calc(100% - 12px) L calc(100% - 12px) calc(100% - 40px)" 
          />
        </g>

        {/* Dynamic Projected SVG Constellation Links */}
        {graph.edges.map((edge, idx) => {
          const p1 = projectedPositions[edge.source];
          const p2 = projectedPositions[edge.target];
          if (!p1 || !p2 || !p1.visible || !p2.visible) return null;

          const isConnectedToSelected = selectedNode?.id === edge.source || selectedNode?.id === edge.target;

          return (
            <g key={`edge-${idx}`}>
              <line
                className="constellation-path"
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isConnectedToSelected ? "#f59e0b" : (edge.color || "#e2e8f0")}
                strokeWidth={isConnectedToSelected ? "2.2" : "1.2"}
                strokeOpacity={isConnectedToSelected ? "0.85" : "0.3"}
                strokeDasharray={isConnectedToSelected ? "none" : "3,3"}
                filter={isConnectedToSelected ? "url(#glowFilter)" : undefined}
              />
            </g>
          );
        })}

        {/* 2D Projected Node Sigil Halos and Interactive Labels */}
        {graph.nodes.map((node) => {
          const pt = projectedPositions[node.id];
          if (!pt || !pt.visible) return null;

          const isSelected = selectedNode?.id === node.id;

          return (
            <g 
              key={`node-tag-${node.id}`} 
              className="pointer-events-auto cursor-pointer transition-transform duration-150"
              transform={`translate(${pt.x}, ${pt.y})`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectNode(node);
              }}
            >
              {/* Outer pulsing ring for selected node */}
              {isSelected && (
                <circle
                  r="22"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                  className="animate-spin-slow"
                  opacity="0.8"
                />
              )}

              {/* Node Sigil Badge */}
              <circle
                r={isSelected ? "15" : "11"}
                fill="#0e0a07"
                stroke={node.color}
                strokeWidth={isSelected ? "2.5" : "1.5"}
                filter="url(#glowFilter)"
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

              {/* Node Label Text */}
              <text
                x="18"
                y="4"
                fontSize="10"
                fill={isSelected ? "#ffffff" : "#d4c8be"}
                fontFamily="monospace"
                fontWeight={isSelected ? "bold" : "normal"}
                opacity={isSelected ? "1" : "0.8"}
                className="drop-shadow-md select-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tactical HUD Overlay (Dossier, Counters & Controls) */}
      <CosmosHUD
        graph={graph}
        project={project}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
        activeCluster={activeCluster}
        onSelectCluster={setActiveCluster}
        onResetView={handleResetView}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onSwitchToCodex={onSwitchToCodex}
        theme={theme}
      />
    </div>
  );
};
