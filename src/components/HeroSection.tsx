
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import DisplayCards from "@/components/ui/display-cards";

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
    <section className="relative min-h-screen pt-20 flex items-center bg-white hero-section overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-white/90 z-10"></div>
        <div className="relative w-full h-full opacity-75">
          <iframe
            src="https://www.youtube.com/embed/Jox6R5-rIH0?autoplay=1&mute=1&loop=1&playlist=Jox6R5-rIH0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            title="Blueprint Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
            style={{ mixBlendMode: 'soft-light' }}
          ></iframe>
        </div>
      </div>
      
      <div className="animated-bg-light absolute inset-0 z-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            <div className="reveal-on-scroll">
              <div className="mb-6">
                <TextShimmer 
                  className="font-semibold [--base-color:theme(colors.connexi.orange)] [--base-gradient-color:theme(colors.connexi.pink)]" 
                  duration={1.5}
                  spread={3}
                >
                  ВПРОВАДЖУЄМО
                </TextShimmer>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900" style={{ animationDelay: "0.1s" }}>
                <span className="text-gray-800"># ШТУЧНИЙ </span>
                <br />
                <span className="connexi-gradient-text font-extrabold parallax" data-speed="0.02">ІНТЕЛЕКТ</span>
                <span className="text-gray-800"> ДЛЯ БІЗНЕСУ</span>
              </h1>

              <div className="max-w-2xl" style={{ animationDelay: "0.2s" }}>
                <p className="text-gray-700 mb-8">
                  Ми розробляємо та інтегруємо AI-агентів у ваші бізнес-процеси,
                  навчаємо їх на контенті вашої компанії для максимальної 
                  <span className="connexi-gradient-text font-medium"> ефективності</span>
                </p>

                <a href="#services" className="inline-block">
                  <Button 
                    className="mt-4 contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold"
                  >
                    НАШІ ПОСЛУГИ
                  </Button>
                </a>
              </div>
            </div>

            <div className="hidden lg:block reveal-on-scroll">
              <DisplayCards />
            </div>
          </div>

          <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="reveal-on-scroll parallax" data-speed="0.03" style={{ animationDelay: "0.3s" }}>
              <div className="connexi-gradient-text font-medium mb-3">Сертифіковані спеціалісти з AI</div>
            </div>
            <div className="text-right reveal-on-scroll parallax" data-speed="0.01" style={{ animationDelay: "0.4s" }}>
              <div className="text-gray-700 mb-3">Розробляємо чат-боти та голосових асистентів</div>
              <div className="text-gray-700">Автоматизуємо бізнес-процеси за допомогою AI</div>
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
