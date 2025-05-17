
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TypewriterEffectSmoothDemo } from "@/components/TypewriterEffectSmoothDemo";

const HeroSection: React.FC = () => {
  useEffect(() => {
    // Add floating elements to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element floating';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.width = `${Math.random() * 150 + 50}px`;
        element.style.height = `${Math.random() * 150 + 50}px`;
        element.style.opacity = `${Math.random() * 0.15 + 0.05}`;
        heroSection.appendChild(element);
      }
    }

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const parallaxElements = document.querySelectorAll('.parallax');
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      parallaxElements.forEach((element: Element) => {
        const speed = parseFloat((element as HTMLElement).dataset.speed || '0.05');
        const x = (mouseX - windowWidth / 2) * speed;
        const y = (mouseY - windowHeight / 2) * speed;
        
        (element as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen pt-20 animated-bg-light flex items-center bg-white hero-section">
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-12 md:py-24">
          <div className="max-w-5xl mx-auto">
            {/* Replace the static heading with TypewriterEffectSmoothDemo */}
            <TypewriterEffectSmoothDemo />

            <div className="max-w-2xl reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
              <p className="text-gray-700 mb-8">
                Обеспечиваем бесперебойную работу
                <span className="connexi-gradient-text"> ИТ</span> - инфраструктуру с учетом лучших
                практик и подходов
              </p>
            </div>
          </div>

          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="reveal-on-scroll parallax" data-speed="0.03" style={{ animationDelay: "0.3s" }}>
              <div className="connexi-gradient-text mb-3">Аккредитованы в Минцифры</div>
            </div>
            <div className="text-right reveal-on-scroll parallax" data-speed="0.01" style={{ animationDelay: "0.4s" }}>
              <div className="text-gray-700 mb-3">Поставляем оборудование и ПО</div>
              <div className="text-gray-700">Строим частные облака под ключ</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <a href="#about" className="text-gray-600 opacity-60 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
