
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Blocks } from "lucide-react";

const ServicesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("0");

  const services = [
    {
      id: "0",
      title: "АУДИТ И АНАЛИЗ",
      description: "Проведение ИТ-аудита и цифровой трансформации, технические консультации и рекомендации по развитию, аналитика и управление данными.",
      icon: "📊"
    },
    {
      id: "1",
      title: "ПРОЕКТИРОВАНИЕ",
      description: "Разработка ИТ-архитектуры и дизайна решений, создание проектной и эксплуатационной документации, планирование и оптимизация ресурсов.",
      icon: "🔧"
    },
    {
      id: "2",
      title: "ВНЕДРЕНИЕ",
      description: "Создание и развертывание программных решений, интеграция систем и сервисов, автоматизация бизнес-процессов компании.",
      icon: "🚀"
    }
  ];

  const handlePrevious = () => {
    const currentIndex = parseInt(activeTab);
    const newIndex = currentIndex === 0 ? services.length - 1 : currentIndex - 1;
    setActiveTab(newIndex.toString());
  };

  const handleNext = () => {
    const currentIndex = parseInt(activeTab);
    const newIndex = currentIndex === services.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(newIndex.toString());
  };

  return (
    <section id="services" className="min-h-screen relative bg-dark-darker py-20 animated-bg">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-orange text-xl mb-6 reveal-on-scroll">НАШИ УСЛУГИ</div>
        
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-gray-200">КОМПЛЕКСНО </span>
            <span className="orange-highlight">РЕШАЕМ<br />ЗАДАЧИ</span>
          </h2>

          <div className="card-glow absolute inset-0 -z-10 bg-orange/5 rounded-xl blur-3xl"></div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-8 reveal-on-scroll">
              <TabsList className="bg-dark-lighter/50 p-1 rounded-lg">
                {services.map(service => (
                  <TabsTrigger 
                    key={service.id} 
                    value={service.id}
                    className="data-[state=active]:bg-orange data-[state=active]:text-white rounded-md px-4 py-2 transition-all"
                  >
                    {parseInt(service.id) + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full border-orange text-orange hover:bg-orange/10 hover:text-orange custom-carousel-button"
                  onClick={handlePrevious}
                  aria-label="Предыдущая услуга"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-full border-orange text-orange hover:bg-orange/10 hover:text-orange custom-carousel-button"
                  onClick={handleNext}
                  aria-label="Следующая услуга"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {services.map((service) => (
              <TabsContent 
                key={service.id} 
                value={service.id}
                className="mt-0 data-[state=active]:animate-fade-in"
              >
                <Card className="bg-dark-lighter border-none rounded-lg p-4 reveal-on-scroll card-hover transition-all duration-500">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{service.icon}</div>
                      <h3 className="text-2xl text-gray-200"># {service.title}</h3>
                    </div>
                    <p className="text-gray-300">{service.description}</p>
                    
                    <div className="mt-8">
                      <Button 
                        className="bg-transparent border-2 border-orange text-orange px-6 py-2 rounded-full hover:bg-orange/10 transition-all pulse-on-hover"
                      >
                        ПОДРОБНЕЕ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="flex justify-center mt-8">
            <div className="flex gap-3 reveal-on-scroll">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => setActiveTab(index.toString())}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                    activeTab === index.toString() ? "bg-orange scale-125" : "bg-gray-500 hover:bg-orange/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
