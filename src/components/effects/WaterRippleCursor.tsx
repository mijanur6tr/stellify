'use client';

import * as React from 'react';

export function WaterRippleCursor() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    // 1. Accessibility & Device Checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ripple state
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      velocity: number;
    }

    const ripples: Ripple[] = [];
    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let lastY = -100;
    let lastSpawnTime = 0;
    let animId: number;
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const now = performance.now();
      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);

      // Tranquil, stately pacing: requires deliberate movement (110px) and at least 360ms between ripples
      if (dist > 110 && now - lastSpawnTime > 360) {
        ripples.push({
          x: mouseX,
          y: mouseY,
          radius: 6,
          maxRadius: 180,
          alpha: 0.65,
          velocity: 0.55, // Slow, gentle, soothing expansion
        });
        lastX = mouseX;
        lastY = mouseY;
        lastSpawnTime = now;

        // Keep buffer calm and uncluttered
        if (ripples.length > 7) {
          ripples.shift();
        }
      }
    };

    // Stately single-ripple click response
    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 8,
        maxRadius: 210,
        alpha: 0.72,
        velocity: 0.7,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // 60FPS Render Loop
    const render = () => {
      if (isTabVisible && ctx) {
        ctx.clearRect(0, 0, width, height);

        // Update and draw ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += r.velocity;
          r.alpha *= 0.988; // Slow, lingering dissipation (drifts peacefully for 3-4s)

          if (r.alpha < 0.015 || r.radius >= r.maxRadius) {
            ripples.splice(i, 1);
            continue;
          }

          // 1. Primary Gold Crest Ring
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(197, 160, 89, ${r.alpha})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // 2. Secondary Inner Champagne Glow Wave
          if (r.radius > 6) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, Math.max(0, r.radius - 5), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(229, 195, 120, ${r.alpha * 0.65})`;
            ctx.lineWidth = 1.6;
            ctx.stroke();
          }

          // 3. Tertiary Specular Ivory Highlight Ring
          if (r.radius > 12) {
            ctx.beginPath();
            ctx.arc(r.x, r.y, Math.max(0, r.radius - 10), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(250, 247, 242, ${r.alpha * 0.4})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }

        // Luminous Golden Cursor Wake
        if (mouseX > 0 && mouseY > 0) {
          const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 45);
          gradient.addColorStop(0, 'rgba(197, 160, 89, 0.25)');
          gradient.addColorStop(0.5, 'rgba(229, 195, 120, 0.08)');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 45, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      aria-hidden="true"
    />
  );
}
export default WaterRippleCursor;
