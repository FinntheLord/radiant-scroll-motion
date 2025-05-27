import React, { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import ConsultationChat from "./ConsultationChat";

const HeroSection: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Add floating elements to the hero section
    const heroSection = document.querySelector('.hero-background');
    if (heroSection) {
      for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.width = `${Math.random() * 100 + 50}px`;
        element.style.height = `${Math.random() * 100 + 50}px`;
        element.style.opacity = `${Math.random() * 0.15 + 0.05}`;
        heroSection.appendChild(element);
      }
    }
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center text-white pt-20 hero-background overflow-hidden">
        <div className="absolute top-8 left-8 z-30">
          <span className="text-4xl md:text-5xl font-bold text-white/30">{ 01 }</span>
        </div>
        
        <div className="animated-bg absolute inset-0 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 reveal-on-scroll">
              <TextShimmer 
                className="font-semibold [--base-color:theme(colors.connexi.orange)] [--base-gradient-color:theme(colors.connexi.pink)]" 
                duration={1.5}
                spread={3}
              >
                ШТУЧНИЙ ІНТЕЛЕКТ ДЛЯ БІЗНЕСУ
              </TextShimmer>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-12 reveal-on-scroll">
              <span className="text-white">РОЗКРИЙТЕ ПОТЕНЦІАЛ </span>
              <span className="connexi-gradient-text font-extrabold">ШТУЧНОГО ІНТЕЛЕКТУ</span>
              <span className="text-white"> ДЛЯ ВАШОГО БІЗНЕСУ</span>
            </h1>

            <div className="max-w-3xl mx-auto mb-16 reveal-on-scroll">
              <p className="text-gray-200 text-lg mb-8">
                Ми допомагаємо компаніям впроваджувати інноваційні AI-рішення, 
                які оптимізують процеси, знижують витрати та збільшують прибуток.
              </p>

              <Button 
                className="mt-4 contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold"
                onClick={() => setIsChatOpen(true)}
              >
                ОТРИМАТИ КОНСУЛЬТАЦІЮ
              </Button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a href="#about" className="text-white/70 hover:text-white transition-colors">
              <ArrowDown className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>

      <ConsultationChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default HeroSection;
