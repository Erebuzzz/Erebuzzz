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
  const celestialGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    const starCount = isMobile ? 500 : (isTablet ? 900 : 1500);
    const segmentsX = isMobile ? 32 : (isTablet ? 48 : 64);
    const segmentsZ = isMobile ? 24 : (isTablet ? 36 : 48);
    const pixelRatioLimit = isMobile ? 1.25 : 2.0;

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
    camera.position.set(0, 15, isMobile ? 75 : 60);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioLimit));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 1. Adaptive Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 800;
      starPositions[i * 3 + 1] = Math.random() * 400 - 50;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 800;

      const colorRoll = Math.random();
      if (colorRoll > 0.7) {
        starColors[i * 3] = 0.92;
        starColors[i * 3 + 1] = 0.35;
        starColors[i * 3 + 2] = 0.05;
      } else if (colorRoll > 0.4) {
        starColors[i * 3] = 0.0;
        starColors[i * 3 + 1] = 0.9;
        starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.98;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: isMobile ? 1.8 : 2.2,
      vertexColors: true,
      transparent: true,
      opacity: theme === 'dark' ? 0.85 : 0.45,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    starsRef.current = starField;

    // 2. Mythic Constellations
    const constellationGeo = new THREE.BufferGeometry();
    const constellationPoints: number[] = [];
    const maxConstellations = isMobile ? 18 : 36;
    const poolSize = Math.min(200, starCount);

    for (let i = 0; i < maxConstellations; i++) {
      const idxA = Math.floor(Math.random() * (poolSize - 10));
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
    const planeWidth = isMobile ? 180 : 240;
    const planeDepth = isMobile ? 120 : 160;
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

    // 4. Gameified 3D Interactive Floating Celestial Artifacts
    const celestialGroup = new THREE.Group();
    scene.add(celestialGroup);
    celestialGroupRef.current = celestialGroup;

    const emberColor = theme === 'dark' ? 0xea580c : 0xc2410c;

    // A. Gyroscope Ring 1 (Torus)
    const ring1Geo = new THREE.TorusGeometry(isMobile ? 14 : 20, 0.25, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: emberColor,
      wireframe: true,
      transparent: true,
      opacity: 0.24
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.position.set(isMobile ? 0 : 38, isMobile ? 22 : 18, -35);
    ring1.rotation.x = Math.PI / 3;
    celestialGroup.add(ring1);

    // B. Gyroscope Ring 2 (Inner Ring)
    const ring2Geo = new THREE.TorusGeometry(isMobile ? 10 : 14, 0.2, 16, 64);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring1.add(ring2);

    // C. Platonic Icosahedron (The Athena Core)
    const icosaGeo = new THREE.IcosahedronGeometry(isMobile ? 5 : 7, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: emberColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const icosa = new THREE.Mesh(icosaGeo, icosaMat);
    icosa.position.set(isMobile ? -24 : -42, isMobile ? 8 : 12, -30);
    celestialGroup.add(icosa);

    // D. Platonic Octahedron (The Delphic Core)
    const octaGeo = new THREE.OctahedronGeometry(isMobile ? 3.5 : 5, 0);
    const octaMat = new THREE.MeshBasicMaterial({
      color: emberColor,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const octa = new THREE.Mesh(octaGeo, octaMat);
    octa.position.set(isMobile ? 22 : 36, isMobile ? -6 : -8, -25);
    celestialGroup.add(octa);

    // Mouse Tracking for 3D Camera Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 15;
    let targetCameraZ = isMobile ? 75 : 60;
    let targetMeshRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Click impulse on celestial objects
    const handleCanvasClick = () => {
      if (icosa) icosa.rotation.y += 1.8;
      if (octa) octa.rotation.x += 2.0;
      if (ring1) ring1.rotation.z += 1.5;
    };
    window.addEventListener('click', handleCanvasClick, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newIsMobile = newWidth < 768;

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.position.z = newIsMobile ? 75 : 60;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, newIsMobile ? 1.25 : 2.0));
    };
    window.addEventListener('resize', handleResize);

    // Scroll mapping
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;

      const baseZ = window.innerWidth < 768 ? 75 : 60;
      targetCameraY = 15 - scrollProgress * 18;
      targetCameraZ = baseZ - scrollProgress * 28;
      targetMeshRotY = scrollProgress * 0.45;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 3D Mouse Parallax
      targetCameraX = mouseX * 6;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY + mouseY * 4 - camera.position.y) * 0.04;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, -20);

      // Rotate Starfield and Constellations
      if (starField) starField.rotation.y = elapsedTime * 0.012;
      if (constellationLines) constellationLines.rotation.y = elapsedTime * 0.012;

      // Animate Celestial Game Polyhedra
      if (ring1) {
        ring1.rotation.y = elapsedTime * 0.25;
        ring1.rotation.z = Math.sin(elapsedTime * 0.4) * 0.3;
      }
      if (ring2) {
        ring2.rotation.x = elapsedTime * -0.4;
      }
      if (icosa) {
        icosa.rotation.x = elapsedTime * 0.35;
        icosa.rotation.y = elapsedTime * 0.25;
        icosa.position.y = (isMobile ? 8 : 12) + Math.sin(elapsedTime * 0.8) * 1.5;
      }
      if (octa) {
        octa.rotation.y = elapsedTime * 0.45;
        octa.rotation.z = elapsedTime * 0.2;
        octa.position.y = (isMobile ? -6 : -8) + Math.cos(elapsedTime * 0.9) * 1.2;
      }

      // Animate Wave Harmonics
      if (horizonMesh) {
        horizonMesh.rotation.y += (targetMeshRotY - horizonMesh.rotation.y) * 0.05;
        const posAttr = horizonGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const v = posAttr.getZ(i);

          const normX = u / (planeWidth * 0.5);
          const curvature = -Math.pow(normX, 2) * 5;
          const wave =
            Math.sin(u * 0.08 + elapsedTime * 1.2) * 2.0 +
            Math.cos(v * 0.06 + elapsedTime * 0.8) * 1.4;

          posAttr.setY(i, curvature + wave);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleCanvasClick);
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
      ring1Geo.dispose();
      ring2Geo.dispose();
      ringMat.dispose();
      icosaGeo.dispose();
      icosaMat.dispose();
      octaGeo.dispose();
      octaMat.dispose();
    };
  }, []);

  // Update materials on theme/astrolabe change
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
