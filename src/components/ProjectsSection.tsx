import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/portfolioData';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack', 'AI & Vision', 'Robotics / IoT', 'Mobile'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-code uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Production Engineering
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide">
          FEATURED <span className="text-crimson-500 text-glow">PROJECTS</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Exploration of real-world production projects ranging from high-FPS dark web apps and AI computer vision algorithms to IoT hardware telemetry dashboards.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-crimson-500 text-white shadow-[0_0_20px_rgba(255,30,45,0.5)] border border-crimson-500/50'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative rounded-2xl glass-card border border-white/10 hover:border-crimson-500/50 overflow-hidden flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(255,30,45,0.25)] transition-all duration-300"
          >
            {/* Card Top Media Image */}
            <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

              {/* Category Pill Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-crimson-500/30 text-[10px] font-code font-bold text-crimson-500 uppercase">
                {project.category}
              </div>

              {/* Metric Tag */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-crimson-500/20 backdrop-blur-md border border-crimson-500/40 text-[10px] font-code text-white">
                ⚡ {project.metrics}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-crimson-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3">
                {project.tags.slice(0, 4).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-code text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-crimson-500 hover:text-crimson-400 flex items-center gap-1 group/btn"
                >
                  Deep Overview
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Live Demo"
                    className="p-2 rounded-full bg-white/5 hover:bg-crimson-500/20 border border-white/10 hover:border-crimson-500/40 text-gray-300 hover:text-crimson-500 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub Repository"
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Deep Dive Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
