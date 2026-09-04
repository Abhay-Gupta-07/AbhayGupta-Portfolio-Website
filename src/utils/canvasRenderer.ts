export interface FramePreloadResult {
  images: HTMLImageElement[];
  loadedCount: number;
}

/**
 * Preloads 192 frame images from public/assets/frames/frame_XXX.png
 */
export function preloadFrameImages(
  totalFrames: number = 192,
  onProgress?: (loadedCount: number, total: number) => void
): Promise<HTMLImageElement[]> {
  return new Promise((resolve) => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/frames/frame_${frameNum}.png`;

      img.onload = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalFrames);
        if (loadedCount === totalFrames) resolve(images);
      };

      img.onerror = () => {
        // Fallback placeholder image element if file is missing
        loadedCount++;
        if (onProgress) onProgress(loadedCount, totalFrames);
        if (loadedCount === totalFrames) resolve(images);
      };

      images.push(img);
    }
  });
}

/**
 * Main 60 FPS Canvas Render Function with Watermark Radial Patch
 */
export function renderCanvasFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scrollProgress: number, // 0.0 to 1.0
  imageFrame?: HTMLImageElement | null,
  frameIndex?: number
) {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Image Frame if available and fully loaded
  let hasImage = false;
  if (imageFrame && imageFrame.complete && imageFrame.naturalWidth > 0) {
    hasImage = true;
    const hRatio = width / imageFrame.naturalWidth;
    const vRatio = height / imageFrame.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const verticalOffset = Math.min(80, height * 0.06);

    // Determine 1-indexed frame number (1 to 192)
    const currentFrame = (frameIndex !== undefined ? frameIndex : Math.floor(scrollProgress * 192)) + 1;

    // Face Focus camera angle factor for frames 1 to 27
    let faceWeight = 0;
    if (currentFrame <= 20) {
      faceWeight = 1.0;
    } else if (currentFrame <= 27) {
      faceWeight = (28 - currentFrame) / 8; // Smooth ease-out into frame 28
    } else {
      faceWeight = 0.0;
    }

    // Full-screen cover framing:
    // Center face in middle of screen for frames 1 to 27 while zooming edge-to-edge
    const faceY = (height * 0.46) - (imageFrame.naturalHeight * ratio * 0.20);
    const normalY = (height - imageFrame.naturalHeight * ratio) / 2 + verticalOffset;

    const centerShift_x = (width - imageFrame.naturalWidth * ratio) / 2;
    const centerShift_y = normalY * (1 - faceWeight) + faceY * faceWeight;

    ctx.drawImage(
      imageFrame,
      0, 0, imageFrame.naturalWidth, imageFrame.naturalHeight,
      centerShift_x, centerShift_y, imageFrame.naturalWidth * ratio, imageFrame.naturalHeight * ratio
    );
  }

  // 2. Procedural Sci-Fi Cyber Grid & Particles (Fallback or Layer overlay)
  const time = Date.now() * 0.001;
  const phase = scrollProgress * Math.PI * 4;

  if (!hasImage) {
    // Deep dark background
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.5, 50,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.8
    );
    bgGrad.addColorStop(0, '#1a060a');
    bgGrad.addColorStop(0.5, '#0d0305');
    bgGrad.addColorStop(1, '#0a0404');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Cyber Grid Lines
    ctx.strokeStyle = 'rgba(255, 30, 45, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    const offsetY = (scrollProgress * 200) % gridSize;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Dynamic HUD Hologram Circles
    const centerX = width * 0.5;
    const centerY = height * 0.50;
    const baseRadius = Math.min(width, height) * 0.22;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(phase + time * 0.2);

    // Outer Glowing Ring
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius + Math.sin(scrollProgress * Math.PI) * 40, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 30, 45, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 10, 5, 10]);
    ctx.stroke();

    // Inner Core Pulse
    ctx.beginPath();
    ctx.arc(0, 0, baseRadius * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 77, 90, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();

    // Cyber Floating Particles
    const particleCount = 45;
    for (let p = 0; p < particleCount; p++) {
      const px = ((p * 137.5 + scrollProgress * width * 0.5) % width);
      const py = ((p * 293.3 - scrollProgress * height * 0.8 + height) % height);
      const size = (p % 3) + 1.5;
      const alpha = 0.2 + 0.5 * Math.sin(p + time + scrollProgress * 10);

      ctx.fillStyle = `rgba(255, 30, 45, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle red connecting lines to nearby particles
      if (p > 0 && p % 4 === 0) {
        const prevPx = (((p - 1) * 137.5 + scrollProgress * width * 0.5) % width);
        const prevPy = (((p - 1) * 293.3 - scrollProgress * height * 0.8 + height) % height);
        ctx.strokeStyle = `rgba(255, 30, 45, ${alpha * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(prevPx, prevPy);
        ctx.stroke();
      }
    }
  }

  // 3. MANDATORY WATERMARK PATCH (Step 5 of prompt specification)
  // Draw a smooth radial patch (#0a0404) at the bottom-right corner (cw - patchW, ch - patchH) to cover any background video watermark seamlessly.
  const patchW = Math.max(240, width * 0.25);
  const patchH = Math.max(120, height * 0.18);
  const patchX = width - patchW;
  const patchY = height - patchH;

  const patchGrad = ctx.createRadialGradient(
    width, height, 0,
    width, height, Math.max(patchW, patchH)
  );
  patchGrad.addColorStop(0, '#0a0404');
  patchGrad.addColorStop(0.65, '#0a0404');
  patchGrad.addColorStop(0.85, 'rgba(10, 4, 4, 0.85)');
  patchGrad.addColorStop(1, 'rgba(10, 4, 4, 0)');

  ctx.fillStyle = patchGrad;
  ctx.beginPath();
  ctx.rect(patchX - 50, patchY - 50, patchW + 50, patchH + 50);
  ctx.fill();
}
