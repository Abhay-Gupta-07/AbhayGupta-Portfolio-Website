import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PersonalInfo } from '../data/portfolioData';

interface LanyardCardProps {
  data: PersonalInfo;
}

export const LanyardCard: React.FC<LanyardCardProps> = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Motion values for drag and pendulum spring physics
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Spring physics setup for natural pendulum bounce back
  const springX = useSpring(dragX, { stiffness: 300, damping: 20 });
  const springY = useSpring(dragY, { stiffness: 300, damping: 20 });

  // Rotate angles derived from drag displacement
  const rotateX = useTransform(springY, [-100, 100], [25, -25]);
  const rotateY = useTransform(springX, [-100, 100], [-25, 25]);
  const strapRotateX = useTransform(springY, [-100, 100], [10, -10]);
  const strapRotateY = useTransform(springX, [-100, 100], [-10, 10]);

  return (
    <motion.div
      animate={{ rotateZ: [-6, 6, -6], rotateY: [-8, 8, -8] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      style={{ transformOrigin: 'top center' }}
      className="relative flex flex-col items-center justify-center select-none py-2"
    >
      {/* Lanyard Top Strap Anchor */}
      <div className="relative w-full flex justify-center z-20">
        <div className="w-12 h-6 bg-crimson-600 rounded-t-md border-t border-crimson-500 shadow-md flex items-center justify-center">
          <div className="w-4 h-2 bg-neutral-900 rounded-sm" />
        </div>
      </div>

      {/* Strap Lines connecting top anchor to ID card clip */}
      <motion.div
        style={{ rotateX: strapRotateX, rotateY: strapRotateY }}
        className="w-10 h-10 relative flex justify-between z-10"
      >
        <div className="w-2.5 h-full bg-gradient-to-b from-[#260c10] via-[#ff1e2d] to-[#120708] shadow-sm border-x border-crimson-500/30" />
        <div className="w-2.5 h-full bg-gradient-to-b from-[#260c10] via-[#ff1e2d] to-[#120708] shadow-sm border-x border-crimson-500/30" />
      </motion.div>

      {/* Metal Lanyard Clip */}
      <div className="z-30 relative -mt-1 flex flex-col items-center">
        <div className="w-8 h-4 bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-500 rounded-sm border border-neutral-300 shadow-lg flex justify-center items-center">
          <div className="w-3 h-2 bg-neutral-800 rounded-full" />
        </div>
        <div className="w-3 h-4 bg-neutral-600 border border-neutral-400 rounded-b-md" />
      </div>

      {/* 3D Interactive Pendulum Lanyard ID Card */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.6}
        style={{ x: springX, y: springY, rotateX, rotateY }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ cursor: 'grabbing' }}
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative z-30 cursor-grab transition-shadow duration-300 group"
      >
        {/* Floating Tooltip Pill Badge */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute -top-3 left-2 z-40 px-2.5 py-0.5 rounded-md bg-[#18181b]/95 border border-white/20 text-[10px] font-code text-gray-200 shadow-lg font-semibold pointer-events-none flex items-center gap-1"
        >
          Pull & Release Me!
        </motion.div>

        <div className="w-64 sm:w-72 h-[380px] rounded-3xl bg-[#120708] relative overflow-hidden border-4 border-neutral-300 shadow-[0_20px_50px_rgba(255,30,45,0.4)] flex flex-col justify-between">

          {/* Silver Corner Screws / Rivets */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-500 shadow-sm z-30" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-500 shadow-sm z-30" />

          {/* Holographic Crimson Sheen Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-crimson-500/10 via-transparent to-white/5 opacity-60 pointer-events-none group-hover:opacity-90 transition-opacity z-20" />

          {!isFlipped ? (
            /* FRONT CARD VIEW */
            <div className="flex flex-col h-full justify-between relative z-10">
              {/* Photo Frame (Takes top ~78% height) */}
              <div className="w-full h-[295px] overflow-hidden bg-neutral-900 relative">
                {!imgError ? (
                  <img
                    src={data.avatarUrl}
                    alt={data.name}
                    onError={() => setImgError(true)}
                    draggable={false}
                    className="w-full h-full object-cover object-[center_35%] scale-125 transition-transform duration-300 pointer-events-none select-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-crimson-500 font-bebas text-4xl bg-neutral-950 px-2 text-center">
                    {data.name}
                    <span className="text-xs font-code text-gray-400 mt-1">{data.titles?.[0] || 'AI ENGINEER'}</span>
                  </div>
                )}
              </div>

              {/* Red Bottom Signature Footer Bar */}
              <div className="w-full h-[85px] bg-gradient-to-r from-crimson-600 via-crimson-500 to-crimson-700 flex items-center justify-between px-3.5 relative z-10 border-t-2 border-crimson-400/40">
                {/* Bottom Corner Silver Screws */}
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-500 shadow-sm z-30" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-neutral-200 border border-neutral-500 shadow-sm z-30" />

                {/* Centered Vertical Stack: Small Developer on Top, Bold Red Name on Bottom */}
                <div className="flex flex-col items-center justify-center space-y-0.5 w-full">
                  <div className="font-hand text-white/95 text-xs sm:text-sm italic tracking-wider leading-none">
                    Developer
                  </div>
                  <div className="font-bebas text-[#ff1e2d] text-3xl sm:text-4xl font-extrabold tracking-widest leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] truncate max-w-[220px] text-center">
                    {(data.name || 'ABHAY').trim().split(' ')[0]}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* BACK CARD VIEW */
            <div className="flex flex-col justify-between h-full p-4 relative z-10 space-y-3 bg-[#120708]">
              <div className="text-center border-b border-white/10 pb-2">
                <h4 className="font-bebas text-xl text-crimson-500">AI & ML CAPABILITIES</h4>
                <p className="text-[11px] text-gray-400 font-code">VERIFIED CREDENTIALS</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-black/50 border border-white/5">
                  <span className="text-gray-400">AI Stack</span>
                  <span className="font-code text-crimson-500 font-medium">Python • PyTorch</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                  <span className="text-gray-400">Web Architecture</span>
                  <span className="font-code text-gray-200 font-medium">Next.js • React</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                  <span className="text-gray-400">Location</span>
                  <span className="text-gray-200 font-medium">Hyderabad, IN</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-crimson-500/10 border border-crimson-500/30 text-center">
                <p className="text-[11px] text-gray-300 italic">
                  "{data.bio}"
                </p>
              </div>

              <div className="text-center text-[10px] text-crimson-500 font-code cursor-pointer">
                [Click to Flip Front]
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
};
