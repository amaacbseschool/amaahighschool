import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { checkPrefersReducedMotion } from '../../lib/motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  strength?: number; // max offset in px
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  strength = 6,
  type = 'button',
  disabled = false,
  title,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isReduced = checkPrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isReduced || !buttonRef.current || disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = ((clientX - centerX) / (width / 2)) * strength;
    const deltaY = ((clientY - centerY) / (height / 2)) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      title={title}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={isReduced ? {} : { x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 20,
        mass: 0.5,
      }}
      whileTap={isReduced ? {} : { scale: 0.97 }}
      whileHover={isReduced ? {} : { scale: 1.02 }}
      className={`cursor-pointer transition-shadow ${className}`}
    >
      {children}
    </motion.button>
  );
};
