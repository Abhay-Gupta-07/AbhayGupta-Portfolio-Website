import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, BarChart3, Layers } from 'lucide-react';
import type { Project } from '../data/portfolioData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl rounded-2xl glass-card-crimson border border-crimson-500/40 p-5 sm:p-6 shadow-[0_20px_60px_rgba(255,30,45,0.3)] my-6 max-h-[85vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-crimson-500/30 text-gray-300 hover:text-white transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header & Metrics */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-crimson-500 text-white text-[10px] font-code font-bold uppercase tracking-wider">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-crimson-500 text-[10px] font-code font-medium">
                ⚡ {project.metrics}
              </span>
            </div>

            <h2 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
              {project.title}
            </h2>
            <p className="text-crimson-500 font-outfit text-xs font-semibold tracking-wide">
              {project.subtitle}
            </p>

            {/* Project Image Preview */}
            <div className="relative w-full h-44 sm:h-56 rounded-xl overflow-hidden border border-white/10 shadow-lg my-3">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-70" />
            </div>

            {/* Detailed Description */}
            <div className="space-y-2 py-1">
              <h3 className="font-bebas text-xl text-white tracking-wide">Architecture Overview</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="space-y-2 py-1">
              <h3 className="font-bebas text-xl text-white tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-crimson-500" />
                Key Highlights & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                {project.features.map((feat, fIdx) => (
                  <div key={fIdx} className="p-2.5 rounded-lg bg-black/40 border border-crimson-500/20 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-crimson-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2 py-1">
              <h3 className="font-bebas text-xl text-white tracking-wide flex items-center gap-2">
                <Layers className="w-4 h-4 text-crimson-500" />
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-0.5 rounded bg-crimson-500/10 border border-crimson-500/30 text-[11px] font-code text-crimson-400 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 shadow-[0_0_20px_rgba(255,30,45,0.4)] flex items-center gap-2"
              >
                Launch Live Demo
                <ExternalLink className="w-4 h-4" />
              </a>

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  View GitHub Source
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
