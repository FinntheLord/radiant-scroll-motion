
import React, { useEffect } from "react";

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    let isScrolling = false;
    
    // Optimized reveal animation with debouncing
    const handleReveal = () => {
      if (!isScrolling) {
        isScrolling = true;
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          const elements = document.querySelectorAll('.reveal-on-scroll');
          
          elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
              element.classList.add('revealed');
              
              // Find all children with delay-* classes and animate them sequentially
              const delayedElements = element.querySelectorAll('[class*="delay-"]');
              delayedElements.forEach((delayedEl, index) => {
                setTimeout(() => {
                  delayedEl.classList.add('revealed');
                }, 150 * (index + 1));
              });
            }
          });
          
          isScrolling = false;
        });
      }
    };

    // Simplified and optimized floating animation
    const animateFloatingElements = () => {
      const floatingElements = document.querySelectorAll('.floating');
      
      floatingElements.forEach((element) => {
        const randomX = Math.random() * 10 - 5;
        const randomY = Math.random() * 10 - 5;
        
        element.animate(
          [
            { transform: 'translate(0px, 0px)' },
            { transform: `translate(${randomX}px, ${randomY}px)` },
            { transform: 'translate(0px, 0px)' }
          ],
          {
            duration: 5000 + Math.random() * 3000,
            iterations: Infinity,
            easing: 'ease-in-out'
          }
        );
      });
    };

    // Optimized tab content visibility for better performance
    const setupTabContentVisibility = () => {
      // Simplified tab visibility logic
      const tabContents = document.querySelectorAll('.services-tab-content');
      
      // Set up a single observer for all tabs
      const tabsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-state') {
            // Cast target to Element to access getAttribute and classList
            const target = mutation.target as Element;
            const isActive = target.getAttribute('data-state') === 'active';
            
            // Apply the visibility class immediately when active
            if (isActive) {
              target.classList.add('tab-visible');
            } else {
              // Short delay for smooth transition out
              setTimeout(() => {
                // We need to re-check the attribute since it may have changed
                // Cast to Element again for type safety
                if ((target as Element).getAttribute('data-state') !== 'active') {
                  target.classList.remove('tab-visible');
                }
              }, 200); // Reduced timeout for faster transitions
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
    
    // Preload any needed assets for better performance
    const preloadAssets = () => {
      // Preload any images or other assets needed for the services section
      // Empty for now, can be expanded if specific assets need preloading
    };
    
    // Add scroll event with passive option for better performance
    window.addEventListener('scroll', handleReveal, { passive: true });
    
    // Call the initialization functions once
    handleReveal();
    animateFloatingElements();
    setupTabContentVisibility();
    preloadAssets();
    
    return () => {
      window.removeEventListener('scroll', handleReveal);
    };
  }, []);

  return null;
};

export default ScrollAnimation;
