
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AboutSection: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animated background elements
    const section = document.getElementById('about');
    if (section) {
      for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element floating';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.width = `${Math.random() * 100 + 50}px`;
        element.style.height = `${Math.random() * 100 + 50}px`;
        element.style.opacity = `${Math.random() * 0.15 + 0.02}`;
        section.appendChild(element);
      }
    }
    
    // Add click functionality to mobile carousel buttons
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn && carouselRef.current) {
      prevBtn.addEventListener('click', () => {
        const prevButton = carouselRef.current?.querySelector('.embla__button--prev') as HTMLButtonElement | null;
        prevButton?.click();
      });
    }
    
    if (nextBtn && carouselRef.current) {
      nextBtn.addEventListener('click', () => {
        const nextButton = carouselRef.current?.querySelector('.embla__button--next') as HTMLButtonElement | null;
        nextButton?.click();
      });
    }
  }, []);

  return (
    <section id="about" className="min-h-screen relative bg-white py-20 animated-bg-light">
      <div className="container mx-auto px-4 relative z-10">
        <div className="connexi-gradient-text text-xl mb-6 reveal-on-scroll">О КОМПАНИИ</div>
        
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-gray-800">РЕАЛИЗУЕМ <br />ПРОЕКТЫ </span>
            <span className="connexi-gradient-text">ЛЮБОЙ<br />СЛОЖНОСТИ</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="reveal-on-scroll" style={{ animationDelay: "0.1s" }}>
              <p className="text-gray-800 text-lg">
                <span className="font-bold connexi-gradient-text">CONNEXI</span> — ЭТО КАСТОМНЫЙ ПОДХОД И ПЕРЕДОВЫЕ 
                ИТ ПРАКТИКИ К РЕШЕНИЮ ЗАДАЧ ЛЮБОЙ 
                СЛОЖНОСТИ
              </p>
            </div>
            
            <div className="reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
              <p className="text-gray-700 mb-8">
                Многолетняя практика технической экспертизы, аккумулированная
                в крупных ИТ-компаниях и работа с крупнейшими мировыми
                производителями позволяет находить оптимальные решения для
                задач любой сложности, сохраняя качество, надёжность и
                высокий уровень сервиса.
              </p>
              
              <Button 
                className="contact-button px-6 py-2 rounded-full transition-all pulse-on-hover"
              >
                СВЯЗАТЬСЯ
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="mb-6 flex justify-between items-center reveal-on-scroll">
            <h3 className="text-2xl text-gray-800 connexi-gradient-text">Наши преимущества</h3>
            <div className="flex gap-2 md:hidden">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full custom-carousel-button carousel-prev"
                aria-label="Предыдущий слайд"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full custom-carousel-button carousel-next"
                aria-label="Следующий слайд"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="card-glow absolute inset-0 -z-10 bg-connexi-pink/5 rounded-xl blur-3xl"></div>
          
          <Carousel className="w-full" opts={{
            align: "start",
            loop: true,
          }} ref={carouselRef}>
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 reveal-on-scroll h-full card-hover" style={{ animationDelay: "0.3s" }}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl text-gray-800 mb-8"># БЫСТРО И КАЧЕСТВЕННО</h3>
                    <div className="text-gray-700">
                      <p className="mb-4">
                        Обеспечиваем <span className="connexi-gradient-text">большую на 30% скорость</span> разработки и 
                        внедрения решений за счет оптимизации ресурсов команды.
                      </p>
                      <p>
                        Все наши сотрудники-специалисты с высокопрофессиональным 
                        подходом к решению ИТ задач
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 reveal-on-scroll h-full card-hover" style={{ animationDelay: "0.4s" }}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl text-gray-800 mb-8"># ЭФФЕКТИВНО</h3>
                    <div className="text-gray-700">
                      <p>
                        Повышаем эффективность бизнес-процессов 
                        на разных уровнях за счет применения новейших 
                        технологий и тесного сотрудничества с 
                        поставщиками решений
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 reveal-on-scroll h-full card-hover" style={{ animationDelay: "0.5s" }}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl text-gray-800 mb-8"># НАДЕЖНО</h3>
                    <div className="text-gray-700">
                      <p>
                        Гарантируем высокое качество и стабильность 
                        всех внедряемых решений благодаря использованию 
                        проверенных технологий и многоуровневому 
                        тестированию
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            
            <div className="hidden md:block">
              <CarouselPrevious className="custom-carousel-button" />
              <CarouselNext className="custom-carousel-button" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
