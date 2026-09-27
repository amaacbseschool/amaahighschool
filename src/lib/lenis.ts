// Smooth Scroll Manager powered by Lenis
import Lenis from 'lenis';
import { checkPrefersReducedMotion } from './motion';

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

export const initLenis = (): Lenis | null => {
  if (typeof window === 'undefined') return null;

  // Respect prefers-reduced-motion: if enabled, skip smooth momentum
  if (checkPrefersReducedMotion()) {
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // signature exponential ease out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.2,
    wheelMultiplier: 0.95,
  });

  const raf = (time: number) => {
    lenisInstance?.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);

  return lenisInstance;
};

export const getLenis = (): Lenis | null => lenisInstance;

export const destroyLenis = (): void => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

export const scrollToElement = (
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
): void => {
  if (checkPrefersReducedMotion()) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView();
    }
    return;
  }

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: options?.offset ?? -80,
      duration: options?.duration ?? 1.2,
      immediate: options?.immediate ?? false,
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
