
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Language, getTranslation } from "../lib/translations";

interface AboutSectionProps {
  className?: string;
  lang: Language;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  className = "",
  lang
}) => {
  const [api, setApi] = React.useState<CarouselApi>();

  const scrollPrev = React.useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  const scrollNext = React.useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

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
  }, []);

  return (
    <section id="about" className={`min-h-screen relative py-20 ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="connexi-gradient-text text-xl mb-6 reveal-on-scroll">{getTranslation('about', lang)}</div>
        
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className={`${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
              {lang === 'en' ? 'WE IMPLEMENT ' : 'ВПРОВАДЖУЄМО '}
              <br />
              {lang === 'en' ? 'PROJECTS ' : 'ПРОЄКТИ '}
            </span>
            <span className="connexi-gradient-text">
              {lang === 'en' ? 'ARTIFICIAL' : 'ШТУЧНОГО'}
              <br />
              {lang === 'en' ? 'INTELLIGENCE' : 'ІНТЕЛЕКТУ'}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <div className="reveal-on-scroll" style={{ animationDelay: "0.1s" }}>
              <p className={`text-lg ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
                <span className="font-bold connexi-gradient-text">CONNEXI.AI</span> 
                {lang === 'en' 
                  ? ' — IS A TECHNOLOGY COMPANY THAT SPECIALIZES IN IMPLEMENTING ARTIFICIAL INTELLIGENCE IN CLIENT BUSINESS PROCESSES'
                  : ' — ЦЕ ТЕХНОЛОГІЧНА КОМПАНІЯ, ЩО СПЕЦІАЛІЗУЄТЬСЯ НА ВПРОВАДЖЕННІ ШТУЧНОГО ІНТЕЛЕКТУ В БІЗНЕС-ПРОЦЕСИ КЛІЄНТІВ'
                }
              </p>
            </div>
            
            <div className="reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
              <p className={`mb-8 ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}`}>
                {lang === 'en'
                  ? 'We start with a deep study of your business, develop and program AI agents for your tasks, integrate them into your business processes and train them based on your company\'s unique content, ensuring maximum efficiency.'
                  : 'Ми починаємо з глибокого вивчення вашого бізнесу, розробляємо та програмуємо AI-агентів під ваші задачі, інтегруємо їх у ваші бізнес-процеси та навчаємо на основі унікального контенту вашої компанії, забезпечуючи максимальну ефективність.'
                }
              </p>
              
              <Button className="contact-button px-6 py-2 rounded-full transition-all pulse-on-hover">
                {lang === 'en' ? 'CONTACT US' : 'ЗВ\'ЯЗАТИСЯ'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="mb-6 flex justify-between items-center reveal-on-scroll">
            <h3 className="text-2xl connexi-gradient-text">
              {lang === 'en' ? 'Our advantages' : 'Наші переваги'}
            </h3>
            <div className="flex gap-2 md:hidden">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full custom-carousel-button" 
                aria-label={lang === 'en' ? 'Previous slide' : 'Попередній слайд'}
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full custom-carousel-button" 
                aria-label={lang === 'en' ? 'Next slide' : 'Наступний слайд'}
                onClick={scrollNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="card-glow absolute inset-0 -z-10 bg-connexi-pink/5 rounded-xl blur-3xl"></div>
          
          <Carousel className="w-full" opts={{ align: "start", loop: true }} setApi={setApi}>
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} style={{ animationDelay: "0.3s" }}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl mb-8 ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
                      {lang === 'en' ? '# FAST AND QUALITY' : '# ШВИДКО ТА ЯКІСНО'}
                    </h3>
                    <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
                      <p className="mb-4">
                        {lang === 'en' 
                          ? 'We provide '
                          : 'Забезпечуємо '
                        }
                        <span className="connexi-gradient-text">
                          {lang === 'en' ? '30% faster speed' : 'на 30% більшу швидкість'}
                        </span>
                        {lang === 'en'
                          ? ' of AI solution development and implementation thanks to team resource optimization.'
                          : ' розробки та впровадження AI-рішень завдяки оптимізації ресурсів команди.'
                        }
                      </p>
                      <p>
                        {lang === 'en'
                          ? 'All our employees are specialists with a highly professional approach to solving artificial intelligence tasks'
                          : 'Всі наші співробітники — фахівці з високопрофесійним підходом до вирішення завдань штучного інтелекту'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} style={{ animationDelay: "0.4s" }}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl mb-8 ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
                      {lang === 'en' ? '# EFFICIENTLY' : '# ЕФЕКТИВНО'}
                    </h3>
                    <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
                      <p>
                        {lang === 'en'
                          ? 'We increase business process efficiency at various levels through the application of the latest AI technologies and close cooperation with solution providers'
                          : 'Підвищуємо ефективність бізнес-процесів на різних рівнях завдяки застосуванню новітніх AI-технологій та тісній співпраці з постачальниками рішень'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/2">
                <Card className={`shadow-sm border rounded-lg p-4 reveal-on-scroll h-full card-hover ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`} style={{ animationDelay: "0.5s" }}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl mb-8 ${className?.includes('text-white') ? 'text-white' : 'text-gray-800'}`}>
                      {lang === 'en' ? '# RELIABLY' : '# НАДІЙНО'}
                    </h3>
                    <div className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
                      <p>
                        {lang === 'en'
                          ? 'We guarantee high quality and stability of all implemented AI solutions through the use of proven technologies and multi-level testing'
                          : 'Гарантуємо високу якість і стабільність усіх впроваджуваних AI-рішень завдяки використанню перевірених технологій і багаторівневому тестуванню'
                        }
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
