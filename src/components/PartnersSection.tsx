
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PartnersSection: React.FC = () => {
  return (
    <section id="partners" className="py-20 overflow-hidden animated-bg-light">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            + 100 ВЕНДОРОВ
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            С КОТОРЫМИ
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="orange-highlight">МЫ</span>
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="orange-highlight">РАБОТАЕМ</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-16 mb-16 reveal-on-scroll">
          {/* Partner logos - placeholders */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center h-16 md:h-20 opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="bg-gray-300 h-6 w-24 md:w-32 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center reveal-on-scroll">
          <Button 
            className="contact-button flex items-center gap-2 text-white px-8 py-6 text-lg rounded-full"
          >
            НАШИ КЕЙСЫ
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="floating-element w-96 h-96 top-20 -left-48 opacity-20"></div>
      <div className="floating-element w-80 h-80 bottom-10 -right-40 opacity-20"></div>
    </section>
  );
};

export default PartnersSection;
