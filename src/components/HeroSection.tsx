import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Download, Sparkles } from 'lucide-react';
import type { PersonalInfo } from '../data/portfolioData';
import { LanyardCard } from './LanyardCard';

interface HeroSectionProps {
  data: PersonalInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = data.resumeUrl;
    link.download = 'Abhay_Gupta_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="hero" className="min-h-screen relative pt-28 pb-16 px-4 max-w-7xl mx-auto flex flex-col justify-center overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

        {/* LEFT COLUMN: Main Hero Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col space-y-5 text-left z-10"
        >
          {/* Big Stacked Headline */}
          <div className="relative">
            <div className="font-brittany text-4xl sm:text-5xl text-white tracking-wide mb-1 relative z-10">
              Hello, I'm
            </div>

            <h1 className="font-bebas text-7xl sm:text-8xl lg:text-9xl tracking-tight text-white leading-[0.85] font-bold uppercase flex flex-col drop-shadow-2xl relative z-10">
              <span className="text-[#ff1e2d] text-glow drop-shadow-[0_0_35px_rgba(255,30,45,0.9)]">
                ABHAY
              </span>
              <span className="text-white">GUPTA</span>
            </h1>
          </div>

          {/* Glowing Red Subtitle Spec Bar */}
          <div className="font-code text-xs sm:text-sm text-crimson-500 font-extrabold tracking-wider uppercase flex flex-wrap items-center gap-2 pt-1 drop-shadow-[0_0_10px_rgba(255,30,45,0.6)]">
            <span>AI & MACHINE LEARNING ENGINEER</span>
            <span className="text-white">•</span>
            <span>FULL-STACK & FLUTTER DEVELOPER</span>
            <span className="text-white">•</span>
            <span>COMPUTER VISION SPECIALIST</span>
            <span className="text-white">•</span>
            <span>B.TECH CSE (FINAL YEAR)</span>
          </div>

          {/* Bio Subtitle Paragraph */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal pt-1">
            A Computer Science student at Mahaveer Institute of Science and Technology in Hyderabad specializing in AI and Machine Learning. Passionate about neural networks, computer vision, robotics, and full-stack web engineering—crafting high-performance digital platforms at ultra-high speed.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href="#contact"
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-crimson-500 hover:bg-crimson-600 shadow-[0_0_25px_rgba(255,30,45,0.6)] border border-crimson-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              GET IN TOUCH
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleDownloadCV}
              className="px-5 py-3 rounded-full text-xs font-bold text-gray-200 bg-black/60 hover:bg-white/10 border border-crimson-500/40 hover:border-crimson-500 shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              DOWNLOAD CV
              <Download className="w-3.5 h-3.5 text-crimson-500" />
            </button>

            <div className="px-4 py-3 rounded-full text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-crimson-500" />
              {data.location}
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Interactive Lanyard 3D ID Card, Quote Card & Vertical Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-5 flex flex-col items-center justify-center space-y-6 relative"
        >
          {/* Lanyard 3D Card */}
          <div className="relative w-full flex justify-center">
            <LanyardCard data={data} />
          </div>

          {/* Glass Quote Card */}
          <div className="w-full max-w-sm p-4 rounded-2xl glass-card border border-crimson-500/30 flex items-start gap-3 shadow-lg">
            <Sparkles className="w-4 h-4 text-crimson-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-snug font-medium">
              Building intelligent web applications, AI face recognition biometric systems, and leading campus tech innovation at MIST Hyderabad.
            </p>
          </div>

          {/* Right Vertical Stats Stack */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-3 text-left pt-1">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
              <div className="font-bebas text-2xl text-crimson-500 font-bold leading-none">FINAL YR</div>
              <div className="text-[9px] font-code text-gray-400 font-semibold leading-tight">B.TECH CSE (AI/ML) @ MIST</div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
              <div className="font-bebas text-2xl text-crimson-500 font-bold leading-none">10+</div>
              <div className="text-[9px] font-code text-gray-400 font-semibold leading-tight">FEATURED AI PROJECTS</div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-0.5">
              <div className="font-bebas text-2xl text-crimson-500 font-bold leading-none">MIST</div>
              <div className="text-[9px] font-code text-gray-400 font-semibold leading-tight">TECHNICAL AI LEAD</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
