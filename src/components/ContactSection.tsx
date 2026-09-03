import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Mail, MapPin, Send, Sparkles, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import type { PersonalInfo } from '../data/portfolioData';

import { saveAdminMessageToDB } from '../services/db';

interface ContactSectionProps {
  data: PersonalInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);

    // 1. Particle Confetti Celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ff1e2d', '#ffffff', '#b30915']
    });

    // 2. Save Message EXCLUSIVELY to Spidey Admin Section (LocalStorage + IndexedDB + Cloud Firestore)
    try {
      await saveAdminMessageToDB({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
    } catch (err) {
      console.error('Error saving message to Spidey Admin inbox:', err);
    }

    setIsSending(false);
    setSubmitted(true);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-code uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Get In Touch
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide">
          LET'S BUILD SOMETHING <span className="text-crimson-500 text-glow">EXTRAORDINARY</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Whether you want to hire me for full-stack Next.js projects, AI computer vision models, Flutter apps, or robotics workshops — my inbox is always open.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-2xl glass-card-crimson bg-[#16080a]/40 backdrop-blur-md border border-crimson-500/30 space-y-6">
            <h3 className="font-bebas text-3xl text-white tracking-wide">
              DIRECT CONTACT
            </h3>

            {/* Email Box with Copy */}
            <div className="p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 rounded-lg bg-crimson-500/20 text-crimson-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-code text-gray-400">EMAIL ADDRESS</div>
                  <div className="text-sm font-semibold text-white truncate">{data.email}</div>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg bg-white/5 hover:bg-crimson-500/20 text-gray-300 hover:text-crimson-500 transition-colors shrink-0"
                title="Copy Email"
              >
                {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Location Box */}
            <div className="p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-crimson-500/20 text-crimson-500 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-code text-gray-400">LOCATION & BASE</div>
                <div className="text-sm font-semibold text-white">{data.location}</div>
              </div>
            </div>

            {/* Social Profiles Grid */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="text-xs font-code text-gray-400 uppercase">SOCIAL NETWORKS</div>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={data.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-crimson-500/20 border border-white/10 hover:border-crimson-500/40 text-gray-300 hover:text-white transition-all flex flex-col items-center gap-1.5 text-center"
                >
                  <svg className="w-5 h-5 fill-current text-crimson-500" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-[10px] font-medium">Instagram</span>
                </a>

                <a
                  href={data.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-crimson-500/20 border border-white/10 hover:border-crimson-500/40 text-gray-300 hover:text-white transition-all flex flex-col items-center gap-1.5 text-center"
                >
                  <svg className="w-5 h-5 fill-current text-crimson-500" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span className="text-[10px] font-medium">GitHub</span>
                </a>

                <a
                  href={data.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-crimson-500/20 border border-white/10 hover:border-crimson-500/40 text-gray-300 hover:text-white transition-all flex flex-col items-center gap-1.5 text-center"
                >
                  <svg className="w-5 h-5 fill-current text-crimson-500" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="text-[10px] font-medium">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-2xl glass-card bg-[#120708]/40 backdrop-blur-md border border-white/10 space-y-5 relative overflow-hidden"
          >
            <h3 className="font-bebas text-3xl text-white tracking-wide">
              SEND A MESSAGE
            </h3>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-crimson-500/15 border border-crimson-500/50 text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-crimson-500/20 border border-crimson-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,30,45,0.5)]">
                  <CheckCircle2 className="w-7 h-7 text-crimson-500 animate-pulse" />
                </div>

                <div>
                  <h4 className="font-bebas text-3xl text-white tracking-wide">
                    MESSAGE TRANSMITTED TO SPIDEY ADMIN!
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm font-outfit mt-1 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name}</strong>! Your message has been delivered directly to <span className="text-crimson-400 font-semibold font-code">Spidey Admin Console</span>. Abhay will review your message shortly.
                  </p>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-xl bg-crimson-500 hover:bg-crimson-600 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-code text-gray-400">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 focus:border-crimson-500 focus:shadow-[0_0_15px_rgba(255,30,45,0.3)] focus:outline-none text-sm text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-code text-gray-400">YOUR EMAIL</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 focus:border-crimson-500 focus:shadow-[0_0_15px_rgba(255,30,45,0.3)] focus:outline-none text-sm text-white placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-code text-gray-400">PROJECT DETAILED MESSAGE</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project, timeline, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 focus:border-crimson-500 focus:shadow-[0_0_15px_rgba(255,30,45,0.3)] focus:outline-none text-sm text-white placeholder-gray-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-crimson-600 via-crimson-500 to-red-700 hover:from-crimson-500 hover:to-crimson-600 shadow-[0_0_25px_rgba(255,30,45,0.5)] border border-crimson-500/50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Message to Abhay Gupta</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

      </div>
    </section>
  );
};
