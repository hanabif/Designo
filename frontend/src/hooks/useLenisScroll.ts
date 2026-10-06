import { useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import type { ScrollToOptions } from 'lenis';

export { useLenis };
export type { Lenis, ScrollToOptions };

/**
 * Custom helper hook to trigger smooth programmatic scrolling from anywhere in the app
 */
export function useLenisScroll() {
  const lenis = useLenis();

  const scrollTo = (
    target: number | string | HTMLElement,
    options?: ScrollToOptions
  ) => {
    if (!lenis) {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    lenis.scrollTo(target, {
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    });
  };

  const scrollToTop = (options?: ScrollToOptions) => {
    scrollTo(0, options);
  };

  const stop = () => lenis?.stop();
  const start = () => lenis?.start();

  return {
    lenis,
    scrollTo,
    scrollToTop,
    stop,
    start,
  };
}
