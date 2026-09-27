// Motion tokens and animation configuration for AMAA High School
// Apple x Linear signature easing curves & responsive timing

export const EASINGS = {
  // Apple / Linear signature ease-out expo: crisp, responsive, natural
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutExpo: [0.87, 0, 0.13, 1] as const,
  easeOutBack: [0.34, 1.56, 0.64, 1] as const,
  smoothSpring: { type: 'spring', stiffness: 260, damping: 24 } as const,
  gentleSpring: { type: 'spring', stiffness: 180, damping: 20 } as const,
};

export const DURATIONS = {
  fast: 0.22,
  medium: 0.45,
  cinematic: 0.85,
  long: 1.2,
};

export const checkPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Common Framer Motion variants
export const fadeInVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.medium,
      ease: EASINGS.easeOutExpo,
      delay: customDelay,
    },
  }),
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASINGS.easeOutExpo,
      delay: customDelay,
    },
  }),
};

export const slideLeftVariants = {
  hidden: { opacity: 0, x: 45 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: EASINGS.easeOutExpo,
      delay: customDelay,
    },
  }),
};

export const slideRightVariants = {
  hidden: { opacity: 0, x: -45 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: EASINGS.easeOutExpo,
      delay: customDelay,
    },
  }),
};

export const tabSlideVariants = {
  initial: (dir: number = 1) => ({
    opacity: 0,
    x: dir * 35,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.38,
      ease: EASINGS.easeOutExpo,
    },
  },
  exit: (dir: number = 1) => ({
    opacity: 0,
    x: dir * -35,
    transition: {
      duration: 0.25,
      ease: EASINGS.easeOutExpo,
    },
  }),
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASINGS.easeOutExpo,
    },
  },
};

