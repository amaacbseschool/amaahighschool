import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { checkPrefersReducedMotion } from '../../lib/motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatNumber?: boolean;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.6,
  prefix = '',
  suffix = '',
  className = '',
  formatNumber = true,
}) => {
  const isReduced = checkPrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(() => (isReduced ? value : 0));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (isReduced) {
      return;
    }

    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Apple easeOutExpo for count up
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (value - start) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [isInView, value, duration, isReduced]);

  const formatted = formatNumber
    ? displayValue.toLocaleString()
    : displayValue.toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
