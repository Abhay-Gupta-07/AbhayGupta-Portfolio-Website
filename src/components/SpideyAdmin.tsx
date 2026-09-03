import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ShieldAlert, Save, RefreshCw, Download, Upload, ArrowLeft, CheckCircle2, User, Link as LinkIcon, FolderPlus, Award, Trash2, Plus, Edit3, Lock, Key, LogOut, ShieldCheck, Mail, Send, ArrowUp, ArrowDown, Database, CloudCheck, CloudUpload, CloudDownload, Settings, GripVertical, FileCheck, Copy } from 'lucide-react';
import type { PortfolioData, Project, Certificate } from '../data/portfolioData';
import { getFirebaseConfig, saveFirebaseConfig, testDBConnection, savePortfolioDataToDB, fetchPortfolioDataFromDB, ensureValidPortfolioData, fetchAdminMessagesFromDB, deleteAdminMessageFromDB, clearAllAdminMessagesFromDB, type AdminMessage } from '../services/db';

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
  const [formData, setFormData] = useState<PortfolioData>(() => ensureValidPortfolioData(data));

  useEffect(() => {
    setFormData(ensureValidPortfolioData(data));
  }, [data]);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'certificates' | 'skills' | 'socials' | 'inbox' | 'database'>('projects');

  // Cloud Database state
  const [dbConfig, setDbConfig] = useState(getFirebaseConfig);
  const [dbStatusMsg, setDbStatusMsg] = useState<{ success?: boolean; text?: string } | null>(null);
  const [isSyncingDB, setIsSyncingDB] = useState(false);

  const [inboxMessages, setInboxMessages] = useState<AdminMessage[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('spidey_admin_messages_v1') || '[]');
    } catch {
      return [];
    }
  });

  // Sync inbox messages from local storage & cloud database
  useEffect(() => {
    let isMounted = true;
    fetchAdminMessagesFromDB().then((msgs) => {
      if (isMounted && Array.isArray(msgs)) {
        setInboxMessages(msgs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const handleClearInbox = async () => {
    if (confirm('Clear all received inbox messages?')) {
      await clearAllAdminMessagesFromDB();
      setInboxMessages([]);
    }
  };

  const handleDeleteSingleMessage = async (msgId: string) => {
    if (confirm('Delete this message?')) {
      const updated = await deleteAdminMessageFromDB(msgId);
      setInboxMessages(updated);
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
    const updated = ensureValidPortfolioData({
      ...formData,
      personal: {
        ...formData.personal,
        [field]: value,
      },
    });
    setFormData(updated);
    onSave(updated);
  };

  const handleSocialChange = (network: keyof PortfolioData['personal']['socials'], value: string) => {
    const updated = ensureValidPortfolioData({
      ...formData,
      personal: {
        ...formData.personal,
        socials: {
          ...formData.personal.socials,
          [network]: value,
        },
      },
    });
    setFormData(updated);
    onSave(updated);
  };

  const handleSave = () => {
    const validated = ensureValidPortfolioData(formData);
    onSave(validated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAndClose = () => {
    const validated = ensureValidPortfolioData(formData);
    onSave(validated);
    setSavedSuccess(true);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  const handleClose = () => {
    onSave(formData);
    if (onClose) {
      onClose();
    }
  };

  /* Project & Certificate Drag & Drop Reordering Handlers */
  const handleReorderProjects = (newProjects: Project[]) => {
    const updated = ensureValidPortfolioData({
      ...formData,
      projects: newProjects,
    });
    setFormData(updated);
    onSave(updated);
  };

  const handleReorderCertificates = (newCerts: Certificate[]) => {
    const updated = ensureValidPortfolioData({
      ...formData,
      certificates: newCerts,
    });
    setFormData(updated);
    onSave(updated);
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.projects.length) return;
    const updatedProjects = [...formData.projects];
    const temp = updatedProjects[index];
    updatedProjects[index] = updatedProjects[targetIndex];
    updatedProjects[targetIndex] = temp;
    const updatedFormData = ensureValidPortfolioData({ ...formData, projects: updatedProjects });
    setFormData(updatedFormData);
    onSave(updatedFormData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleMoveCertificate = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= (formData.certificates || []).length) return;
    const updatedCerts = [...(formData.certificates || [])];
    const temp = updatedCerts[index];
    updatedCerts[index] = updatedCerts[targetIndex];
    updatedCerts[targetIndex] = temp;
    const updatedFormData = ensureValidPortfolioData({ ...formData, certificates: updatedCerts });
    setFormData(updatedFormData);
    onSave(updatedFormData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  /* Database Handlers */
  const handleSaveDBConfig = () => {
    saveFirebaseConfig(dbConfig);
    setDbStatusMsg({ success: true, text: 'Firebase Configuration Saved!' });
    setTimeout(() => setDbStatusMsg(null), 3000);
  };

  const handleTestDBConnection = async () => {
    setDbStatusMsg({ text: 'Testing Cloud Database Connection...' });
    const result = await testDBConnection(dbConfig);
    setDbStatusMsg({ success: result.success, text: result.message });
  };

  const handleForceDBSync = async () => {
    setIsSyncingDB(true);
    setDbStatusMsg({ text: 'Syncing Portfolio Data to Cloud Database...' });
    const result = await savePortfolioDataToDB(formData);
    setIsSyncingDB(false);
    if (result.success) {
      setSavedSuccess(true);
      setDbStatusMsg({
        success: true,
        text: `Data successfully saved to ${result.source === 'firestore' ? 'Firebase Firestore Cloud Database' : 'LocalStorage Cache'}!`,
      });
    } else {
      setDbStatusMsg({ success: false, text: result.error || 'Database sync failed.' });
    }
  };

  const handleForceDBFetch = async () => {
    setIsSyncingDB(true);
    setDbStatusMsg({ text: 'Fetching latest data from Cloud Database...' });
    const result = await fetchPortfolioDataFromDB();
    setIsSyncingDB(false);
    if (result.data) {
      setFormData(result.data);
      onSave(result.data);
      setSavedSuccess(true);
      setDbStatusMsg({
        success: true,
        text: `Successfully loaded data from ${result.source === 'firestore' ? 'Firebase Firestore Cloud Database' : 'LocalStorage Cache'}!`,
      });
    } else {
      setDbStatusMsg({ success: false, text: 'No saved Cloud Database record found.' });
    }
  };

  /* Helper utilities for parsing comma/newline delimited text into string arrays */
  const parseCommaTags = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') return raw.split(',').map((s) => s.trim()).filter(Boolean);
    return ['React', 'Python'];
  };

  const parseLineFeatures = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') return raw.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
    return ['Feature 1', 'Feature 2'];
  };

  /* Project Manager Handlers */
  const handleSaveProject = () => {
    if (!editingProject?.title) return;

    const newProj: Project = {
      id: isAddingProject ? `proj-${Date.now()}` : (editingProject.id || `proj-${Date.now()}`),
      title: editingProject.title || 'New Project',
      subtitle: editingProject.subtitle || 'Subheading description',
      description: editingProject.description || 'Short summary',
      longDescription: editingProject.longDescription || editingProject.description || 'Detailed architecture overview...',
      category: (editingProject.category as any) || 'Full Stack',
      tags: parseCommaTags(editingProject.tags),
      techStack: parseCommaTags(editingProject.techStack),
      features: parseLineFeatures(editingProject.features),
      image: editingProject.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      liveUrl: editingProject.liveUrl || 'https://abhaygupta.vercel.app/',
      githubUrl: editingProject.githubUrl || 'https://github.com/Abhay-Gupta-07',
      featured: editingProject.featured ?? true,
      metrics: editingProject.metrics || '60 FPS',
    };

    let updatedProjects: Project[];
    if (isAddingProject) {
      updatedProjects = [...formData.projects, newProj];
    } else {
      updatedProjects = formData.projects.map((p) => (p.id === newProj.id ? newProj : p));
    }

    const updatedFormData: PortfolioData = {
      ...formData,
      projects: updatedProjects,
    };

    setFormData(updatedFormData);
    onSave(updatedFormData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    setEditingProject(null);
    setIsAddingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project?')) {
      const updatedFormData: PortfolioData = {
        ...formData,
        projects: formData.projects.filter((p) => p.id !== id),
      };
      setFormData(updatedFormData);
      onSave(updatedFormData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  /* Certificate Manager Handlers */
  const handleSaveCertificate = () => {
    if (!editingCert?.title) return;

    let updatedCerts: Certificate[];
    if (isAddingCert) {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        title: editingCert.title || 'New Certification',
        issuer: editingCert.issuer || 'Issuing Organization',
        date: editingCert.date || '2026',
        credentialUrl: editingCert.credentialUrl || 'https://www.linkedin.com/in/abhay-gupta-6546aa299/',
        badge: editingCert.badge || 'VERIFIED CREDENTIAL',
        skillsCovered: Array.isArray(editingCert.skillsCovered)
          ? editingCert.skillsCovered
          : typeof editingCert.skillsCovered === 'string'
          ? (editingCert.skillsCovered as string).split(',').map((s) => s.trim()).filter(Boolean)
          : ['AI/ML', 'Full-Stack'],
        imageUrl: editingCert.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
      };
      updatedCerts = [...(formData.certificates || []), newCert];
    } else {
      updatedCerts = (formData.certificates || []).map((c) =>
        c.id === editingCert.id ? ({ ...c, ...editingCert } as Certificate) : c
      );
    }

    const updatedFormData: PortfolioData = {
      ...formData,
      certificates: updatedCerts,
    };

    setFormData(updatedFormData);
    onSave(updatedFormData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    setEditingCert(null);
    setIsAddingCert(false);
  };

  const handleDeleteCertificate = (id: string) => {
    if (confirm('Delete this certificate?')) {
      const updatedFormData: PortfolioData = {
        ...formData,
        certificates: (formData.certificates || []).filter((c) => c.id !== id),
      };
      setFormData(updatedFormData);
      onSave(updatedFormData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const generateTSCode = (dataToExport: PortfolioData): string => {
    return `export type ProjectCategory = 'Full Stack' | 'AI & Vision' | 'Robotics / IoT' | 'Mobile';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  tags: string[];
  image: string;
  liveUrl: string;
  githubUrl?: string;
  featured: boolean;
  metrics: string;
  features: string[];
  techStack: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  badge: string;
  skillsCovered: string[];
  imageUrl?: string;
  pdfUrl?: string;
}

export interface SkillItem {
  name: string;
  level: number;
  iconName?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  description: string;
  highlights: string[];
  type: 'education' | 'leadership' | 'experience';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
  features: string[];
}

export interface PersonalInfo {
  name: string;
  handle: string;
  titles: string[];
  bio: string;
  longBio: string;
  education: string;
  location: string;
  email: string;
  socials: {
    instagram: string;
    github: string;
    linkedin: string;
  };
  resumeUrl: string;
  avatarUrl: string;
  livePortfolioUrl: string;
  stats: { label: string; value: string }[];
}

export interface PortfolioData {
  personal: PersonalInfo;
  projects: Project[];
  certificates: Certificate[];
  skills: SkillCategory[];
  services: ServiceItem[];
  timeline: TimelineItem[];
}

export const initialPortfolioData: PortfolioData = ${JSON.stringify(dataToExport, null, 2)};
`;
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

  const handleCopyTSCode = () => {
    const tsCode = generateTSCode(formData);
    navigator.clipboard.writeText(tsCode);
    alert('✅ Portfolio TS Source Code copied to clipboard!\n\nTo make all your projects & certificates global for every visitor online:\n1. Replace content in src/data/portfolioData.ts with copied code\n2. Git push to deploy live!');
  };

  const handleDownloadTSFile = () => {
    const tsCode = generateTSCode(formData);
    const blob = new Blob([tsCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolioData.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✅ portfolioData.ts downloaded!\n\nReplace src/data/portfolioData.ts with this file and git push to update your website globally for everyone!');
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
                onClick={handleClose}
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

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2"
              title="Export Portfolio Backup JSON file"
            >
              <Download className="w-4 h-4 text-teal-400" />
              Export JSON
            </button>

            <button
              onClick={handleDownloadTSFile}
              className="px-4 py-2.5 rounded-xl bg-crimson-500/20 hover:bg-crimson-500/30 border border-crimson-500/40 text-xs font-semibold text-crimson-300 hover:text-white flex items-center gap-2"
              title="Download portfolioData.ts file to save directly in src/data/ for Vercel deployment"
            >
              <Download className="w-4 h-4 text-crimson-400" />
              Download portfolioData.ts
            </button>

            <button
              onClick={handleCopyTSCode}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2"
              title="Copy portfolio TS source code to clipboard"
            >
              <Copy className="w-4 h-4 text-teal-400" />
              Copy TS Code
            </button>

            <label
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer"
              title="Import Portfolio Backup JSON from another device"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              Import JSON
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleImportJSON}
              />
            </label>

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
            <Mail className="w-4 h-4" />
            Received Messages ({inboxMessages.length})
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'database'
                ? 'bg-crimson-500 text-white shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Cloud Database Sync
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

            {/* Drag & Drop Reorderable List of Projects */}
            <p className="text-xs font-code text-gray-400">
              💡 <span className="text-crimson-500 font-semibold">Drag and Drop</span> any project card using the grip handle <GripVertical className="w-3.5 h-3.5 inline text-crimson-500" /> to change its display order on the main portfolio page!
            </p>

            <Reorder.Group
              axis="y"
              values={formData.projects}
              onReorder={handleReorderProjects}
              className="space-y-4"
            >
              {formData.projects.map((proj, idx) => (
                <Reorder.Item
                  key={proj.id}
                  value={proj}
                  className="p-5 rounded-xl glass-card border border-white/10 hover:border-crimson-500/50 flex flex-col justify-between gap-3 relative group bg-[#120708]/90 cursor-grab active:cursor-grabbing select-none"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 group-hover:text-crimson-500 transition-colors">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[10px] font-code font-bold">
                            #{idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-crimson-500/20 text-crimson-500 text-[10px] font-code font-bold">
                            {proj.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-code text-gray-400">⚡ {proj.metrics}</span>
                    </div>

                    <h4 className="font-bebas text-2xl text-white mt-2 pl-10">{proj.title}</h4>
                    <p className="text-gray-300 text-xs line-clamp-2 pl-10 mt-1">{proj.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 pl-10">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveProject(idx, 'up'); }}
                        disabled={idx === 0}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border-white/10 hover:bg-crimson-500/20 hover:border-crimson-500/50 text-gray-300 hover:text-white'
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Up</span>
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveProject(idx, 'down'); }}
                        disabled={idx === formData.projects.length - 1}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                          idx === formData.projects.length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border-white/10 hover:bg-crimson-500/20 hover:border-crimson-500/50 text-gray-300 hover:text-white'
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Down</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(proj);
                          setIsAddingProject(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj.id); }}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
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
            <p className="text-xs font-code text-gray-400">
              💡 <span className="text-crimson-500 font-semibold">Drag and Drop</span> any certificate using the grip handle <GripVertical className="w-3.5 h-3.5 inline text-crimson-500" /> to change its order!
            </p>

            <Reorder.Group
              axis="y"
              values={formData.certificates || []}
              onReorder={handleReorderCertificates}
              className="space-y-4"
            >
              {(formData.certificates || []).map((cert, idx) => (
                <Reorder.Item
                  key={cert.id}
                  value={cert}
                  className="p-4 rounded-xl glass-card border border-white/10 flex flex-col justify-between gap-3 bg-[#120708]/90 cursor-grab active:cursor-grabbing select-none"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 group-hover:text-crimson-500 transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[10px] font-code font-bold">
                            #{idx + 1}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-crimson-500/20 text-crimson-500 text-[10px] font-code font-bold">
                            {cert.badge}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-code text-gray-400">{cert.date}</span>
                    </div>

                    <h4 className="font-bebas text-xl text-white leading-tight pl-9">{cert.title}</h4>
                    <p className="text-crimson-500 text-xs font-semibold pl-9">{cert.issuer}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 pl-9">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveCertificate(idx, 'up'); }}
                        disabled={idx === 0}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                          idx === 0
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border-white/10 hover:bg-crimson-500/20 hover:border-crimson-500/50 text-gray-300 hover:text-white'
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Up</span>
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleMoveCertificate(idx, 'down'); }}
                        disabled={idx === (formData.certificates || []).length - 1}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                          idx === (formData.certificates || []).length - 1
                            ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border-white/10 hover:bg-crimson-500/20 hover:border-crimson-500/50 text-gray-300 hover:text-white'
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Down</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCert(cert);
                          setIsAddingCert(false);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCertificate(cert.id); }}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
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
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleDeleteSingleMessage(msg.id)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>

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

        {/* TAB 7: CLOUD DATABASE PERSISTENCE */}
        {activeTab === 'database' && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 rounded-2xl glass-card-crimson border border-crimson-500/30 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bebas text-3xl text-white tracking-wide flex items-center gap-3">
                    <Database className="w-7 h-7 text-crimson-500" />
                    PERSISTENT CLOUD DATABASE CONFIGURATION
                  </h3>
                  <p className="text-xs font-code text-gray-400 mt-1">
                    // Sync your Spidey Admin portfolio changes to Firebase Firestore so updates persist across builds, deployments & devices.
                  </p>
                </div>

                {dbConfig.projectId ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-code font-bold flex items-center gap-1.5">
                    <CloudCheck className="w-4 h-4" />
                    CONNECTED: {dbConfig.projectId}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-code font-bold">
                    ⚡ CACHE FALLBACK (LOCALSTORAGE)
                  </span>
                )}
              </div>

              {dbStatusMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-xs font-semibold text-center border ${
                    dbStatusMsg.success === true
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : dbStatusMsg.success === false
                      ? 'bg-red-950/60 border-red-500/50 text-red-300'
                      : 'bg-crimson-500/20 border-crimson-500/40 text-crimson-300'
                  }`}
                >
                  {dbStatusMsg.text}
                </motion.div>
              )}

              {/* Manual Sync Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                  <h4 className="font-bebas text-xl text-white flex items-center gap-2">
                    <CloudUpload className="w-5 h-5 text-crimson-500" />
                    Push Data to Cloud Database
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Immediately sync all current portfolio state (ordered projects, certificates, profile bio, skills) to your Firebase Firestore cloud database.
                  </p>
                  <button
                    onClick={handleForceDBSync}
                    disabled={isSyncingDB}
                    className="w-full py-2.5 rounded-xl bg-crimson-500 hover:bg-crimson-600 font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <CloudUpload className="w-4 h-4" />
                    {isSyncingDB ? 'Syncing...' : 'Sync Current Data to Database'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                  <h4 className="font-bebas text-xl text-white flex items-center gap-2">
                    <CloudDownload className="w-5 h-5 text-teal-400" />
                    Fetch Data from Cloud Database
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Pull the latest saved portfolio document from your cloud database into Spidey Admin and main page.
                  </p>
                  <button
                    onClick={handleForceDBFetch}
                    disabled={isSyncingDB}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 font-semibold text-xs text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <CloudDownload className="w-4 h-4" />
                    {isSyncingDB ? 'Fetching...' : 'Fetch Latest Cloud Data'}
                  </button>
                </div>
              </div>

              {/* Credentials Config Form */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <h4 className="font-bebas text-2xl text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-crimson-500" />
                  Firebase Project Credentials (Optional Custom Config)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-code text-gray-400">Firebase Project ID</label>
                    <input
                      type="text"
                      placeholder="e.g. abhay-portfolio-db"
                      value={dbConfig.projectId || ''}
                      onChange={(e) => setDbConfig({ ...dbConfig, projectId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-code text-gray-400">Firebase API Key (Optional)</label>
                    <input
                      type="text"
                      placeholder="AIzaSy..."
                      value={dbConfig.apiKey || ''}
                      onChange={(e) => setDbConfig({ ...dbConfig, apiKey: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 focus:border-crimson-500 focus:outline-none text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveDBConfig}
                    className="px-5 py-2.5 rounded-xl bg-crimson-500 hover:bg-crimson-600 text-xs font-semibold text-white flex items-center gap-2 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Save Firebase Settings
                  </button>

                  <button
                    onClick={handleTestDBConnection}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
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
                  <label className="text-xs font-code text-gray-400">Subtitle / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Real-Time Vision & Robotics Platform"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <label className="text-xs font-code text-gray-400">Metrics Tag (e.g. 60 FPS, 99.9% Uptime)</label>
                    <input
                      type="text"
                      placeholder="60 FPS"
                      value={editingProject.metrics || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Short Summary (Grid Display)</label>
                  <textarea
                    rows={2}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Detailed Architecture Overview (Modal Deep Dive)</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive explanation of system architecture, pipelines, and performance..."
                    value={editingProject.longDescription || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-code text-gray-400">Card Hashtags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, Python, OpenCV"
                      value={
                        Array.isArray(editingProject.tags)
                          ? editingProject.tags.join(', ')
                          : editingProject.tags || ''
                      }
                      onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-code text-gray-400">Tech Stack Pills (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Next.js, PyTorch, WebGL"
                      value={
                        Array.isArray(editingProject.techStack)
                          ? editingProject.techStack.join(', ')
                          : editingProject.techStack || ''
                      }
                      onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-code text-gray-400">Key Features / Highlights (One per line or comma-separated)</label>
                  <textarea
                    rows={2}
                    placeholder="Real-time multi-threading\nLow latency WebGL canvas rendering"
                    value={
                      Array.isArray(editingProject.features)
                        ? editingProject.features.join('\n')
                        : editingProject.features || ''
                    }
                    onChange={(e) => setEditingProject({ ...editingProject, features: e.target.value as any })}
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

                {/* Certificate Image or PDF Document Upload & Live Preview */}
                <div>
                  <label className="text-xs font-code text-gray-400 flex items-center justify-between mb-1">
                    <span>Certificate Image / PDF Document Upload or Link</span>
                    <span className="text-[10px] text-crimson-400">PDF, PNG, JPG, WebP supported</span>
                  </label>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste PDF link, Image URL or click Upload File..."
                        value={editingCert.imageUrl || editingCert.pdfUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isPdf = val.toLowerCase().includes('.pdf') || val.startsWith('data:application/pdf');
                          setEditingCert({
                            ...editingCert,
                            imageUrl: val,
                            pdfUrl: isPdf ? val : editingCert.pdfUrl
                          });
                        }}
                        className="flex-1 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white"
                      />
                      <label className="px-4 py-2 rounded-xl bg-crimson-500 hover:bg-crimson-600 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*,.pdf,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const resultStr = reader.result as string;
                                const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
                                setEditingCert({
                                  ...editingCert,
                                  imageUrl: resultStr,
                                  pdfUrl: isPdf ? resultStr : editingCert.pdfUrl
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Live Preview Thumbnail */}
                    {(editingCert.imageUrl || editingCert.pdfUrl) && (
                      <div className="w-full h-36 bg-black/80 rounded-xl border border-crimson-500/40 overflow-hidden flex flex-col items-center justify-center p-3 text-center relative">
                        {editingCert.pdfUrl || (editingCert.imageUrl && editingCert.imageUrl.toLowerCase().includes('.pdf')) || editingCert.imageUrl?.startsWith('data:application/pdf') ? (
                          <div className="space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-500 flex items-center justify-center mx-auto">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-code text-crimson-400 font-bold block">
                              📄 VERIFIED PDF DOCUMENT LOADED
                            </span>
                          </div>
                        ) : (
                          <img
                            src={editingCert.imageUrl}
                            alt="Certificate Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
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
