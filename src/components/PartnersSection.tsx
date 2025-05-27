import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

interface PartnersSectionProps {
  className?: string;
}

const partners = [
  { name: "OpenAI", id: 1 },
  { name: "Google Cloud", id: 2 },
  { name: "Microsoft Azure", id: 3 },
  { name: "Hugging Face", id: 4 },
  { name: "Amazon AWS", id: 5 },
  { name: "Anthropic", id: 6 },
];

const PartnersSection: React.FC<PartnersSectionProps> = ({ className = "" }) => {
  const [carouselRef, carouselApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    dragFree: true 
  });
  
  // Set up auto scroll
  useEffect(() => {
    if (carouselApi) {
      const autoScrollInterval = setInterval(() => {
        carouselApi.scrollNext();
      }, 3000); // Scroll every 3 seconds
      
      return () => {
        clearInterval(autoScrollInterval);
      };
    }
  }, [carouselApi]);

  return (
    <section className={`py-20 ${className} relative`}>
      <div className="absolute top-8 left-8 z-30">
        <span className="text-4xl md:text-5xl font-bold text-white/30">{"{ 06 }"} ПАРТНЕРИ</span>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            + 50 ТЕХНОЛОГІЙ
          </h2>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            З ЯКИМИ
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="orange-highlight">МИ</span>
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="orange-highlight">ПРАЦЮЄМО</span>
          </h2>
        </div>
      </div>
      
      {/* Full-width carousel container */}
      <div className="w-full overflow-hidden mb-16 reveal-on-scroll">
        <Carousel
          ref={carouselRef}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="py-4 auto-scrolling-content">
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="md:basis-1/3 lg:basis-1/4 pl-4">
                <div className={`h-36 p-6 flex items-center justify-center rounded-lg shadow-sm border hover:shadow-md transition-all ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                  <div className="text-xl font-bold">{partner.name}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center reveal-on-scroll">
          <Button 
            className="contact-button flex items-center gap-2 text-white px-8 py-6 text-lg rounded-full"
          >
            НАШІ КЕЙСИ
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
