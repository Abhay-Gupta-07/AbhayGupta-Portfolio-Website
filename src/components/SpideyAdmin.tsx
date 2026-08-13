import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Save, RefreshCw, Download, Upload, ArrowLeft, CheckCircle2, User, Link as LinkIcon, FolderPlus, Award, Trash2, Plus, Edit3, Lock, Key, LogOut, ShieldCheck, Mail, Send } from 'lucide-react';
import type { PortfolioData, Project, Certificate } from '../data/portfolioData';

interface SpideyAdminProps {
  data: PortfolioData;
  onSave: (newData: PortfolioData) => void;
  onReset: () => void;
  onClose?: () => void;
}

export const SpideyAdmin: React.FC<SpideyAdminProps> = ({ data, onSave, onReset, onClose }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('spidey_admin_auth') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Admin Data & Tabs State
  const [formData, setFormData] = useState<PortfolioData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'certificates' | 'skills' | 'socials' | 'inbox'>('projects');
  const [inboxMessages, setInboxMessages] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('spidey_admin_messages_v1') || '[]');
    } catch {
      return [];
    }
  });

  const handleClearInbox = () => {
    if (confirm('Clear all received inbox messages?')) {
      localStorage.removeItem('spidey_admin_messages_v1');
      setInboxMessages([]);
    }
  };

  // Project modal state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Certificate modal state
  const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);

  // Handle Login Form Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'DarshKaWaqt' && loginPassword === 'DarshHuMein') {
      setIsAuthenticated(true);
      sessionStorage.setItem('spidey_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('INVALID USERNAME OR PASSWORD! ACCESS DENIED.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('spidey_admin_auth');
    setLoginUsername('');
    setLoginPassword('');
  };

  const handlePersonalChange = (field: keyof PortfolioData['personal'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (network: keyof PortfolioData['personal']['socials'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        socials: {
          ...prev.personal.socials,
          [network]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAndClose = () => {
    onSave(formData);
    setSavedSuccess(true);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  /* Project Manager Handlers */
  const handleSaveProject = () => {
    if (!editingProject?.title) return;

    if (isAddingProject) {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: editingProject.title || 'New Project',
        subtitle: editingProject.subtitle || 'Subheading description',
        description: editingProject.description || 'Short summary',
        longDescription: editingProject.longDescription || 'Detailed architecture overview...',
        category: (editingProject.category as any) || 'Full Stack',
        tags: editingProject.tags || ['React', 'Python'],
        image: editingProject.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        liveUrl: editingProject.liveUrl || 'https://abhaygupta.vercel.app/',
        githubUrl: editingProject.githubUrl || 'https://github.com/Abhay-Gupta-07',
        featured: editingProject.featured ?? true,
        metrics: editingProject.metrics || '60 FPS',
        features: editingProject.features || ['Feature 1', 'Feature 2'],
        techStack: editingProject.techStack || ['Next.js', 'Python']
      };
      setFormData((prev) => ({ ...prev, projects: [...prev.projects, newProj] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === editingProject.id ? ({ ...p, ...editingProject } as Project) : p)),
      }));
    }

    setEditingProject(null);
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      }));
    }
  };

  /* Certificate Manager Handlers */
  const handleSaveCertificate = () => {
    if (!editingCert?.title) return;

    if (isAddingCert) {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        title: editingCert.title || 'New Certification',
        issuer: editingCert.issuer || 'Issuing Organization',
        date: editingCert.date || '2026',
        credentialUrl: editingCert.credentialUrl || 'https://www.linkedin.com/in/abhay-gupta-6546aa299/',
        badge: editingCert.badge || 'VERIFIED CREDENTIAL',
        skillsCovered: editingCert.skillsCovered || ['AI/ML', 'Full-Stack'],
        imageUrl: editingCert.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
      };
      setFormData((prev) => ({
        ...prev,
        certificates: [...(prev.certificates || []), newCert]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        certificates: (prev.certificates || []).map((c) => (c.id === editingCert.id ? ({ ...c, ...editingCert } as Certificate) : c)),
      }));
    }

    setEditingCert(null);
    setIsAddingCert(false);
  };

  const handleDeleteCertificate = (id: string) => {
    if (confirm('Delete this certificate?')) {
      setFormData((prev) => ({
        ...prev,
        certificates: (prev.certificates || []).filter((c) => c.id !== id),
      }));
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'abhay_portfolio_data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.personal) {
            setFormData(parsed);
            onSave(parsed);
            alert('Portfolio Configuration Imported Successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  /* 🔒 LOCK SCREEN / LOGIN SCREEN FOR UNAUTHENTICATED USERS */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0404] text-gray-100 flex items-center justify-center p-4 font-outfit relative overflow-hidden">
        {/* Background Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 rounded-3xl glass-card-crimson border border-crimson-500/40 shadow-[0_20px_60px_rgba(255,30,45,0.3)] space-y-6 relative z-10 text-center"
        >
          {/* Header Shield */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-crimson-600 to-red-900 border border-crimson-500/60 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(255,30,45,0.5)]">
            <Lock className="w-8 h-8 text-white animate-pulse" />
          </div>

          <div>
            <h2 className="font-bebas text-4xl text-white tracking-wide">
              SPIDEY ADMIN <span className="text-crimson-500 text-glow">SECURITY LOCK</span>
            </h2>
            <p className="text-gray-400 text-xs font-code mt-1">
              // RESTRICTED CONSOLE FOR ABHAY GUPTA ONLY
            </p>
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-code font-bold shadow-md"
            >
              ⚠️ {authError}
            </motion.div>
          )}

          {/* Login Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-crimson-500" />
                ADMIN USERNAME
              </label>
              <input
                type="text"
                required
                placeholder="Enter Admin Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 focus:border-crimson-500 focus:outline-none text-sm text-white placeholder-gray-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-crimson-500" />
                ADMIN PASSWORD
              </label>
              <input
                type="password"
                required
                placeholder="Enter Security Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/15 focus:border-crimson-500 focus:outline-none text-sm text-white placeholder-gray-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-crimson-600 via-crimson-500 to-red-700 hover:from-crimson-500 hover:to-crimson-600 shadow-[0_0_25px_rgba(255,30,45,0.5)] border border-crimson-500/50 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              AUTHENTICATE SPIDEY ACCESS
            </button>
          </form>

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-crimson-500 underline transition-colors"
            >
              ← Return to Main Portfolio Site
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  /* 🔓 AUTHENTICATED SPIDEY ADMIN DASHBOARD */
  return (
    <div className="min-h-screen bg-[#0a0404] text-gray-100 p-4 sm:p-8 font-outfit">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-crimson-500/30 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-crimson-500/20 border border-crimson-500/50 text-crimson-500 shadow-[0_0_20px_rgba(255,30,45,0.4)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-bebas text-4xl text-white tracking-wide">
                SPIDEY ADMIN CONSOLE
              </h1>
              <p className="text-xs font-code text-crimson-500">
                // AUTHENTICATED ACCESS FOR ABHAY GUPTA (DarshKaWaqt)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </button>
            )}

            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 shadow-[0_0_20px_rgba(255,30,45,0.4)] flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>

            {onClose && (
              <button
                onClick={handleSaveAndClose}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/30 flex items-center gap-2 text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save & View Main Page
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-700/50 text-red-300 text-xs flex items-center gap-1.5"
              title="Lock Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-crimson-500/20 border border-crimson-500/50 text-crimson-500 font-semibold text-xs text-center flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            ALL PORTFOLIO DATA & CERTIFICATES SAVED LOCALLY!
          </motion.div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'projects'
                ? 'bg-crimson-500 text-white shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            Projects Manager ({formData.projects.length})
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'certificates'
                ? 'bg-crimson-500 text-white shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Certificates Manager ({(formData.certificates || []).length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'profile'
                ? 'bg-crimson-500 text-white shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Profile & Bio
          </button>

          <button
            onClick={() => setActiveTab('socials')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'socials'
                ? 'bg-crimson-500 text-white shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Social Profiles & Resume
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'inbox'
                ? 'bg-crimson-500 text-white shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-crimson-400" />
            Inbox Messages ({inboxMessages.length})
          </button>
        </div>

        {/* TAB 1: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl text-white">MANAGE FEATURED PROJECTS</h3>
              <button
                onClick={() => {
                  setEditingProject({
                    title: '',
                    subtitle: '',
                    description: '',
                    category: 'Full Stack',
                    tags: ['Next.js', 'Python'],
                    liveUrl: 'https://abhaygupta.vercel.app/',
                    githubUrl: 'https://github.com/Abhay-Gupta-07'
                  });
                  setIsAddingProject(true);
                }}
                className="px-4 py-2 rounded-xl bg-crimson-500 text-white text-xs font-semibold flex items-center gap-2 hover:bg-crimson-600 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add New Project
              </button>
            </div>

            {/* List of Existing Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-xl glass-card border border-white/10 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-crimson-500/20 text-crimson-500 text-[10px] font-code font-bold">
                        {proj.category}
                      </span>
                      <span className="text-[10px] font-code text-gray-400">⚡ {proj.metrics}</span>
                    </div>
                    <h4 className="font-bebas text-2xl text-white mt-1">{proj.title}</h4>
                    <p className="text-gray-300 text-xs line-clamp-2">{proj.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                        setIsAddingProject(false);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATES MANAGER */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl text-white">MANAGE CERTIFICATIONS & ACCREDITATIONS</h3>
              <button
                onClick={() => {
                  setEditingCert({
                    title: '',
                    issuer: '',
                    date: '2024',
                    badge: 'VERIFIED CREDENTIAL',
                    credentialUrl: 'https://linkedin.com/in/abhay-gupta-6546aa299/',
                    skillsCovered: ['Python', 'AI/ML']
                  });
                  setIsAddingCert(true);
                }}
                className="px-4 py-2 rounded-xl bg-crimson-500 text-white text-xs font-semibold flex items-center gap-2 hover:bg-crimson-600 shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add New Certificate
              </button>
            </div>

            {/* List of Certificates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(formData.certificates || []).map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl glass-card border border-white/10 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    {/* Certificate Thumbnail Preview */}
                    <div className="w-full h-28 bg-black/60 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                      <img
                        src={cert.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-crimson-500/20 text-crimson-500 text-[10px] font-code font-bold">
                        {cert.badge}
                      </span>
                      <span className="text-[10px] font-code text-gray-400">{cert.date}</span>
                    </div>
                    <h4 className="font-bebas text-xl text-white leading-tight">{cert.title}</h4>
                    <p className="text-crimson-500 text-xs font-semibold">{cert.issuer}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setEditingCert(cert);
                        setIsAddingCert(false);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteCertificate(cert.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PERSONAL PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 rounded-2xl glass-card-crimson border border-crimson-500/30 space-y-4 max-w-2xl">
            <h3 className="font-bebas text-2xl text-white tracking-wide flex items-center gap-2">
              <User className="w-5 h-5 text-crimson-500" />
              Personal Profile Settings
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Full Name</label>
              <input
                type="text"
                value={formData.personal.name}
                onChange={(e) => handlePersonalChange('name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Handle</label>
              <input
                type="text"
                value={formData.personal.handle}
                onChange={(e) => handlePersonalChange('handle', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Email Address</label>
              <input
                type="email"
                value={formData.personal.email}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Location</label>
              <input
                type="text"
                value={formData.personal.location}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Short Bio</label>
              <textarea
                rows={3}
                value={formData.personal.bio}
                onChange={(e) => handlePersonalChange('bio', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 4: SOCIALS & RESUME */}
        {activeTab === 'socials' && (
          <div className="p-6 rounded-2xl glass-card-crimson border border-crimson-500/30 space-y-4 max-w-2xl">
            <h3 className="font-bebas text-2xl text-white tracking-wide flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-crimson-500" />
              Social Profiles & Downloadable CV
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">GitHub Profile URL</label>
              <input
                type="text"
                value={formData.personal.socials.github}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Instagram Profile URL</label>
              <input
                type="text"
                value={formData.personal.socials.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">LinkedIn Profile URL</label>
              <input
                type="text"
                value={formData.personal.socials.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-code text-gray-400">Downloadable Resume URL</label>
              <input
                type="text"
                value={formData.personal.resumeUrl}
                onChange={(e) => handlePersonalChange('resumeUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* TAB 6: INBOX MESSAGES */}
        {activeTab === 'inbox' && (
          <div className="p-6 rounded-2xl glass-card-crimson border border-crimson-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl text-white tracking-wide flex items-center gap-2">
                <Mail className="w-5 h-5 text-crimson-500" />
                Submitted Website Contact Messages ({inboxMessages.length})
              </h3>

              {inboxMessages.length > 0 && (
                <button
                  onClick={handleClearInbox}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-xs text-red-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Inbox
                </button>
              )}
            </div>

            {inboxMessages.length === 0 ? (
              <div className="p-12 text-center text-gray-500 space-y-2">
                <Mail className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-sm font-code">No user contact messages submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inboxMessages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{msg.name}</span>
                        <span className="text-xs font-code text-crimson-400 font-normal">({msg.email})</span>
                      </div>
                      <span className="text-[10px] font-code text-gray-400">{msg.date}</span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed font-outfit bg-white/5 p-3 rounded-lg border border-white/5">
                      {msg.message}
                    </p>
                    <div className="flex justify-end pt-1">
                      <a
                        href={`mailto:${msg.email}?subject=Re:%20Portfolio%20Inquiry`}
                        className="text-xs text-crimson-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL FOR ADDING / EDITING PROJECTS */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-xl p-6 rounded-2xl glass-card-crimson border border-crimson-500/40 space-y-4 max-h-[85vh] overflow-y-auto">
              <h3 className="font-bebas text-3xl text-white">
                {isAddingProject ? 'Add New Project' : 'Edit Project'}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-code text-gray-400">Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Category</label>
                  <select
                    value={editingProject.category || 'Full Stack'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI & Vision">AI & Vision</option>
                    <option value="Robotics / IoT">Robotics / IoT</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Short Summary</label>
                  <textarea
                    rows={2}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Project Cover Image Upload & Live Preview */}
                <div>
                  <label className="text-xs font-code text-gray-400 flex items-center justify-between mb-1">
                    <span>Project Cover Image Upload / URL</span>
                    <span className="text-[10px] text-crimson-400">PNG, JPG, WebP supported</span>
                  </label>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL or click Upload File..."
                        value={editingProject.image || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      />
                      <label className="px-4 py-2 rounded-xl bg-crimson-500 hover:bg-crimson-600 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingProject({ ...editingProject, image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Live Preview Thumbnail */}
                    {editingProject.image && (
                      <div className="w-full h-40 bg-black/80 rounded-xl border border-crimson-500/40 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={editingProject.image}
                          alt="Project Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsAddingProject(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProject}
                  className="px-5 py-2 rounded-xl bg-crimson-500 text-xs text-white font-semibold"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOR ADDING / EDITING CERTIFICATES */}
        {editingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-xl p-6 rounded-2xl glass-card-crimson border border-crimson-500/40 space-y-4 max-h-[85vh] overflow-y-auto">
              <h3 className="font-bebas text-3xl text-white">
                {isAddingCert ? 'Add New Certificate' : 'Edit Certificate'}
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-code text-gray-400">Certification Title</label>
                  <input
                    type="text"
                    value={editingCert.title || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Issuer / Organization</label>
                  <input
                    type="text"
                    value={editingCert.issuer || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Year / Date</label>
                  <input
                    type="text"
                    value={editingCert.date || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Badge Label</label>
                  <input
                    type="text"
                    value={editingCert.badge || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, badge: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Credential Verification Link</label>
                  <input
                    type="text"
                    value={editingCert.credentialUrl || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Certificate Image Upload & Live Preview */}
                <div>
                  <label className="text-xs font-code text-gray-400 flex items-center justify-between mb-1">
                    <span>Certificate Image Upload / URL</span>
                    <span className="text-[10px] text-crimson-400">PNG, JPG, WebP supported</span>
                  </label>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL or click Upload File..."
                        value={editingCert.imageUrl || ''}
                        onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      />
                      <label className="px-4 py-2 rounded-xl bg-crimson-500 hover:bg-crimson-600 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingCert({ ...editingCert, imageUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Live Preview Thumbnail */}
                    {editingCert.imageUrl && (
                      <div className="w-full h-36 bg-black/80 rounded-xl border border-crimson-500/40 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={editingCert.imageUrl}
                          alt="Certificate Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setEditingCert(null);
                    setIsAddingCert(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCertificate}
                  className="px-5 py-2 rounded-xl bg-crimson-500 text-xs text-white font-semibold"
                >
                  Save Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* JSON Backup & Reset Actions */}
        <div className="p-6 rounded-2xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold flex items-center gap-2 text-gray-300"
            >
              <Download className="w-4 h-4 text-crimson-500" />
              Export Config JSON
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold flex items-center gap-2 text-gray-300 cursor-pointer">
              <Upload className="w-4 h-4 text-crimson-500" />
              Import Config JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-xs font-semibold text-red-300 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default State
          </button>
        </div>

      </div>
    </div>
  );
};
