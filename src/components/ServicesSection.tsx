
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MovingBorder } from "@/components/ui/moving-border";

interface ServicesSectionProps {
  className?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "" }) => {
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

  const handlePrevious = useCallback(() => {
    const currentIndex = parseInt(activeTab);
    const newIndex = currentIndex === 0 ? services.length - 1 : currentIndex - 1;
    setActiveTab(newIndex.toString());
  }, [activeTab, services.length]);

  const handleNext = useCallback(() => {
    const currentIndex = parseInt(activeTab);
    const newIndex = currentIndex === services.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(newIndex.toString());
  }, [activeTab, services.length]);
  
  // Track touch events for swiping
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    // Minimum distance required for swipe
    const minSwipeDistance = 50;
    const distance = touchEndX.current - touchStartX.current;
    
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      // Swiped right
      handlePrevious();
    } else {
      // Swiped left
      handleNext();
    }
  };

  return (
    <section id="services" className={`min-h-screen relative py-20 ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="connexi-gradient-text text-xl mb-6 reveal-on-scroll">НАШИ УСЛУГИ</div>
        
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className={`${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>КОМПЛЕКСНО </span>
            <span className="connexi-gradient-text">РЕШАЕМ<br />ЗАДАЧИ</span>
          </h2>

          <div className="card-glow absolute inset-0 -z-10 bg-connexi-purple/5 rounded-xl blur-3xl"></div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8 reveal-on-scroll">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-12 w-12 rounded-full custom-carousel-button ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                  onClick={handlePrevious}
                  aria-label="Предыдущая услуга"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-12 w-12 rounded-full custom-carousel-button ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
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
                className="mt-0 services-tab-content fade-transition"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative p-[1px] rounded-lg overflow-hidden reveal-on-scroll">
                  <MovingBorder duration={3000} rx="1rem" ry="1rem">
                    <div className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--connexi-purple)_40%,var(--connexi-pink)_60%,transparent_85%)]" />
                  </MovingBorder>
                
                  <Card className="relative border-none bg-white/80 backdrop-blur-sm rounded-lg p-4 z-10">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl">{service.icon}</div>
                        <h3 className={`text-2xl ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}># {service.title}</h3>
                      </div>
                      <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>{service.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          {/* Simplified indicator dots - only essential UI element kept */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-3 reveal-on-scroll">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => setActiveTab(index.toString())}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all indicator-dot ${
                    activeTab === index.toString() ? "active scale-125" : "bg-gray-400 hover:bg-connexi-purple/50"
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
