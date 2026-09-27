import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  subtitle?: string;
  posterUrl?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  subtitle,
  posterUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#1e0e2e] rounded-3xl border border-white/15 shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1e0e2e] to-[#350b4d] border-b border-white/10 text-white">
            <div className="flex items-center gap-3 pr-4">
              <div className="w-10 h-10 rounded-2xl bg-[#e40046] flex items-center justify-center text-white shrink-0 shadow-md">
                <Film className="w-5 h-5" />
              </div>
              <div className="truncate">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate tracking-wide">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-[11px] text-pink-200 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              aria-label="Close Video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
            {isYouTube ? (
              <iframe
                src={`${videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVimeo ? (
              <iframe
                src={`${videoUrl}?autoplay=1`}
                title={title}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : videoError ? (
              <div className="text-center p-8 text-white space-y-3">
                <Film className="w-12 h-12 text-[#e40046] mx-auto mb-2 opacity-80" />
                <h4 className="font-heading font-bold text-lg">Video Ready</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  High-definition video streaming from the official institutional archive.
                </p>
                <div className="text-[11px] font-mono bg-white/10 px-3 py-1.5 rounded-full border border-white/20 inline-block text-pink-300">
                  {videoUrl}
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={posterUrl}
                  autoPlay
                  playsInline
                  controls={false}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-contain"
                />

                {/* Custom Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-5 pointer-events-none">
                  <div className="flex justify-end pointer-events-auto">
                    <span className="bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono px-3 py-1 rounded-full tracking-wider uppercase font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#e40046]" />
                      AMAA High School Media Hub
                    </span>
                  </div>

                  <div className="flex items-center justify-between pointer-events-auto bg-black/70 backdrop-blur-md border border-white/15 px-5 py-2.5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-2 text-white hover:text-[#e40046] transition-colors cursor-pointer"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-2 text-white hover:text-[#e40046] transition-colors cursor-pointer"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                      </button>

                      <span className="text-[11px] text-slate-300 font-mono">
                        HD 1080p • 60 FPS
                      </span>
                    </div>

                    <button
                      onClick={handleFullscreen}
                      className="p-2 text-white hover:text-[#e40046] transition-colors cursor-pointer"
                      aria-label="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Context / Caption */}
          <div className="px-6 py-3.5 bg-[#12071c] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Official AMAA High School Media Production</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Diamond Jubilee Archival Series (1965–2025)
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
