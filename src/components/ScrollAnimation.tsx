
import React, { useEffect } from "react";

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    const handleReveal = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', handleReveal);
    handleReveal(); // Trigger on initial load
    
    return () => {
      window.removeEventListener('scroll', handleReveal);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollAnimation;
