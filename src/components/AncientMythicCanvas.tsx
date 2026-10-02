import React, { useEffect, useRef } from 'react';

interface AncientMythicCanvasProps {
  theme: 'dark' | 'light';
  astrolabeElevation?: number;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  hue: number;
}

interface InkTendril {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxLife: number;
  life: number;
}

interface MythicGlyph {
  x: number;
  y: number;
  char: string;
  alpha: number;
  life: number;
  maxLife: number;
  scale: number;
}

const GREEK_GLYPHS = ['\u03a9', '\u03a8', '\u03a6', '\u03a3', '\u0394', '\u0398', '\u039b', '\u0393', '\u03a0', '\u039e'];

export const AncientMythicCanvas: React.FC<AncientMythicCanvasProps> = ({
  theme,
  astrolabeElevation = 145
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    prevX: -1000,
    prevY: -1000,
    isDown: false
  });

  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === 'dark';
    const isMobile = width < 768;

    const maxEmbers = isMobile ? 35 : 75;
    const embers: Ember[] = [];

    const inkTendrils: InkTendril[] = [];
    const maxInkTendrils = isMobile ? 25 : 55;

    const glyphs: MythicGlyph[] = [];
    const maxGlyphs = 12;

    const initEmber = (e?: Ember): Ember => {
      const ember = e || {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 0,
        maxLife: 0,
        life: 0,
        hue: 0
      };
      ember.x = Math.random() * width;
      ember.y = height + Math.random() * 50;
      ember.vx = (Math.random() - 0.5) * 0.8;
      ember.vy = -(Math.random() * 1.2 + 0.4);
      ember.size = Math.random() * 2.5 + 1.2;
      ember.maxLife = Math.random() * 280 + 140;
      ember.life = ember.maxLife;
      ember.alpha = Math.random() * 0.7 + 0.3;
      ember.hue = Math.random() > 0.4 ? 30 : 20; // Amber / terracotta
      return ember;
    };

    for (let i = 0; i < maxEmbers; i++) {
      const ember = initEmber();
      ember.y = Math.random() * height;
      embers.push(ember);
    }

    const spawnInkTendril = (x: number, y: number) => {
      if (inkTendrils.length >= maxInkTendrils) inkTendrils.shift();
      inkTendrils.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 18 + 10,
        alpha: isDark ? 0.35 : 0.22,
        maxLife: 90,
        life: 90
      });
    };

    const spawnGlyph = (x: number, y: number) => {
      if (glyphs.length >= maxGlyphs) glyphs.shift();
      const char = GREEK_GLYPHS[Math.floor(Math.random() * GREEK_GLYPHS.length)];
      glyphs.push({
        x,
        y,
        char,
        alpha: 0.8,
        life: 110,
        maxLife: 110,
        scale: 1.0
      });
    };

    let rotationAngle = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      const x = e.clientX;
      const y = e.clientY;

      mouseRef.current.vx = x - prevX;
      mouseRef.current.vy = y - prevY;
      mouseRef.current.prevX = prevX;
      mouseRef.current.prevY = prevY;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      const dist = Math.hypot(x - prevX, y - prevY);
      if (dist > 15) {
        spawnInkTendril(x, y);
        if (Math.random() > 0.82) {
          spawnGlyph(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      shockwavesRef.current.push({
        x,
        y,
        radius: 5,
        maxRadius: isMobile ? 140 : 220,
        alpha: 0.85
      });

      for (let i = 0; i < 16; i++) {
        const ember = initEmber();
        const angle = (i / 16) * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        ember.x = x;
        ember.y = y;
        ember.vx = Math.cos(angle) * speed;
        ember.vy = Math.sin(angle) * speed;
        ember.size = Math.random() * 3.5 + 2;
        embers.push(ember);
        if (embers.length > maxEmbers + 20) embers.shift();
      }

      spawnGlyph(x, y);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotationAngle += 0.0008;

      const mouseNormX = mouseRef.current.x > 0 ? (mouseRef.current.x / width - 0.5) * 2 : 0;
      const mouseNormY = mouseRef.current.y > 0 ? (mouseRef.current.y / height - 0.5) * 2 : 0;

      // 1. Draw Sacred Greek Meandros / Labyrinth Geometry
      ctx.save();
      const astrolabeCenterX = width * 0.5 + mouseNormX * 18;
      const astrolabeCenterY = height * 0.42 + mouseNormY * 14;

      const primaryLineColor = isDark ? 'rgba(234, 88, 12, 0.14)' : 'rgba(194, 65, 12, 0.12)';
      const accentLineColor = isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(180, 83, 9, 0.2)';

      // Outer Astrolabe Coordinate Ring
      const baseRadius = isMobile ? 150 : Math.min(width, height) * 0.38;

      ctx.lineWidth = 1;
      ctx.strokeStyle = primaryLineColor;

      // Concentric circles of the Ptolemaic spheres
      [0.35, 0.55, 0.75, 1.0, 1.15].forEach((ratio, idx) => {
        ctx.beginPath();
        ctx.arc(astrolabeCenterX, astrolabeCenterY, baseRadius * ratio, 0, Math.PI * 2);
        if (idx === 3) {
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = accentLineColor;
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = primaryLineColor;
        }
        ctx.stroke();
      });

      // Rotating Astrolabe Degree Ray Ticks
      ctx.save();
      ctx.translate(astrolabeCenterX, astrolabeCenterY);
      ctx.rotate(rotationAngle + (astrolabeElevation * Math.PI) / 360);

      const numTicks = 36;
      for (let i = 0; i < numTicks; i++) {
        const rad = (i / numTicks) * Math.PI * 2;
        const isMajor = i % 3 === 0;
        const r1 = baseRadius * 0.96;
        const r2 = isMajor ? baseRadius * 1.06 : baseRadius * 1.02;

        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * r1, Math.sin(rad) * r1);
        ctx.lineTo(Math.cos(rad) * r2, Math.sin(rad) * r2);
        ctx.strokeStyle = isMajor ? accentLineColor : primaryLineColor;
        ctx.stroke();

        if (isMajor && !isMobile) {
          ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(180, 83, 9, 0.35)';
          ctx.font = '10px "Cinzel", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const glyph = GREEK_GLYPHS[i / 3 % GREEK_GLYPHS.length];
          ctx.fillText(glyph, Math.cos(rad) * (baseRadius * 1.12), Math.sin(rad) * (baseRadius * 1.12));
        }
      }

      // Ancient Labyrinth / Geometric Cross
      ctx.beginPath();
      ctx.moveTo(-baseRadius * 0.85, 0);
      ctx.lineTo(baseRadius * 0.85, 0);
      ctx.moveTo(0, -baseRadius * 0.85);
      ctx.lineTo(0, baseRadius * 0.85);
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = primaryLineColor;
      ctx.stroke();

      ctx.restore();
      ctx.restore();

      // 2. Draw Meandros Greek Key Top & Bottom Borders (subtle parchment frieze)
      ctx.save();
      const meanderStep = 24;
      const meanderHeight = 12;
      ctx.strokeStyle = isDark ? 'rgba(234, 88, 12, 0.09)' : 'rgba(194, 65, 12, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);

      const drawMeanderLine = (yPos: number) => {
        ctx.beginPath();
        for (let x = 0; x < width + meanderStep; x += meanderStep) {
          ctx.moveTo(x, yPos);
          ctx.lineTo(x + meanderStep * 0.5, yPos);
          ctx.lineTo(x + meanderStep * 0.5, yPos + meanderHeight);
          ctx.lineTo(x + meanderStep * 0.25, yPos + meanderHeight);
          ctx.lineTo(x + meanderStep * 0.25, yPos + meanderHeight * 0.5);
          ctx.lineTo(x + meanderStep * 0.75, yPos + meanderHeight * 0.5);
          ctx.lineTo(x + meanderStep * 0.75, yPos);
          ctx.lineTo(x + meanderStep, yPos);
        }
        ctx.stroke();
      };

      drawMeanderLine(8);
      drawMeanderLine(height - 20);
      ctx.restore();

      // 3. Fluid Shadow Ink Swirls of Erebus
      ctx.save();
      for (let i = inkTendrils.length - 1; i >= 0; i--) {
        const ink = inkTendrils[i];
        ink.life -= 1;
        ink.x += ink.vx;
        ink.y += ink.vy;
        ink.radius += 0.35;
        const progress = ink.life / ink.maxLife;
        const curAlpha = ink.alpha * progress;

        if (ink.life <= 0) {
          inkTendrils.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(ink.x, ink.y, 0, ink.x, ink.y, ink.radius);
        if (isDark) {
          grad.addColorStop(0, `rgba(234, 88, 12, ${curAlpha * 0.7})`);
          grad.addColorStop(0.5, `rgba(15, 23, 42, ${curAlpha * 0.9})`);
          grad.addColorStop(1, 'rgba(7, 8, 11, 0)');
        } else {
          grad.addColorStop(0, `rgba(194, 65, 12, ${curAlpha * 0.45})`);
          grad.addColorStop(0.6, `rgba(120, 53, 15, ${curAlpha * 0.35})`);
          grad.addColorStop(1, 'rgba(250, 246, 240, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ink.x, ink.y, ink.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Interactive Shockwaves on Click
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const wave = shockwavesRef.current[i];
        wave.radius += 4.5;
        wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

        if (wave.radius >= wave.maxRadius || wave.alpha <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(245, 158, 11, ${wave.alpha * 0.6})`
          : `rgba(194, 65, 12, ${wave.alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.stroke();

        // Secondary ripple
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(234, 88, 12, ${wave.alpha * 0.35})`
          : `rgba(180, 83, 9, ${wave.alpha * 0.3})`;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Mythic Glyphs (Runes that blossom and fade)
      ctx.save();
      for (let i = glyphs.length - 1; i >= 0; i--) {
        const glyph = glyphs[i];
        glyph.life -= 1;
        glyph.y -= 0.3;
        const progress = glyph.life / glyph.maxLife;
        const alpha = glyph.alpha * progress;

        if (glyph.life <= 0) {
          glyphs.splice(i, 1);
          continue;
        }

        ctx.font = 'bold 16px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDark
          ? `rgba(245, 158, 11, ${alpha})`
          : `rgba(194, 65, 12, ${alpha})`;
        ctx.shadowColor = isDark ? '#ea580c' : '#c2410c';
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fillText(glyph.char, glyph.x, glyph.y);
      }
      ctx.restore();

      // 6. Amber Embers (Ascending spark physics)
      ctx.save();
      for (let i = 0; i < embers.length; i++) {
        const ember = embers[i];
        ember.life -= 1;
        ember.x += ember.vx;
        ember.y += ember.vy;

        // Subtle repulsion from mouse
        if (mouseRef.current.x > 0) {
          const dx = ember.x - mouseRef.current.x;
          const dy = ember.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100 && dist > 1) {
            const force = (1 - dist / 100) * 1.5;
            ember.vx += (dx / dist) * force;
            ember.vy += (dy / dist) * force;
          }
        }

        // Dampen velocity
        ember.vx *= 0.98;
        ember.vy = Math.min(ember.vy * 0.99, -0.3);

        const progress = ember.life / ember.maxLife;
        const currentAlpha = ember.alpha * Math.sin(progress * Math.PI);

        if (ember.life <= 0 || ember.y < -10 || ember.x < -10 || ember.x > width + 10) {
          initEmber(ember);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = `hsla(${ember.hue}, 95%, 60%, ${currentAlpha})`;
          ctx.shadowColor = `hsla(${ember.hue}, 95%, 50%, 0.8)`;
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `hsla(${ember.hue}, 85%, 35%, ${currentAlpha * 0.85})`;
          ctx.shadowColor = `hsla(${ember.hue}, 85%, 40%, 0.4)`;
          ctx.shadowBlur = 3;
        }
        ctx.fill();
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [theme, astrolabeElevation]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        opacity: theme === 'dark' ? 0.95 : 0.85
      }}
    />
  );
};
