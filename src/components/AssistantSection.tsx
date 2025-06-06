
import React from "react";
import { Language, getTranslation } from "../lib/translations";
import AssistantDescription from "./AssistantDescription";
import AssistantChat from "./AssistantChat";

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
            <AssistantChat lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
