import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { ArrowUp } from 'lucide-react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Global Scroll Manager:
 * 1. Synchronizes route changes and hash navigation
 * 2. Drives a sleek progress indicator at the top of the viewport
 * 3. Shows an elegant Back-to-Top floating button
 */
function ScrollManager() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const lenis = useLenis((lenisInstance) => {
    const currentProgress = lenisInstance.progress;
    setProgress(currentProgress);
    // Show back-to-top button after 18% scroll or > 250px
    setShowTopBtn(lenisInstance.scroll > 250);
  });

  // Handle route changes and anchor hashes seamlessly
  useEffect(() => {
    if (!lenis) return;

    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        lenis.scrollTo(location.hash, {
          offset: -80,
          duration: 1.2,
        });
        return;
      }
    }

    // Reset scroll to top instantly on new route page visit
    lenis.scrollTo(0, { immediate: true });
  }, [location.pathname, location.hash, lenis]);

  const handleScrollToTop = () => {
    lenis?.scrollTo(0, {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  return (
    <>
      {/* Sleek Top Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none transition-opacity duration-300"
        style={{ opacity: progress > 0.01 ? 1 : 0 }}
      >
        <div
          className="h-full bg-gradient-to-r from-[#6b38d4] via-[#8b5cf6] to-[#d946ef] shadow-[0_0_8px_rgba(107,56,212,0.6)] transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Floating Smooth Scroll-to-Top Action Pill */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
          showTopBtn
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={handleScrollToTop}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#e5e1ea] text-[#0a0a0f] text-xs font-semibold shadow-[0_8px_24px_rgba(107,56,212,0.14)] hover:shadow-[0_12px_28px_rgba(107,56,212,0.22)] hover:border-[#8b5cf6]/40 hover:bg-[#faf9fe] active:scale-95 transition-all cursor-pointer group"
          aria-label="Scroll back to top"
          title="Scroll smoothly back to top"
        >
          <div className="w-5 h-5 rounded-full bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
            <ArrowUp size={12} strokeWidth={2.5} />
          </div>
          <span className="hidden sm:inline text-[#5e5e6e] group-hover:text-[#0a0a0f]">
            Top
          </span>
          <span className="font-mono text-[10px] text-[#8e8ea0] pl-1 border-l border-[#e5e1ea]">
            {Math.round(progress * 100)}%
          </span>
        </button>
      </div>
    </>
  );
}

/**
 * Root SmoothScroll Provider component utilizing Lenis
 */
export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        anchors: true,
        autoToggle: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      }}
    >
      <ScrollManager />
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
