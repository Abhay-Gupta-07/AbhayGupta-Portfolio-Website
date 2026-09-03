import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/portfolioData';
import type { PortfolioData } from './data/portfolioData';
import { fetchPortfolioDataFromDB, savePortfolioDataToDB, subscribeToDataSync, subscribeToCloudDB, ensureValidPortfolioData } from './services/db';
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
    const saved = localStorage.getItem('abhay_portfolio_data_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return ensureValidPortfolioData(parsed);
      } catch (err) {
        console.error('Error loading saved portfolio data:', err);
      }
    }
    return initialPortfolioData;
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Hydrate portfolio data from Cloud Database on mount
  useEffect(() => {
    let isMounted = true;
    fetchPortfolioDataFromDB().then((res) => {
      if (isMounted && res.data) {
        setPortfolioData(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time Firestore Cloud Database listener
  useEffect(() => {
    const unsubscribe = subscribeToCloudDB((cloudData: PortfolioData) => {
      if (cloudData) {
        setPortfolioData(cloudData);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Real-time BroadcastChannel multi-tab synchronization
  useEffect(() => {
    const unsubscribe = subscribeToDataSync((newData) => {
      setPortfolioData(newData);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Fallback cross-tab synchronization via localStorage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'abhay_portfolio_data_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setPortfolioData(ensureValidPortfolioData(parsed));
        } catch (err) {
          console.error('Error loading synced portfolio data:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync route check for /spidey or ?admin=true URL
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
    const validated = ensureValidPortfolioData(newData);
    setPortfolioData(validated);
    savePortfolioDataToDB(validated);
  };

  const handleResetPortfolioData = () => {
    if (confirm('Are you sure you want to reset all portfolio data to default?')) {
      setPortfolioData(initialPortfolioData);
      savePortfolioDataToDB(initialPortfolioData);
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.search.includes('admin=')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + url.hash);
    }
  };

  if (isAdminOpen) {
    return (
      <SpideyAdmin
        data={portfolioData}
        onSave={handleSavePortfolioData}
        onReset={handleResetPortfolioData}
        onClose={handleCloseAdmin}
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
      <Navbar
        data={portfolioData.personal}
        activeSection={activeSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

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
      <MacOSDock
        data={portfolioData.personal}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

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
