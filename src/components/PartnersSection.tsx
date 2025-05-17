
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const partners = [
  { name: "АТБ", id: 1 },
  { name: "Ярмолино", id: 2 },
  { name: "Новис", id: 3 },
  { name: "EDS Power", id: 4 },
  { name: "PDR Auto", id: 5 },
  { name: "Skin & Skin", id: 6 },
];

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
        
        <div className="mb-16 reveal-on-scroll">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="py-4">
              {partners.map((partner) => (
                <CarouselItem key={partner.id} className="md:basis-1/3 lg:basis-1/4 pl-4">
                  <div className="h-36 p-6 flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="text-xl font-bold text-gray-800">{partner.name}</div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 custom-carousel-button">
                <ArrowLeft className="h-5 w-5" />
              </CarouselPrevious>
              <CarouselNext className="static translate-y-0 custom-carousel-button">
                <ArrowRight className="h-5 w-5" />
              </CarouselNext>
            </div>
          </Carousel>
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
