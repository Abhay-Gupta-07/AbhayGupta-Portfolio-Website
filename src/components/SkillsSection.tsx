import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Wrench, Sparkles, CheckCircle2, Star } from 'lucide-react';
import type { SkillCategory } from '../data/portfolioData';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const categoryIcons = [
    <Terminal className="w-4 h-4 text-crimson-500" />,
    <Database className="w-4 h-4 text-crimson-500" />,
    <Wrench className="w-4 h-4 text-crimson-500" />
  ];

  return (
    <section id="skills" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-code uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Technical Proficiency
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide">
          ENGINEERING <span className="text-crimson-500 text-glow">SKILLS & TECH MATRIX</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Proven hands-on mastery in modern front-end & back-end web frameworks, computer vision AI libraries, cross-platform mobile frameworks, and micro-controller hardware.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {skills.map((cat, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-crimson-500 text-white shadow-[0_0_25px_rgba(255,30,45,0.5)] border border-crimson-500/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {categoryIcons[idx] || <Star className="w-4 h-4 text-crimson-500" />}
              <span>{cat.category}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Description */}
      <div className="text-center mb-8">
        <p className="text-gray-400 text-xs font-code italic">
          // {skills[activeTab]?.description}
        </p>
      </div>

      {/* Skills Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills[activeTab]?.skills.map((skill, sIdx) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: sIdx % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: sIdx * 0.05 }}
            className={`p-5 rounded-xl glass-card border transition-all duration-300 ${
              skill.highlight
                ? 'border-crimson-500/30 bg-[#1a0a0c]/80 shadow-[0_0_15px_rgba(255,30,45,0.15)]'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson-500" />
                <span className="font-outfit text-sm font-semibold text-white">
                  {skill.name}
                </span>
                {skill.highlight && (
                  <span className="px-2 py-0.5 rounded-full bg-crimson-500/20 text-crimson-500 font-code text-[9px] font-bold">
                    CORE
                  </span>
                )}
              </div>
              <span className="font-code text-xs text-crimson-500 font-bold">
                {skill.level}%
              </span>
            </div>

            {/* Glowing Skill Meter Bar */}
            <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-crimson-700 via-crimson-500 to-red-400 rounded-full shadow-[0_0_10px_rgba(255,30,45,0.8)]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
