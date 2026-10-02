import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  theme: 'dark' | 'light';
  astrolabeElevation: number; // 0 to 180 degrees
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ theme, astrolabeElevation }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const horizonMeshRef = useRef<THREE.Mesh | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const constellationRef = useRef<THREE.LineSegments | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 15, 60);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 1. Starfield (1400 Stars)
    const starCount = 1400;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 800;
      starPositions[i * 3 + 1] = Math.random() * 400 - 50;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 800;

      // Color variation: ember orange, gold, cyan, white
      const colorRoll = Math.random();
      if (colorRoll > 0.7) {
        // Orange / Ember
        starColors[i * 3] = 0.92;
        starColors[i * 3 + 1] = 0.35;
        starColors[i * 3 + 2] = 0.05;
      } else if (colorRoll > 0.4) {
        // Cyan
        starColors[i * 3] = 0.0;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1.0;
      } else {
        // Pure Starlight
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.98;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.85 : 0.45,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    starsRef.current = starField;

    // 2. Mythic Constellation Wireframe Segments
    const constellationGeo = new THREE.BufferGeometry();
    const constellationPoints: number[] = [];
    // Generate connecting lines between nearby star clusters
    for (let i = 0; i < 40; i++) {
      const idxA = Math.floor(Math.random() * 200);
      const idxB = idxA + Math.floor(Math.random() * 8) + 1;
      const x1 = starPositions[idxA * 3];
      const y1 = starPositions[idxA * 3 + 1];
      const z1 = starPositions[idxA * 3 + 2];
      const x2 = starPositions[idxB * 3];
      const y2 = starPositions[idxB * 3 + 1];
      const z2 = starPositions[idxB * 3 + 2];
      const dist = Math.hypot(x2 - x1, y2 - y1, z2 - z1);
      if (dist < 120) {
        constellationPoints.push(x1, y1, z1, x2, y2, z2);
      }
    }
    constellationGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(constellationPoints, 3)
    );
    const constellationMat = new THREE.LineBasicMaterial({
      color: theme === 'dark' ? 0xea580c : 0xc2410c,
      transparent: true,
      opacity: 0.28,
      linewidth: 1
    });
    const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
    scene.add(constellationLines);
    constellationRef.current = constellationLines;

    // 3. Mathematical Convex Horizon Wave Mesh
    const planeWidth = 240;
    const planeDepth = 160;
    const segmentsX = 64;
    const segmentsZ = 48;
    const horizonGeo = new THREE.PlaneGeometry(planeWidth, planeDepth, segmentsX, segmentsZ);
    horizonGeo.rotateX(-Math.PI / 2);

    const horizonMat = new THREE.MeshBasicMaterial({
      color: theme === 'dark' ? 0xea580c : 0xc2410c,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.position.set(0, -12, -20);
    scene.add(horizonMesh);
    horizonMeshRef.current = horizonMesh;

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Scroll mapping for Yuki Asakura spatial camera tracking
    let targetCameraY = 15;
    let targetCameraZ = 60;
    let targetMeshRotY = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

      // Glide camera forward and downward through the constellation field
      targetCameraY = 15 - scrollProgress * 18;
      targetCameraZ = 60 - scrollProgress * 28;
      targetMeshRotY = scrollProgress * 0.45;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, -20);

      // Rotate starfield slowly
      if (starField) {
        starField.rotation.y = elapsedTime * 0.012;
      }
      if (constellationLines) {
        constellationLines.rotation.y = elapsedTime * 0.012;
      }

      // Animate horizon mesh vertices with mathematical wave harmonics
      if (horizonMesh) {
        horizonMesh.rotation.y += (targetMeshRotY - horizonMesh.rotation.y) * 0.05;
        const posAttr = horizonGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const v = posAttr.getZ(i);

          // Convex curvature + moving wave harmonics
          const normX = u / (planeWidth * 0.5);
          const curvature = -Math.pow(normX, 2) * 6;
          const wave =
            Math.sin(u * 0.08 + elapsedTime * 1.2) * 2.2 +
            Math.cos(v * 0.06 + elapsedTime * 0.8) * 1.5;

          posAttr.setY(i, curvature + wave);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      constellationGeo.dispose();
      constellationMat.dispose();
    };
  }, []);

  // Update Three.js materials when theme or astrolabe changes
  useEffect(() => {
    if (!horizonMeshRef.current || !starsRef.current || !constellationRef.current) return;

    const isDark = theme === 'dark';
    const emberColor = isDark ? 0xea580c : 0xc2410c;

    const horizonMat = horizonMeshRef.current.material as THREE.MeshBasicMaterial;
    horizonMat.color.setHex(emberColor);
    horizonMat.opacity = isDark ? 0.22 : 0.14;

    const starMat = starsRef.current.material as THREE.PointsMaterial;
    starMat.opacity = isDark ? 0.85 : 0.4;

    const constMat = constellationRef.current.material as THREE.LineBasicMaterial;
    constMat.color.setHex(emberColor);
    constMat.opacity = isDark ? 0.35 : 0.2;

    // Shift horizon position by astrolabe elevation
    if (horizonMeshRef.current) {
      horizonMeshRef.current.position.y = -12 + (astrolabeElevation - 35) * 0.08;
    }
  }, [theme, astrolabeElevation]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
