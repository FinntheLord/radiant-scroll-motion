
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  useEffect(() => {
    const handleReveal = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 150) {
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

  return (
    <section className="relative min-h-screen pt-20 animated-bg flex items-center bg-dark">
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-12 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-gray-400 mb-6 reveal-on-scroll">
              ПРОЕКТИРУЕМ
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white reveal-on-scroll" style={{ animationDelay: "0.1s" }}>
              <span className="text-gray-200"># СИСТЕМНЫЕ </span>
              <br />
              <span className="orange-highlight">ИТ</span>
              <span className="text-gray-200"> — РЕШЕНИЯ</span>
            </h1>

            <div className="max-w-2xl reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
              <p className="text-gray-300 mb-8">
                Обеспечиваем бесперебойную работу
                <span className="orange-highlight"> ИТ</span> - инфраструктуру с учетом лучших
                практик и подходов
              </p>

              <a href="#services" className="inline-block">
                <Button 
                  className="mt-4 bg-transparent border-2 border-orange text-white px-10 py-6 rounded-full hover:bg-orange/10 transition-all contact-button"
                >
                  НАШИ УСЛУГИ
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="reveal-on-scroll" style={{ animationDelay: "0.3s" }}>
              <div className="text-orange mb-3">Аккредитованы в Минцифры</div>
            </div>
            <div className="text-right reveal-on-scroll" style={{ animationDelay: "0.4s" }}>
              <div className="text-gray-300 mb-3">Поставляем оборудование и ПО</div>
              <div className="text-gray-300">Строим частные облака под ключ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
