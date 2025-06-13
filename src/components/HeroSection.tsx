
import React from "react";
import { Button } from "@/components/ui/button";
import { useSimpleChatContext } from "@/contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface HeroSectionProps {
  lang: Language;
}

const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const { openChat } = useSimpleChatContext();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background circles and lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black opacity-40"></div>
        <div className="absolute inset-0 grid grid-cols-2 gap-px [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-10">
          <div className="bg-gray-700"></div>
          <div className="bg-gray-700"></div>
          <div className="bg-gray-700"></div>
          <div className="bg-gray-700"></div>
        </div>
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-connexi-orange/20 to-connexi-pink/20 blur-xl animate-pulse hidden md:block"></div>
      <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-connexi-pink/15 to-connexi-orange/15 blur-lg animate-pulse hidden md:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-3/4 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-connexi-orange/25 to-connexi-pink/25 blur-md animate-pulse hidden md:block" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-5xl mx-auto reveal-on-scroll">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">{getTranslation('heroTitle1', lang)}</span>
            <br />
            <span className="connexi-gradient-text">{getTranslation('heroTitle2', lang)}</span>
            <br />
            <span className="text-white">{getTranslation('heroTitle3', lang)}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {getTranslation('heroSubtitle', lang)}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              onClick={openChat}
              size="lg"
              className="contact-button text-lg px-8 py-4 h-auto"
            >
              {getTranslation('consultation', lang)}
            </Button>
            
            <Button 
              onClick={openChat}
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4 h-auto transition-all duration-300"
            >
              {getTranslation('ourServices', lang)}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="floating-element w-64 h-64 md:w-96 md:h-96 top-10 -left-32 md:-left-48 opacity-20"></div>
      <div className="floating-element w-48 h-48 md:w-80 md:h-80 bottom-0 -right-24 md:-right-40 opacity-20"></div>
    </section>
  );
};

export default HeroSection;
