
import React, { useEffect } from "react";

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    // Enhanced reveal animation with different timing for elements
    const handleReveal = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add('revealed');
          
          // Find all children with delay-* classes and animate them sequentially
          const delayedElements = element.querySelectorAll('[class*="delay-"]');
          delayedElements.forEach((delayedEl: Element, index: number) => {
            setTimeout(() => {
              delayedEl.classList.add('revealed');
            }, 150 * (index + 1));
          });
        }
      });
    };

    // Floating animation for background elements
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

    // Service item stagger animation
    const animateServiceItems = () => {
      const serviceItems = document.querySelectorAll('#services .card-hover');
      serviceItems.forEach((item, index) => {
        (item as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
      });
    };

    window.addEventListener('scroll', handleReveal);
    handleReveal(); // Trigger on initial load
    animateFloatingElements(); // Start floating animations
    animateServiceItems(); // Stagger service items animation
    
    return () => {
      window.removeEventListener('scroll', handleReveal);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollAnimation;
