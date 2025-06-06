
import React, { useState } from "react";
import { Language, getTranslation } from "../lib/translations";
import AssistantDescription from "./AssistantDescription";
import { Button } from "@/components/ui/button";
import ChatSidebar from "./ChatSidebar";

interface AssistantSectionProps {
  className?: string;
  lang: Language;
}

const AssistantSection: React.FC<AssistantSectionProps> = ({ className = "", lang }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  return (
    <>
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
              
              <div className="flex flex-col items-center justify-center space-y-8 reveal-on-scroll">
                <div className="text-center">
                  <img
                    src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                    alt="AI Assistant"
                    className="h-32 w-32 mx-auto mb-6 rounded-full opacity-90"
                  />
                  <p className="text-lg text-white/80 mb-8">
                    {lang === 'en' 
                      ? "Ready to answer your questions about AI solutions for your business"
                      : "Готовий відповісти на ваші запитання про AI-рішення для вашого бізнесу"
                    }
                  </p>
                </div>

                {/* Chat preview mockup with animated gif */}
                <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                      alt="AI Assistant Animation"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="text-white font-medium text-sm">AI Assistant</div>
                      <div className="text-white/60 text-xs">
                        {lang === 'en' ? 'Online' : 'В мережі'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-700/50 rounded-lg p-3 text-white/80 text-sm">
                      {lang === 'en' 
                        ? "How can I help optimize your business with AI?"
                        : "Як я можу допомогти оптимізувати ваш бізнес за допомогою AI?"
                      }
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-connexi-orange/20 rounded-lg p-3 text-white text-sm max-w-xs">
                        {lang === 'en' 
                          ? "Tell me about automation solutions"
                          : "Розкажи про рішення для автоматизації"
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleOpenChat}
                  size="lg"
                  className="contact-button text-lg px-8 py-4 h-auto"
                >
                  {lang === 'en' ? 'Start Chat' : 'Почати чат'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChatSidebar 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        lang={lang}
      />
    </>
  );
};

export default AssistantSection;
