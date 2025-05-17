
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const caseStudies = [
  {
    id: "001",
    title: "Построение и сопровождение частного облака для крупнейшей российской юридической фирмы",
    tags: ["ЧАСТНОЕ ОБЛАКО", "IAAS", "СОПРОВОЖДЕНИЕ", "DISASTER-READY", "МОНИТОРИНГ"]
  },
  {
    id: "002",
    title: "Разработка системы автоматизации бизнес-процессов для логистической компании",
    tags: ["АВТОМАТИЗАЦИЯ", "ЛОГИСТИКА", "ИНТЕГРАЦИЯ", "BIGDATA", "АНАЛИТИКА"]
  },
  {
    id: "003",
    title: "Внедрение комплексной системы кибербезопасности для финансовой организации",
    tags: ["БЕЗОПАСНОСТЬ", "FINTECH", "АУДИТ", "ЗАЩИТА ДАННЫХ", "СООТВЕТСТВИЕ"]
  }
];

const industries = [
  { name: "FINTECH СЕКТОР", id: 1 },
  { name: "TELECOM", id: 2 },
  { name: "LEGAL СЕКТОР", id: 3 },
  { name: "TRANSPORT & LOGISTICS", id: 4 },
  { name: "IT & TECH", id: 5 },
];

const CasesSection: React.FC = () => {
  return (
    <section id="cases" className="py-20 overflow-hidden bg-gray-900 text-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-4 reveal-on-scroll flex items-center">
          <span className="text-connexi-orange font-bold mr-2">02</span>
          <h2 className="text-2xl font-bold text-connexi-orange">КЕЙСЫ</h2>
        </div>
        
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            МЫ ДЕЙСТВИТЕЛЬНО
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            ДЕЛАЕМ,
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-connexi-orange">
            А НЕ ГОВОРИМ
          </h2>

          <div className="mt-12 text-3xl md:text-4xl font-bold">
            <span className="text-white">{'{'} + </span>
            <span className="text-connexi-orange">200</span>
            <span className="text-white"> кейсов в сфере {'}'}</span>
          </div>

          <div className="mt-10">
            <p className="text-gray-300 uppercase mb-6">ПОДТВЕРЖДЕННЫЙ ОПЫТ В СЛЕДУЮЩИХ СФЕРАХ</p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {industries.map((industry) => (
                <span 
                  key={industry.id} 
                  className="px-4 py-2 rounded-full border border-gray-600 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {industry.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-8 reveal-on-scroll">
          {caseStudies.map((caseStudy) => (
            <Card 
              key={caseStudy.id}
              className="bg-gray-800 border-0 overflow-hidden hover:scale-[1.01] transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:p-10 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700">
                    <div className="flex flex-col h-full">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {caseStudy.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="text-xs px-3 py-1 rounded-full bg-gray-700 text-white whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">#{caseStudy.id}</h3>
                      <div className="border-t border-connexi-orange w-12 my-4"></div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-10 md:w-2/3 flex flex-col justify-between">
                    <h4 className="text-xl font-bold text-white mb-6">
                      {caseStudy.title}
                    </h4>
                    
                    <div className="mt-4">
                      <Button 
                        className="bg-transparent hover:bg-transparent text-connexi-orange border-none shadow-none p-0 hover:text-white transition-colors"
                      >
                        ЧИТАТЬ ПОДРОБНЕЕ
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 reveal-on-scroll">
          <Button 
            className="contact-button flex items-center gap-2 text-white px-8 py-6 text-lg rounded-full"
          >
            ВСЕ КЕЙСЫ
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

export default CasesSection;
