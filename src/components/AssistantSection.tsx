
import React from "react";
import { Language, getTranslation } from "../lib/translations";
import AssistantDescription from "./AssistantDescription";
import { Button } from "@/components/ui/button";

interface AssistantSectionProps {
  className?: string;
  lang: Language;
}

const AssistantSection: React.FC<AssistantSectionProps> = ({ className = "", lang }) => {
  return (
    <section id="assistant" className={`min-h-screen py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
          {getTranslation('assistantSubtitle', lang)}
        </div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-white">{getTranslation('assistantTitle1', lang)} </span>
            <span className="connexi-gradient-text">{getTranslation('assistantTitle2', lang)}</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AssistantDescription lang={lang} />
            
            <div className="flex justify-center items-center reveal-on-scroll">
              <div className="text-center">
                <div className="mb-8">
                  <img 
                    src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTayLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                    alt="AI Assistant"
                    className="w-64 h-64 mx-auto rounded-lg object-cover"
                  />
                </div>
                <Button 
                  className="contact-button px-8 py-3 rounded-full transition-all pulse-on-hover font-semibold"
                >
                  {lang === 'en' ? 'Learn More' : 'Дізнатися більше'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
