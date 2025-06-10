
import React, { useEffect, useRef } from "react";
import { usePerformanceMode } from "../hooks/usePerformanceMode";

const ScrollAnimation: React.FC = () => {
  const isInitialized = useRef(false);
  const { shouldReduceAnimations, isMobile } = usePerformanceMode();

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    let ticking = false;
    
    // Функция reveal с дебаунсингом
    const handleReveal = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const elements = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');
          const windowHeight = window.innerHeight;
          
          elements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 50) {
              element.classList.add('revealed');
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Анимация floating элементов - только для десктопа и при хорошей производительности
    if (!isMobile && !shouldReduceAnimations) {
      const animateFloatingElements = () => {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
          const delay = index * 1000;
          
          setTimeout(() => {
            element.animate(
              [
                { transform: 'translateY(0px)' },
                { transform: 'translateY(-10px)' },
                { transform: 'translateY(0px)' }
              ],
              {
                duration: 6000,
                iterations: Infinity,
                easing: 'ease-in-out'
              }
            );
          }, delay);
        });
      };
      
      animateFloatingElements();
    }

    // Оптимизированная обработка вкладок
    const setupTabContentVisibility = () => {
      const tabContents = document.querySelectorAll('.services-tab-content');
      
      const observer = new MutationObserver((mutations) => {
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
      
      tabContents.forEach(tab => {
        if ((tab as Element).getAttribute('data-state') === 'active') {
          (tab as Element).classList.add('tab-visible');
        }
        observer.observe(tab, { attributes: true });
      });
    };
    
    // Пассивный слушатель скролла
    window.addEventListener('scroll', handleReveal, { passive: true });
    
    // Инициализация
    handleReveal();
    setupTabContentVisibility();
    
    return () => {
      window.removeEventListener('scroll', handleReveal);
    };
  }, [shouldReduceAnimations, isMobile]);

  return null;
};

export default ScrollAnimation;
