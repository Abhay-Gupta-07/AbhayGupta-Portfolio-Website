import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Menu, X, ShieldAlert } from 'lucide-react';
import type { PersonalInfo } from '../data/portfolioData';

interface NavbarProps {
  data: PersonalInfo;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ data, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'services', label: 'SERVICES' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'certificates', label: 'AWARDS & CERTIFICATIONS' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = data.resumeUrl;
    link.download = 'Abhay_Gupta_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4 transition-all duration-300">
      {/* Floating Glass Pill Navigation Bar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full max-w-7xl rounded-full glass-pill px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 border ${
          scrolled ? 'border-crimson-500/30 shadow-[0_10px_30px_rgba(255,30,45,0.25)] bg-[#120708]/95' : 'border-white/10 bg-[#120708]/80'
        }`}
      >
        {/* Brand / Logo */}
        <a href="#hero" className="flex items-center gap-2 group shrink-0">
          <span className="font-outfit font-extrabold text-xs sm:text-sm tracking-widest text-white group-hover:text-crimson-500 transition-colors flex items-center gap-2 whitespace-nowrap uppercase">
            {data.name || 'ABHAY GUPTA'} <span className="text-crimson-500 font-extrabold">/</span> <span className="text-gray-300 font-bold text-[11px] sm:text-xs">CSE AI & ML ENGINEER</span>
          </span>
        </a>

        {/* Desktop Navigation Items */}
        <ul className="hidden lg:flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/5 text-[11px] font-code font-bold tracking-wider">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`relative px-4 py-1.5 rounded-full transition-all duration-300 inline-block ${
                    isActive
                      ? 'text-white font-black tracking-wider'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-gradient-to-r from-crimson-600 via-[#ff1e2d] to-red-700 rounded-full -z-10 border border-red-400/60 shadow-[0_0_25px_rgba(255,30,45,0.95)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Download Resume Button & Spidey Admin quick button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleDownloadCV}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 border border-crimson-500/50 shadow-[0_0_20px_rgba(255,30,45,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download CV
          </button>

          <a
            href="/spidey.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Spidey Admin Panel"
            className="p-1.5 rounded-full bg-white/5 hover:bg-crimson-500/20 border border-white/10 hover:border-crimson-500/50 text-crimson-500 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-20 left-4 right-4 bg-[#120708]/95 backdrop-blur-2xl border border-crimson-500/30 rounded-2xl p-6 shadow-2xl lg:hidden flex flex-col gap-4"
        >
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-xs font-code font-bold tracking-wider ${
                    activeSection === link.id
                      ? 'bg-crimson-500 text-white shadow-md'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                handleDownloadCV();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-crimson-500 shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download Abhay_Gupta_CV.pdf
            </button>
            <a
              href="/spidey.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center px-4 py-2 rounded-lg text-xs font-medium text-crimson-500 bg-crimson-500/10 border border-crimson-500/30"
            >
              Spidey Admin Panel
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};
