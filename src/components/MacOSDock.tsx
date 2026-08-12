import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Download, ShieldAlert } from 'lucide-react';
import type { PersonalInfo } from '../data/portfolioData';

interface MacOSDockProps {
  data: PersonalInfo;
}

export const MacOSDock: React.FC<MacOSDockProps> = ({ data }) => {
  const mouseX = useMotionValue(Infinity);

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = data.resumeUrl;
    link.download = 'Abhay_Gupta_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dockItems = [
    {
      id: 'email',
      label: 'Send Email',
      icon: <Mail className="w-5 h-5 text-white" />,
      href: `mailto:${data.email}`,
      external: true
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      href: data.socials.instagram,
      external: true
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      ),
      href: data.socials.github,
      external: true
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      href: data.socials.linkedin,
      external: true
    },
    {
      id: 'download-cv',
      label: 'Download Resume',
      icon: <Download className="w-5 h-5 text-white" />,
      onClick: handleDownloadCV,
      external: false
    },
    {
      id: 'spidey',
      label: 'Spidey Admin',
      icon: <ShieldAlert className="w-5 h-5 text-crimson-500" />,
      href: '/spidey.html',
      external: true,
      highlight: true
    }
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass-dock pointer-events-auto px-4 py-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-2xl border border-crimson-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(255,30,45,0.2)]"
      >
        {dockItems.map((item) => (
          <DockIcon key={item.id} mouseX={mouseX} item={item} />
        ))}
      </motion.div>
    </div>
  );
};

interface DockIconProps {
  mouseX: any;
  item: {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    external: boolean;
    highlight?: boolean;
  };
}

const DockIcon: React.FC<DockIconProps> = ({ mouseX, item }) => {
  const ref = React.useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [42, 64, 42]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 12 });

  if (item.onClick) {
    return (
      <motion.button
        ref={ref}
        onClick={item.onClick}
        style={{ width, height: width }}
        whileTap={{ scale: 0.9 }}
        className="relative group rounded-xl flex items-center justify-center transition-colors bg-white/5 hover:bg-white/15 border border-white/10"
      >
        {item.icon}
        <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 px-2.5 py-1 rounded-md bg-black/90 border border-crimson-500/30 text-[10px] font-code text-white font-semibold whitespace-nowrap shadow-md pointer-events-none">
          {item.label}
        </span>
        <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-crimson-500 opacity-60 group-hover:opacity-100" />
      </motion.button>
    );
  }

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target={item.external ? '_blank' : '_self'}
      rel={item.external ? 'noopener noreferrer' : ''}
      style={{ width, height: width }}
      whileTap={{ scale: 0.9 }}
      className={`relative group rounded-xl flex items-center justify-center transition-colors ${
        item.highlight
          ? 'bg-crimson-500/20 border border-crimson-500/50 shadow-[0_0_15px_rgba(255,30,45,0.4)]'
          : 'bg-white/5 hover:bg-white/15 border border-white/10'
      }`}
    >
      {item.icon}
      <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 px-2.5 py-1 rounded-md bg-black/90 border border-crimson-500/30 text-[10px] font-code text-white font-semibold whitespace-nowrap shadow-md pointer-events-none">
        {item.label}
      </span>
      <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-crimson-500 opacity-60 group-hover:opacity-100" />
    </motion.a>
  );
};
