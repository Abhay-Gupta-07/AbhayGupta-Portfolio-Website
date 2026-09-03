import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Cpu, MapPin, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import type { TimelineItem } from '../data/portfolioData';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

const typeIconMap: Record<string, React.ReactNode> = {
  education: <GraduationCap className="w-5 h-5 text-crimson-500" />,
  leadership: <Award className="w-5 h-5 text-crimson-500" />,
  experience: <Cpu className="w-5 h-5 text-crimson-500" />
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline }) => {
  return (
    <section id="experience" className="py-24 px-4 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-code uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Journey & Milestones
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide">
          CAREER & <span className="text-crimson-500 text-glow">LEADERSHIP TIMELINE</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Tracking academic excellence in Computer Science Engineering, student innovation leadership at IEDC & MEX25, and hands-on robotics training workshops.
        </p>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative border-l-2 border-crimson-500/40 space-y-12 ml-4 sm:ml-8 pl-0">
        {timeline.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="relative group pl-16 sm:pl-20"
          >
            {/* Horizontal Connector Line from Main Line to Circle Node */}
            <div className="absolute left-0 top-6 w-4 sm:w-5 h-0.5 bg-crimson-500/80 group-hover:bg-crimson-500 transition-colors" />

            {/* Timeline Node Icon (Positioned Beside Line - 0 Overlap) */}
            <div className="absolute left-4 sm:left-5 top-1 w-10 h-10 rounded-full bg-[#120708]/80 backdrop-blur-md border-2 border-crimson-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,30,45,0.6)] group-hover:scale-110 transition-transform z-10">
              {typeIconMap[item.type] || <Award className="w-5 h-5 text-crimson-500" />}
            </div>

            {/* Timeline Card */}
            <div className="p-6 sm:p-8 rounded-2xl glass-card bg-[#120708]/40 backdrop-blur-md border border-white/10 hover:border-crimson-500/60 hover:bg-[#120708]/60 hover:shadow-[0_15px_40px_rgba(255,30,45,0.3)] transition-all duration-350">
              
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-crimson-500/15 border border-crimson-500/30 text-crimson-500 text-xs font-code font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.period}
                </span>

                <span className="text-gray-400 text-xs font-outfit flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-crimson-500" />
                  {item.location}
                </span>
              </div>

              {/* Title & Organization */}
              <h3 className="font-bebas text-3xl text-white tracking-wide group-hover:text-crimson-500 transition-colors">
                {item.role}
              </h3>
              <div className="text-crimson-500 font-outfit text-sm font-semibold mb-3">
                {item.organization}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                {item.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-crimson-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
