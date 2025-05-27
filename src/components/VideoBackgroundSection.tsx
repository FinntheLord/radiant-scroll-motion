
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import ConsultationChat from "./ConsultationChat";

const VideoBackgroundSection: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Add floating elements to the section
    const section = document.querySelector('.video-background-section');
    if (section) {
      for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element floating';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.width = `${Math.random() * 100 + 50}px`;
        element.style.height = `${Math.random() * 100 + 50}px`;
        element.style.opacity = `${Math.random() * 0.15 + 0.05}`;
        section.appendChild(element);
      }
    }
  }, []);

  return (
    <>
      <section className="relative min-h-screen py-20 flex items-center video-background-section overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          {/* Light gradient overlay to maintain text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent z-10"></div>
          <div className="relative w-full h-full">
            <iframe
              src="https://www.youtube.com/embed/Hgg7M3kSqyE?autoplay=1&mute=1&loop=1&playlist=Hgg7M3kSqyE&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
              title="Blueprint Background Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
              style={{ mixBlendMode: 'normal' }}
            ></iframe>
          </div>
        </div>
        
        <div className="animated-bg-light absolute inset-0 z-5"></div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6 reveal-on-scroll">
              <TextShimmer 
                className="font-semibold [--base-color:theme(colors.connexi.orange)] [--base-gradient-color:theme(colors.connexi.pink)]" 
                duration={1.5}
                spread={3}
              >
                ВІДКРИВАЙТЕ НОВІ МОЖЛИВОСТІ
              </TextShimmer>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 reveal-on-scroll">
              <span className="text-gray-800">ТЕХНОЛОГІЇ </span>
              <span className="connexi-gradient-text font-extrabold">МАЙБУТНЬОГО</span>
              <span className="text-gray-800"> ВЖЕ СЬОГОДНІ</span>
            </h2>

            <div className="max-w-3xl mx-auto mb-16 reveal-on-scroll">
              <p className="text-gray-700 text-lg mb-8">
                Ми створюємо рішення, які допомагають бізнесу розвиватися
                та залишатися конкурентоспроможним в епоху штучного інтелекту.
              </p>

              <Button 
                className="mt-4 contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold"
                onClick={() => setIsChatOpen(true)}
              >
                ДІЗНАТИСЯ БІЛЬШЕ
              </Button>
            </div>
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

export default VideoBackgroundSection;
