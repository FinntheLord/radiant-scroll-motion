
import { useState, useEffect } from 'react';

interface PerformanceMode {
  isLowPowerMode: boolean;
  isMobile: boolean;
  shouldReduceAnimations: boolean;
}

export const usePerformanceMode = (): PerformanceMode => {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>({
    isLowPowerMode: false,
    isMobile: false,
    shouldReduceAnimations: false
  });

  useEffect(() => {
    const checkPerformanceMode = () => {
      const isMobile = window.innerWidth <= 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isLowPowerMode = navigator.hardwareConcurrency <= 2 || isMobile;
      
      setPerformanceMode({
        isLowPowerMode,
        isMobile,
        shouldReduceAnimations: prefersReducedMotion || isLowPowerMode
      });
    };

    checkPerformanceMode();
    
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    mediaQuery.addEventListener('change', checkPerformanceMode);
    motionQuery.addEventListener('change', checkPerformanceMode);
    
    return () => {
      mediaQuery.removeEventListener('change', checkPerformanceMode);
      motionQuery.removeEventListener('change', checkPerformanceMode);
    };
  }, []);

  return performanceMode;
};
