
import React, { useEffect } from "react";

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    let isScrolling = false;
    let scrollFrameRequest: number;
    
    // Optimized reveal animation with throttling
    const handleReveal = () => {
      if (!isScrolling) {
        isScrolling = true;
        
        // Use requestAnimationFrame for better performance
        scrollFrameRequest = requestAnimationFrame(() => {
          const elements = document.querySelectorAll('.reveal-on-scroll');
          
          elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 50) {
              element.classList.add('revealed');
              
              // Find all children with delay-* classes and animate them sequentially
              const delayedElements = element.querySelectorAll('[class*="delay-"]');
              if (delayedElements.length > 0) {
                delayedElements.forEach((delayedEl, index) => {
                  setTimeout(() => {
                    delayedEl.classList.add('revealed');
                  }, 100 * (index + 1));
                });
              }
            }
          });
          
          isScrolling = false;
        });
      }
    };

    // Optimized floating animation with fewer elements
    const animateFloatingElements = () => {
      const floatingElements = document.querySelectorAll('.floating');
      
      if (floatingElements.length > 0) {
        floatingElements.forEach((element) => {
          const randomX = Math.random() * 6 - 3; // Reduced movement range
          const randomY = Math.random() * 6 - 3; // Reduced movement range
          
          element.animate(
            [
              { transform: 'translate(0px, 0px)' },
              { transform: `translate(${randomX}px, ${randomY}px)` },
              { transform: 'translate(0px, 0px)' }
            ],
            {
              duration: 6000 + Math.random() * 2000, // Reduced animation duration
              iterations: Infinity,
              easing: 'ease-in-out'
            }
          );
        });
      }
    };

    // Optimized tab content visibility
    const setupTabContentVisibility = () => {
      const tabContents = document.querySelectorAll('.services-tab-content');
      
      if (tabContents.length === 0) return;
      
      // Set up a single observer for all tabs
      const tabsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-state') {
            const target = mutation.target as Element;
            const isActive = target.getAttribute('data-state') === 'active';
            
            if (isActive) {
              target.classList.add('tab-visible');
            } else {
              target.classList.remove('tab-visible');
            }
          }
        });
      });
      
      // Observe all tabs at once
      tabContents.forEach(tab => {
        // Set initial visibility
        if ((tab as Element).getAttribute('data-state') === 'active') {
          (tab as Element).classList.add('tab-visible');
        }
        
        tabsObserver.observe(tab, { attributes: true });
      });
    };
    
    // Add scroll event with passive option for better performance
    window.addEventListener('scroll', handleReveal, { passive: true });
    
    // Execute these functions only once with a delay
    handleReveal();
    
    // Use a small timeout to prioritize initial rendering
    const initTimeout = setTimeout(() => {
      animateFloatingElements();
      setupTabContentVisibility();
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleReveal);
      cancelAnimationFrame(scrollFrameRequest);
      clearTimeout(initTimeout);
    };
  }, []);

  return null;
};

export default ScrollAnimation;
