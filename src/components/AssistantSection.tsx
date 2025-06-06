
import React from "react";
import { Language, getTranslation } from "../lib/translations";
import AssistantDescription from "./AssistantDescription";
import { Button } from "@/components/ui/button";

interface AssistantSectionProps {
  className?: string;
  lang: Language;
}

const AssistantSection: React.FC<AssistantSectionProps> = ({ className = "", lang }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image failed to load:", e);
    console.log("Image src:", e.currentTarget.src);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

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
                <div className="max-w-3xl mx-auto mb-16">
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      className="contact-button px-10 py-6 rounded-full transition-all pulse-on-hover font-semibold"
                    >
                      {getTranslation('learnMore', lang)}
                    </Button>
                    
                    <img
                      src="/lovable-uploads/assistant-chat-icon.webp"
                      alt="AI Animation"
                      className="h-[60px] w-auto rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
