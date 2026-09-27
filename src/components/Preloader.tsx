import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

interface PreloaderProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDurationMs = 1800,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [minDurationMs, onComplete]);

  return (
    <motion.div
      key="school-preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white pointer-events-none"
    >
      <motion.img
        src={logoImg}
        alt="A.M.A. Adinarayana High School Logo"
        className="w-48 sm:w-60 md:w-68 max-h-64 object-contain select-none will-change-transform"
        initial={{ opacity: 0, scale: 0.93, y: 6 }}
        animate={{
          opacity: [0, 1, 1, 1],
          scale: [0.93, 1, 1.02, 1],
          y: [6, 0, -3, 0],
        }}
        exit={{
          opacity: 0,
          scale: 1.04,
          filter: 'blur(2px)',
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        }}
        transition={{
          duration: 1.8,
          times: [0, 0.3, 0.68, 1],
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};
