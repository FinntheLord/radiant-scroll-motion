
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import ContactPopup from "./ContactPopup";

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
  { name: "TensorFlow", id: 7 },
  { name: "PyTorch", id: 8 },
];

const PartnersSection: React.FC<PartnersSectionProps> = ({ className = "" }) => {
  const [carouselRef, carouselApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    dragFree: true 
  });
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  
  // Set up auto scroll
  useEffect(() => {
    if (carouselApi) {
      const autoScrollInterval = setInterval(() => {
        carouselApi.scrollNext();
      }, 2500); // Reduced time for better mobile performance
      
      return () => {
        clearInterval(autoScrollInterval);
      };
    }
  }, [carouselApi]);

  return (
    <section id="partners" className={`py-12 md:py-20 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16 reveal-on-scroll">
          <div className="text-orange-500 text-lg md:text-xl mb-4 md:mb-6">{"{04}"} ПАРТНЕРИ</div>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            + 50 ТЕХНОЛОГІЙ
          </h2>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            З ЯКИМИ
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="orange-highlight">МИ</span>
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="orange-highlight">ПРАЦЮЄМО</span>
          </h2>
        </div>
      </div>
      
      {/* Full-width carousel container with mobile optimization */}
      <div className="w-full overflow-hidden mb-12 md:mb-16 reveal-on-scroll">
        <Carousel
          ref={carouselRef}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="py-4">
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="basis-2/3 md:basis-1/3 lg:basis-1/4 pl-4">
                <div className={`h-24 md:h-36 p-4 md:p-6 flex items-center justify-center rounded-lg shadow-sm border hover:shadow-md transition-all ${className?.includes('bg-gray-900') ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                  <div className="text-sm md:text-xl font-bold text-center">{partner.name}</div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center reveal-on-scroll">
          <Button 
            onClick={() => setIsContactPopupOpen(true)}
            className="contact-button flex items-center gap-2 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full"
          >
            НАШІ КЕЙСИ
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
        title="Переглянути наші кейси"
      />
    </section>
  );
};

export default PartnersSection;
