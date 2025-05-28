
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContactPopup from "./ContactPopup";

interface CasesSectionProps {
  className?: string;
}

const caseStudies = [
  {
    id: "001",
    title: "Впровадження системи підтримки клієнтів на базі чат-бота для великої торгівельної мережі",
    tags: ["ПІДТРИМКА КЛІЄНТІВ", "ЧАТ-БОТ", "АВТОМАТИЗАЦІЯ", "РИТЕЙЛ", "AI АНАЛІТИКА"]
  },
  {
    id: "002",
    title: "Розробка системи аналізу та прогнозування продажів для логістичної компанії",
    tags: ["ПРОГНОЗУВАННЯ", "ЛОГІСТИКА", "АНАЛІЗ ДАНИХ", "ОПТИМІЗАЦІЯ", "АВТОМАТИЗАЦІЯ"]
  },
  {
    id: "003",
    title: "Впровадження AI-системи для виявлення шахрайства та оцінки ризиків у фінансовій організації",
    tags: ["БЕЗПЕКА", "FINTECH", "АНАЛІЗ РИЗИКІВ", "ЗАХИСТ ДАНИХ", "АВТОМАТИЗАЦІЯ"]
  }
];

const industries = [
  { name: "FINTECH СЕКТОР", id: 1 },
  { name: "РОЗДРІБНА ТОРГІВЛЯ", id: 2 },
  { name: "ЛОГІСТИКА", id: 3 },
  { name: "АПК", id: 4 },
  { name: "IT & TECH", id: 5 },
];

const CasesSection: React.FC<CasesSectionProps> = ({ className = "" }) => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  return (
    <section id="cases" className={`py-12 md:py-20 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-4 reveal-on-scroll flex items-center">
          <div className="text-orange-500 text-lg md:text-xl mb-4 md:mb-6">{"{05}"} КЕЙСИ</div>
        </div>
        
        <div className="text-center mb-12 md:mb-16 reveal-on-scroll">
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            МИ ДІЙСНО
          </h2>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            РОБИМО,
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-connexi-orange">
            А НЕ ГОВОРИМО
          </h2>

          <div className="mt-8 md:mt-12 text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className={className?.includes('text-white') ? 'text-white' : 'text-gray-900'}>{'{'} + </span>
            <span className="text-connexi-orange">50</span>
            <span className={className?.includes('text-white') ? 'text-white' : 'text-gray-900'}> кейсів у сфері AI {'}'}</span>
          </div>

          <div className="mt-8 md:mt-10">
            <p className={`uppercase mb-4 md:mb-6 text-sm md:text-base ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>ПІДТВЕРДЖЕНИЙ ДОСВІД У НАСТУПНИХ СФЕРАХ</p>
            
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
              {industries.map((industry) => (
                <span 
                  key={industry.id} 
                  className={`px-3 md:px-4 py-2 rounded-full border hover:bg-opacity-80 transition-colors cursor-pointer case-transparent-block text-xs md:text-sm ${
                    className?.includes('text-white') 
                      ? 'border-gray-600 text-white hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {industry.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6 md:space-y-8 reveal-on-scroll">
          {caseStudies.map((caseStudy) => (
            <Card 
              key={caseStudy.id}
              className={`case-card-white overflow-hidden hover:scale-[1.01] transition-all duration-300 border-0 ${
                className?.includes('text-white') 
                  ? 'text-white bg-transparent' 
                  : 'text-gray-900 bg-transparent'
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className={`p-4 md:p-6 lg:p-10 md:w-1/3 border-b md:border-b-0 md:border-r ${
                    className?.includes('text-white') 
                      ? 'border-gray-700' 
                      : 'border-gray-200'
                  }`}>
                    <div className="flex flex-col h-full">
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-4 md:mb-6">
                        {caseStudy.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className={`text-xs px-2 md:px-3 py-1 rounded-full whitespace-nowrap bg-white ${
                              className?.includes('text-white') 
                                ? 'text-gray-800' 
                                : 'text-gray-800'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>#{caseStudy.id}</h3>
                      <div className="border-t border-connexi-orange w-12 my-4"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 lg:p-10 md:w-2/3 flex flex-col justify-between">
                    <h4 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
                      {caseStudy.title}
                    </h4>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={() => setIsDetailPopupOpen(true)}
                        className="bg-transparent hover:bg-transparent text-connexi-orange border-none shadow-none p-0 hover:text-white transition-colors"
                      >
                        ЧИТАТИ ДЕТАЛЬНІШЕ
                        <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 md:mt-12 reveal-on-scroll">
          <Button 
            onClick={() => setIsContactPopupOpen(true)}
            className="contact-button flex items-center gap-2 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full"
          >
            УСІ КЕЙСИ
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="floating-element w-64 h-64 md:w-96 md:h-96 top-20 -left-32 md:-left-48 opacity-20"></div>
      <div className="floating-element w-48 h-48 md:w-80 md:h-80 bottom-10 -right-24 md:-right-40 opacity-20"></div>
      
      <ContactPopup 
        isOpen={isContactPopupOpen}
        onClose={() => setIsContactPopupOpen(false)}
        title="Переглянути всі кейси"
      />
      
      <ContactPopup 
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        title="Детальна інформація про кейс"
      />
    </section>
  );
};

export default CasesSection;
