import React from 'react';
import { motion } from 'framer-motion';
import { checkPrefersReducedMotion } from '../../lib/motion';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  as: Component = 'span',
  delay = 0,
}) => {
  const isReduced = checkPrefersReducedMotion();

  if (isReduced) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={`inline-block ${className}`}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.span>
  );
};
