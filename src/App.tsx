import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/portfolioData';
import type { PortfolioData } from './data/portfolioData';
import { HeroCanvas } from './components/HeroCanvas';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesGrid } from './components/ServicesGrid';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificatesSection } from './components/CertificatesSection';
import { SkillsSection } from './components/SkillsSection';
import { TimelineSection } from './components/TimelineSection';
import { ContactSection } from './components/ContactSection';
import { MacOSDock } from './components/MacOSDock';
import { SpideyAdmin } from './components/SpideyAdmin';

export const App: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('abhay_portfolio_data_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.personal) {
          parsed.personal.email = 'abbaabhayyy@gmail.com';
        }
        return parsed;
      } catch (err) {
        console.error('Error loading saved portfolio data:', err);
      }
    }
    return initialPortfolioData;
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Sync route check for /spidey or ?spidey=true URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('admin') === 'true' || window.location.pathname.includes('spidey')) {
      setIsAdminOpen(true);
    }
  }, []);

  // IntersectionObserver to set glowing active nav link on scroll
  useEffect(() => {
    const sectionIds = ['hero', 'services', 'projects', 'certificates', 'skills', 'experience', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSavePortfolioData = (newData: PortfolioData) => {
    setPortfolioData(newData);
    localStorage.setItem('abhay_portfolio_data_v1', JSON.stringify(newData));
  };

  const handleResetPortfolioData = () => {
    if (confirm('Are you sure you want to reset all portfolio data to default?')) {
      setPortfolioData(initialPortfolioData);
      localStorage.removeItem('abhay_portfolio_data_v1');
    }
  };

  if (isAdminOpen) {
    return (
      <SpideyAdmin
        data={portfolioData}
        onSave={handleSavePortfolioData}
        onReset={handleResetPortfolioData}
        onClose={() => setIsAdminOpen(false)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0a0404] text-gray-100 overflow-x-hidden selection:bg-[#ff1e2d] selection:text-white">
      {/* 1. Custom Smooth Red Glowing Cursor */}
      <CustomCursor />

      {/* 2. HTML5 Canvas 192-Frame Scroll Animation + Radial Watermark Patch */}
      <HeroCanvas totalFrames={192} />

      {/* 3. Floating Glass Pill Navbar */}
      <Navbar data={portfolioData.personal} activeSection={activeSection} />

      {/* 4. Page Content Sections */}
      <main className="relative z-10 space-y-12 pb-24">
        {/* Hero Section with Interactive 3D Lanyard ID Card */}
        <HeroSection data={portfolioData.personal} />

        {/* Services Grid */}
        <ServicesGrid services={portfolioData.services} />

        {/* Featured Projects Gallery & Modals */}
        <ProjectsSection projects={portfolioData.projects} />

        {/* Verified Certifications & Accreditations */}
        <CertificatesSection certificates={portfolioData.certificates} />

        {/* Technical Skills & Proficiency Meters */}
        <SkillsSection skills={portfolioData.skills} />

        {/* Experience & Education Timeline */}
        <TimelineSection timeline={portfolioData.timeline} />

        {/* Contact Form & Direct Links */}
        <ContactSection data={portfolioData.personal} />
      </main>

      {/* 5. macOS Glass Dock with Vector Icons & Spidey Admin link */}
      <MacOSDock data={portfolioData.personal} />

      {/* Footer Branding */}
      <footer className="relative z-10 py-6 border-t border-crimson-500/20 text-center text-xs font-code text-gray-400 bg-[#0a0404]/90">
        <p>
          © 2026 <span className="text-crimson-500 font-semibold">{portfolioData.personal.name}</span> • Ultra-Dark Marvel Developer Portfolio. Built with Next.js, React 19 & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};

export default App;
