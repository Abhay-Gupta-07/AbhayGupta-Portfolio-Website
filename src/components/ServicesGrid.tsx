import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Eye, Smartphone, Cpu, Users, CheckCircle, Sparkles } from 'lucide-react';
import type { ServiceItem } from '../data/portfolioData';

interface ServicesGridProps {
  services: ServiceItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code2 className="w-7 h-7 text-crimson-500" />,
  Eye: <Eye className="w-7 h-7 text-crimson-500" />,
  Smartphone: <Smartphone className="w-7 h-7 text-crimson-500" />,
  Cpu: <Cpu className="w-7 h-7 text-crimson-500" />,
  Users: <Users className="w-7 h-7 text-crimson-500" />,
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({ services }) => {
  return (
    <section id="services" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-code uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Technical Capabilities
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide">
          SPECIALIZED <span className="text-crimson-500 text-glow">SERVICES</span> & SKILLS
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base font-outfit">
          Delivering production-ready engineering solutions spanning modern full-stack web applications, real-time AI vision models, cross-platform mobile apps, and IoT hardware telemetry systems.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative p-8 rounded-2xl glass-card bg-[#120708]/40 backdrop-blur-md border border-white/10 hover:border-crimson-500/60 hover:bg-[#120708]/60 hover:shadow-[0_15px_40px_rgba(255,30,45,0.3)] transition-all duration-350 flex flex-col justify-between"
          >
            {/* Top Glowing Red Accent */}
            <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-crimson-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-4">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-crimson-950/40 via-black/40 to-black/60 backdrop-blur-sm border border-crimson-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-crimson-500 transition-transform">
                {iconMap[service.icon] || <Code2 className="w-7 h-7 text-crimson-500" />}
              </div>

              {/* Title & Description */}
              <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-crimson-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-normal">
                {service.description}
              </p>

              {/* Features checklist */}
              <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-gray-400">
                {service.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-crimson-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Tech Tags */}
            <div className="flex flex-wrap gap-2 pt-6">
              {service.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-md bg-crimson-500/10 border border-crimson-500/20 text-[10px] font-code text-crimson-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
