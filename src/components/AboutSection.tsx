import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface AboutSectionProps {
  className?: string;
}
const AboutSection: React.FC<AboutSectionProps> = ({
  className = ""
}) => {
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
  return <section id="about" className={`min-h-screen relative py-20 ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="connexi-gradient-text text-xl mb-6 reveal-on-scroll">ПРО КОМПАНІЮ</div>
        
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className={`${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>В��РОВАДЖУЄМО <br />ПРОЄКТИ </span>
            <span className="connexi-gradient-text">ШТУЧНОГО<br />ІНТЕЛЕКТУ</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="reveal-on-scroll" style={{
            animationDelay: "0.1s"
          }}>
              <p className={`text-lg ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
                <span className="font-bold connexi-gradient-text">CONNEXI.AI</span> — ЦЕ ІНДИВІДУАЛЬНИЙ ПІДХІД ТА ПЕРЕДОВІ 
                ПРАКТИКИ ШТУЧНОГО ІНТЕЛЕКТУ ДЛЯ ВИРІШЕННЯ ЗАВДАНЬ 
                БУДЬ-ЯКОЇ СКЛАДНОСТІ
              </p>
            </div>
            
            <div className="reveal-on-scroll" style={{
            animationDelay: "0.2s"
          }}>
              <p className={`mb-8 ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}`}>
                Багаторічна практика технічної експертизи в сфері штучного інтелекту,
                накопичена в провідних IT-компаніях, дозволяє нам знаходити оптимальні 
                рішення для завдань будь-якої складності, забезпечуючи якість, 
                надійність та високий рівень сервісу.
              </p>
              
              <Button className="contact-button px-6 py-2 rounded-full transition-all pulse-on-hover">
                ЗВ'ЯЗАТИСЯ
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="mb-6 flex justify-between items-center reveal-on-scroll">
            <h3 className="text-2xl connexi-gradient-text">Наші переваги</h3>
            <div className="flex gap-2 md:hidden">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full custom-carousel-button carousel-prev" aria-label="Попередній слайд">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full custom-carousel-button carousel-next" aria-label="Наступний слайд">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="card-glow absolute inset-0 -z-10 bg-connexi-pink/5 rounded-xl blur-3xl"></div>
          
          <Carousel className="w-full" opts={{
          align: "start",
          loop: true
        }} ref={carouselRef}>
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} style={{
                animationDelay: "0.3s"
              }}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl mb-8 ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}># ШВИДКО ТА ЯКІСНО</h3>
                    <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
                      <p className="mb-4">
                        Забезпечуємо <span className="connexi-gradient-text">на 30% більшу швидкість</span> розробки та 
                        впровадження AI-рішень завдяки оптимізації ресурсів команди.
                      </p>
                      <p>
                        Всі наші співробітники — фахівці з високопрофесійним
                        підходом до вирішення завдань штучного інтелекту
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} style={{
                animationDelay: "0.4s"
              }}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl mb-8 ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}># ЕФЕКТИВНО</h3>
                    <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
                      <p>
                        Підвищуємо ефективність бізнес-процесів 
                        на різних рівнях завдяки застосуванню новітніх 
                        AI-технологій та тісній співпраці з 
                        постачальниками рішень
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} style={{
                animationDelay: "0.5s"
              }}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl mb-8 ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}># НАДІЙНО</h3>
                    <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
                      <p>
                        Гарантуємо високу якість і стабільність 
                        усіх впроваджуваних AI-рішень завдяки використанню 
                        перевірених технологій і багаторівневому 
                        тестуванню
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
    </section>;
};
export default AboutSection;