import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, X, ShieldCheck, Sparkles, FileText, FileCheck, Eye, ChevronLeft, ChevronRight, Layers, Camera } from 'lucide-react';
import type { Certificate } from '../data/portfolioData';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (!certificates || certificates.length === 0) return null;

  const isPdfCert = (cert: Certificate) => {
    if (failedImages[cert.id]) return true;
    const url = (cert.imageUrl || cert.credentialUrl || cert.pdfUrl || '').toLowerCase();
    return url.includes('.pdf') || url.startsWith('data:application/pdf') || !!cert.pdfUrl;
  };

  const handleOpenCert = (cert: Certificate) => {
    setSelectedCert(cert);
    setActiveSlideIndex(0);
  };

  return (
    <section id="certificates" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Centered Section Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-crimson-500/10 border border-crimson-500/30 text-crimson-500 text-xs font-code uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Verified Credentials & Accreditations
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide">
          AWARDS & <span className="text-crimson-500 text-glow">CERTIFICATIONS ({certificates.length})</span>
        </h2>
      </div>

      {/* 4-Column Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {certificates.map((cert, idx) => {
          const isPdf = isPdfCert(cert);
          const hasMultipleSlides = cert.images && cert.images.length > 1;
          const displayImage = (cert.images && cert.images[0]) || cert.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => handleOpenCert(cert)}
              className="group relative p-4 rounded-2xl bg-[#120708]/90 border border-white/10 hover:border-crimson-500/50 hover:shadow-[0_10px_30px_rgba(255,30,45,0.25)] transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
            >
              {/* Top Red Glow Hover Line */}
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-crimson-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Thumbnail Image Container */}
                <div className="w-full h-44 bg-black/80 rounded-xl overflow-hidden mb-3.5 border border-white/10 flex items-center justify-center relative group-hover:border-crimson-500/40 transition-all">
                  {/* Multi-Slide Badge */}
                  {hasMultipleSlides && (
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-crimson-500/90 text-white text-[9px] font-code font-bold flex items-center gap-1 shadow-md">
                      <Layers className="w-3 h-3" />
                      <span>{cert.images?.length} SLIDES (PHOTO + DOC)</span>
                    </div>
                  )}

                  {isPdf ? (
                    <div className="w-full h-full p-4 bg-gradient-to-br from-crimson-950/60 via-black to-[#1a0507] flex flex-col justify-between items-center text-center relative">
                      <div className="w-full flex items-center justify-between z-10">
                        <span className="px-2 py-0.5 rounded-full bg-crimson-500/20 border border-crimson-500/40 text-[9px] font-code font-bold text-crimson-400 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-crimson-500" />
                          PDF DOCUMENT
                        </span>
                        <span className="text-[9px] font-code text-gray-400">{cert.date}</span>
                      </div>

                      <div className="my-auto space-y-1.5 z-10">
                        <div className="w-10 h-10 rounded-xl bg-crimson-500/20 border border-crimson-500/40 text-crimson-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bebas text-sm text-white tracking-wide truncate max-w-[180px] mx-auto">{cert.title}</h4>
                      </div>

                      <div className="w-full pt-1.5 border-t border-white/10 text-[9px] font-code text-crimson-400 font-semibold z-10 flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>OPEN PDF CERTIFICATE</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={displayImage}
                        alt={cert.title}
                        onError={() => setFailedImages((prev) => ({ ...prev, [cert.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                      
                      {/* View Zoom Badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/80 border border-crimson-500/40 text-[9px] font-code text-crimson-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                        <Award className="w-3 h-3 text-crimson-500" />
                        <span>VIEW CERTIFICATE</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Certificate Title */}
                <h3 className="font-bebas text-lg tracking-wide text-white font-bold uppercase group-hover:text-crimson-500 transition-colors line-clamp-2 leading-snug mb-1">
                  {cert.title}
                </h3>

                {/* Issuer & Date */}
                <div className="text-[11px] font-code text-crimson-500 font-bold tracking-wider mb-2">
                  {cert.issuer} • {cert.date}
                </div>
              </div>

              {/* Bottom Category Badge */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-code text-gray-400 font-medium tracking-wide truncate">
                  {cert.badge}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-crimson-500 transition-colors shrink-0" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Certificate High-Res / PDF Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-[#120708] border border-crimson-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,30,45,0.4)] overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-crimson-500 text-white transition-colors z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 text-crimson-500 text-xs font-code font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>VERIFIED CREDENTIAL</span>
              </div>

              <h3 className="font-bebas text-3xl text-white tracking-wide uppercase mb-1">
                {selectedCert.title}
              </h3>
              <p className="text-crimson-500 text-xs font-code font-bold mb-4">
                {selectedCert.issuer} — {selectedCert.date}
              </p>

              {/* Modal Viewer: PDF or Image Carousel */}
              {isPdfCert(selectedCert) ? (
                <div className="w-full h-72 sm:h-96 bg-black/90 rounded-xl overflow-hidden mb-5 border border-crimson-500/40 p-6 flex flex-col items-center justify-center text-center space-y-4 relative">
                  <div className="w-16 h-16 rounded-2xl bg-crimson-500/20 border border-crimson-500/50 text-crimson-500 flex items-center justify-center shadow-[0_0_30px_rgba(255,30,45,0.3)]">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bebas text-2xl text-white">OFFICIAL VERIFIED PDF CERTIFICATE</h4>
                    <p className="text-xs text-gray-400 font-code mt-1">
                      {selectedCert.issuer} • {selectedCert.badge}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={selectedCert.pdfUrl || selectedCert.imageUrl || selectedCert.credentialUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 rounded-full bg-crimson-500 hover:bg-crimson-600 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,30,45,0.5)] transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Open Full PDF Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-5">
                  <div className="relative w-full h-64 sm:h-96 bg-black/90 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group">
                    <img
                      src={
                        (selectedCert.images && selectedCert.images[activeSlideIndex]) ||
                        selectedCert.imageUrl ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={`${selectedCert.title} - Slide ${activeSlideIndex + 1}`}
                      className="w-full h-full object-contain"
                    />

                    {/* Prev / Next Slide Arrows if multiple images */}
                    {selectedCert.images && selectedCert.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlideIndex((prev) =>
                              prev === 0 ? selectedCert.images!.length - 1 : prev - 1
                            );
                          }}
                          className="absolute left-3 p-2 rounded-full bg-black/70 hover:bg-crimson-500 text-white border border-white/20 transition-all z-20"
                          title="Previous Slide"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveSlideIndex((prev) =>
                              prev === selectedCert.images!.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-3 p-2 rounded-full bg-black/70 hover:bg-crimson-500 text-white border border-white/20 transition-all z-20"
                          title="Next Slide"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Slide Counter Overlay */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-crimson-500/40 text-xs font-code text-white font-bold z-20 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-crimson-500" />
                          <span>
                            Slide {activeSlideIndex + 1} of {selectedCert.images.length}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Multi-Slide Navigation Tabs */}
                  {selectedCert.images && selectedCert.images.length > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {selectedCert.images.map((_, sIdx) => {
                        const isCurrent = sIdx === activeSlideIndex;
                        const label = sIdx === 0 ? "Slide 1: Award Ceremony Photo" : "Slide 2: Certificate Document";
                        return (
                          <button
                            key={sIdx}
                            onClick={() => setActiveSlideIndex(sIdx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-code font-bold transition-all flex items-center gap-1.5 ${
                              isCurrent
                                ? 'bg-crimson-500 text-white border border-crimson-400 shadow-[0_0_15px_rgba(255,30,45,0.4)]'
                                : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-current inline-block" />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Skills covered */}
              <div className="space-y-3">
                <div className="text-xs font-code text-gray-400 font-semibold uppercase">Key Competencies & Technologies:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCert.skillsCovered.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded bg-crimson-500/10 border border-crimson-500/30 text-xs font-code text-crimson-400"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>

                {/* External Link */}
                {(selectedCert.credentialUrl || selectedCert.pdfUrl) && (
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <a
                      href={selectedCert.pdfUrl || selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-crimson-500 hover:bg-crimson-600 shadow-[0_0_20px_rgba(255,30,45,0.6)] flex items-center gap-2 uppercase tracking-wider transition-all"
                    >
                      <Award className="w-4 h-4" />
                      <span>Verify Official Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};


