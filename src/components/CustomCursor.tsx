import React, { useEffect, useRef } from 'react';

interface WebNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, lastX: width / 2, lastY: height / 2, isHovered: false };
    const nodes: WebNode[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Check if mouse is hovering interactive elements
      const target = e.target as HTMLElement | null;
      mouse.isHovered = !!(
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a'))
      );

      // Add web node if mouse moved enough
      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        nodes.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          life: 1,
          maxLife: 35 + Math.random() * 15,
        });
      }

      // Limit max web nodes
      if (nodes.length > 25) {
        nodes.shift();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw Spider-Web Trail Nodes & Constellation Lines
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        p1.life += 1;

        const alpha = Math.max(0, 1 - p1.life / p1.maxLife);

        // Connect p1 to mouse position if close
        const distToMouse = Math.hypot(mouse.x - p1.x, mouse.y - p1.y);
        if (distToMouse < 110) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(255, 30, 45, ${0.4 * alpha * (1 - distToMouse / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Connect p1 to neighboring nodes to create Spider-Web Mesh
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (d < 85) {
            const lineAlpha = (1 - d / 85) * alpha * Math.max(0, 1 - p2.life / p2.maxLife);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = j % 2 === 0 ? `rgba(255, 30, 45, ${lineAlpha * 0.6})` : `rgba(255, 255, 255, ${lineAlpha * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw Web Joint Node Dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 30, 45, ${alpha * 0.8})`;
        ctx.fill();
      }

      // Remove dead nodes
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].life >= nodes[i].maxLife) {
          nodes.splice(i, 1);
        }
      }

      // 2. Draw Main Spider-HUD Cursor Reticle (Matching Reference Screenshot)
      const reticleRadius = mouse.isHovered ? 22 : 15;

      // Outer Red Target Circle
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, reticleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 30, 45, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer Glow
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, reticleRadius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 30, 45, 0.25)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Diagonal Connecting Line to Inner Dot
      const angle = -Math.PI / 4;
      const dotOffsetX = Math.cos(angle) * (reticleRadius * 0.55);
      const dotOffsetY = Math.sin(angle) * (reticleRadius * 0.55);

      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(mouse.x + dotOffsetX, mouse.y + dotOffsetY);
      ctx.strokeStyle = '#ff1e2d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Red Center Dot
      ctx.beginPath();
      ctx.arc(mouse.x + dotOffsetX, mouse.y + dotOffsetY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1e2d';
      ctx.fill();

      // Core Reticle Center Dot
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hidden lg:block pointer-events-none fixed inset-0 z-[99999] overflow-hidden"
    />
  );
};
