import React, { useEffect, useRef, useState } from 'react';
import { preloadFrameImages, renderCanvasFrame } from '../utils/canvasRenderer';

interface HeroCanvasProps {
  totalFrames?: number;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ totalFrames = 192 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Preload 192 Frame Images
    preloadFrameImages(totalFrames, (loaded, total) => {
      if (isMounted) {
        setLoadingProgress(Math.round((loaded / total) * 100));
      }
    }).then((loadedImages) => {
      if (isMounted) {
        imagesRef.current = loadedImages;
        setIsPreloading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [totalFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Render loop mapped to window scroll position
    const render = () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;

      const scrollProgress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollProgress * totalFrames)
      );

      const frameImage = imagesRef.current[frameIndex] || null;

      renderCanvasFrame(
        ctx,
        canvas.width,
        canvas.height,
        scrollProgress,
        frameImage
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalFrames]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas
        id="hero-canvas"
        ref={canvasRef}
        className="w-full h-full object-cover opacity-80"
      />

      {/* Subtle Frame Loading Pill (Disappears when done) */}
      {isPreloading && (
        <div className="fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-full bg-black/80 border border-crimson-500/40 text-[10px] font-code text-crimson-500 flex items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping" />
          <span>Preloading Canvas Frames: {loadingProgress}%</span>
        </div>
      )}
    </div>
  );
};
