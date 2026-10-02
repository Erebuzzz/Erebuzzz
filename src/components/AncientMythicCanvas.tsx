import React, { useEffect, useRef } from 'react';

interface AncientMythicCanvasProps {
  theme: 'dark' | 'light';
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
}

const GREEK_GLYPHS = ['\u03a9', '\u03a8', '\u03a6', '\u03a3', '\u0394', '\u0398', '\u039b', '\u0393', '\u03a0', '\u039e'];

export const AncientMythicCanvas: React.FC<AncientMythicCanvasProps> = ({
  theme
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    prevX: -1000,
    prevY: -1000
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

    const maxEmbers = isMobile ? 35 : 70;
    const embers: Ember[] = [];

    const inkTendrils: InkTendril[] = [];
    const maxInkTendrils = isMobile ? 25 : 50;

    const glyphs: MythicGlyph[] = [];
    const maxGlyphs = 10;

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
      ember.y = height + Math.random() * 40;
      ember.vx = (Math.random() - 0.5) * 0.7;
      ember.vy = -(Math.random() * 1.1 + 0.35);
      ember.size = Math.random() * 2.2 + 1.0;
      ember.maxLife = Math.random() * 260 + 130;
      ember.life = ember.maxLife;
      ember.alpha = Math.random() * 0.7 + 0.3;
      ember.hue = Math.random() > 0.4 ? 32 : 22; // Warm amber / terracotta
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
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 20 + 12,
        alpha: isDark ? 0.28 : 0.18,
        maxLife: 85,
        life: 85
      });
    };

    const spawnGlyph = (x: number, y: number) => {
      if (glyphs.length >= maxGlyphs) glyphs.shift();
      const char = GREEK_GLYPHS[Math.floor(Math.random() * GREEK_GLYPHS.length)];
      glyphs.push({
        x,
        y,
        char,
        alpha: 0.75,
        life: 100,
        maxLife: 100
      });
    };

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
      if (dist > 18) {
        spawnInkTendril(x, y);
        if (Math.random() > 0.85) {
          spawnGlyph(x + (Math.random() - 0.5) * 35, y + (Math.random() - 0.5) * 35);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      shockwavesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: isMobile ? 130 : 200,
        alpha: 0.8
      });

      for (let i = 0; i < 14; i++) {
        const ember = initEmber();
        const angle = (i / 14) * Math.PI * 2;
        const speed = Math.random() * 2.8 + 1.2;
        ember.x = x;
        ember.y = y;
        ember.vx = Math.cos(angle) * speed;
        ember.vy = Math.sin(angle) * speed;
        ember.size = Math.random() * 3.0 + 1.8;
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

      // 1. Organic Hellenic Marble Veining & Ambient Smoke Wash
      ctx.save();
      const marbleGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.7
      );

      if (isDark) {
        marbleGrad.addColorStop(0, 'rgba(234, 88, 12, 0.035)');
        marbleGrad.addColorStop(0.4, 'rgba(15, 23, 42, 0.02)');
        marbleGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        marbleGrad.addColorStop(0, 'rgba(194, 65, 12, 0.04)');
        marbleGrad.addColorStop(0.5, 'rgba(120, 53, 15, 0.015)');
        marbleGrad.addColorStop(1, 'rgba(250, 246, 240, 0)');
      }
      ctx.fillStyle = marbleGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Fluid Shadow Ink Swirls of Erebus (Soft organic water/papyrus diffusion)
      ctx.save();
      for (let i = inkTendrils.length - 1; i >= 0; i--) {
        const ink = inkTendrils[i];
        ink.life -= 1;
        ink.x += ink.vx;
        ink.y += ink.vy;
        ink.radius += 0.32;
        const progress = ink.life / ink.maxLife;
        const curAlpha = ink.alpha * progress;

        if (ink.life <= 0) {
          inkTendrils.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(ink.x, ink.y, 0, ink.x, ink.y, ink.radius);
        if (isDark) {
          grad.addColorStop(0, `rgba(234, 88, 12, ${curAlpha * 0.6})`);
          grad.addColorStop(0.45, `rgba(18, 22, 32, ${curAlpha * 0.85})`);
          grad.addColorStop(1, 'rgba(7, 8, 11, 0)');
        } else {
          grad.addColorStop(0, `rgba(194, 65, 12, ${curAlpha * 0.4})`);
          grad.addColorStop(0.55, `rgba(120, 53, 15, ${curAlpha * 0.3})`);
          grad.addColorStop(1, 'rgba(250, 246, 240, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ink.x, ink.y, ink.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Tactile Shockwaves on Click (Organic golden ripple, zero wireframes)
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const wave = shockwavesRef.current[i];
        wave.radius += 4.2;
        wave.alpha = Math.max(0, 1 - wave.radius / wave.maxRadius);

        if (wave.radius >= wave.maxRadius || wave.alpha <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(245, 158, 11, ${wave.alpha * 0.55})`
          : `rgba(194, 65, 12, ${wave.alpha * 0.45})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 4. Mythic Greek Runes (Blossoming and dissolving into parchment)
      ctx.save();
      for (let i = glyphs.length - 1; i >= 0; i--) {
        const glyph = glyphs[i];
        glyph.life -= 1;
        glyph.y -= 0.25;
        const progress = glyph.life / glyph.maxLife;
        const alpha = glyph.alpha * progress;

        if (glyph.life <= 0) {
          glyphs.splice(i, 1);
          continue;
        }

        ctx.font = 'bold 15px "Cinzel", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDark
          ? `rgba(245, 158, 11, ${alpha})`
          : `rgba(194, 65, 12, ${alpha})`;
        ctx.shadowColor = isDark ? '#ea580c' : '#c2410c';
        ctx.shadowBlur = isDark ? 6 : 3;
        ctx.fillText(glyph.char, glyph.x, glyph.y);
      }
      ctx.restore();

      // 5. Drifting Prometheus Golden Embers
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
          if (dist < 90 && dist > 1) {
            const force = (1 - dist / 90) * 1.4;
            ember.vx += (dx / dist) * force;
            ember.vy += (dy / dist) * force;
          }
        }

        // Dampen velocity
        ember.vx *= 0.985;
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
          ctx.shadowColor = `hsla(${ember.hue}, 95%, 50%, 0.75)`;
          ctx.shadowBlur = 5;
        } else {
          ctx.fillStyle = `hsla(${ember.hue}, 85%, 38%, ${currentAlpha * 0.8})`;
          ctx.shadowColor = `hsla(${ember.hue}, 85%, 45%, 0.35)`;
          ctx.shadowBlur = 2;
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
  }, [theme]);

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
