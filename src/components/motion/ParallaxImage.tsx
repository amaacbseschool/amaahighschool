import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { checkPrefersReducedMotion } from '../../lib/motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  speed?: number; // e.g. -20 to 20 px
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  speed = 15,
  aspectRatio = 'aspect-[16/10]',
  loading = 'lazy',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = checkPrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isReduced ? [0, 0] : [-speed, speed]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatio} ${containerClassName}`}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        style={{ y, scale: isReduced ? 1 : 1.08 }}
        className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${className}`}
      />
    </div>
  );
};
