
import React from "react";
import { Language, getTranslation } from "../lib/translations";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useSiteChat } from "../contexts/SiteChatContext";

interface HeroSectionProps {
  lang: Language;
}

const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const { openChat } = useSiteChat();
  
  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative px-4 text-center">
      <div className="max-w-4xl mx-auto z-10 reveal-on-scroll">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6">
          <span className="text-white block mb-2">{getTranslation('heroTitle1', lang)}</span>
          <span className="connexi-gradient-text">{getTranslation('heroTitle2', lang)}</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
          {getTranslation('heroSubtitle', lang)}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-colors"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {getTranslation('heroButton1', lang)}
          </Button>
          
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-colors"
            onClick={openChat}
          >
            {getTranslation('heroButton2', lang)}
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-10 animate-bounce">
        <button 
          className="text-white/70 hover:text-white transition-colors"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown size={36} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
