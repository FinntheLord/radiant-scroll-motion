
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Language, getTranslation } from "../lib/translations";

interface HeroSectionProps {
  lang: Language;
}

const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="floating-element w-96 h-96 top-20 -left-48"></div>
      <div className="floating-element w-80 h-80 bottom-20 -right-40"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 reveal-on-scroll">
            <span className="text-gray-800">{getTranslation('heroTitle1', lang)}</span>
            <br />
            <span className="connexi-gradient-text">{getTranslation('heroTitle2', lang)}</span>
            <br />
            <span className="text-gray-800">{getTranslation('heroTitle3', lang)}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
            {getTranslation('heroSubtitle', lang)}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center reveal-on-scroll" style={{ animationDelay: "0.4s" }}>
            <Button className="contact-button px-8 py-3 text-lg rounded-full transition-all pulse-on-hover">
              {getTranslation('consultation', lang)}
            </Button>
            
            <img 
              src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
              alt="AI Animation"
              className="h-12 w-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
