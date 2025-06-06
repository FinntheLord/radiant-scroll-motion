
import React, { useState } from "react";
import { Language, getTranslation } from "../lib/translations";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSiteChat } from "../contexts/SiteChatContext";

interface ServicesSectionProps {
  lang: Language;
}

interface ServiceCardProps {
  title: string;
  description: string;
  details: string[];
  image: string;
  lang: Language;
  onLearnMore: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, details, image, lang, onLearnMore }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 reveal-on-scroll">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover object-center" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="text-orange-500 hover:text-orange-600 py-0 px-0 flex items-center">
              {isOpen ? (
                <>
                  {getTranslation('servicesShowLess', lang)}
                  <ChevronUp className="ml-1 w-4 h-4" />
                </>
              ) : (
                <>
                  {getTranslation('servicesShowMore', lang)}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-4 space-y-2">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <div className="mt-1 mr-2 min-w-3 h-3 w-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"></div>
                  <span className="text-gray-700">{detail}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="mt-6">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white w-full"
            onClick={onLearnMore}
          >
            {getTranslation('servicesLearnMore', lang)}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ lang }) => {
  const { openChat } = useSiteChat();
  
  // Это примерные услуги, вы можете их изменить или дополнить согласно вашим потребностям
  const services = [
    {
      title: getTranslation('serviceTitle1', lang),
      description: getTranslation('serviceDesc1', lang),
      details: [
        getTranslation('serviceDetail1_1', lang),
        getTranslation('serviceDetail1_2', lang),
        getTranslation('serviceDetail1_3', lang),
      ],
      image: '/lovable-uploads/0c823db9-7ce3-4eec-95d5-7f195348151d.png'
    },
    {
      title: getTranslation('serviceTitle2', lang),
      description: getTranslation('serviceDesc2', lang),
      details: [
        getTranslation('serviceDetail2_1', lang),
        getTranslation('serviceDetail2_2', lang),
        getTranslation('serviceDetail2_3', lang),
      ],
      image: '/lovable-uploads/09862013-fb91-4cc9-a2fc-8db3f0a33759.png'
    },
    {
      title: getTranslation('serviceTitle3', lang),
      description: getTranslation('serviceDesc3', lang),
      details: [
        getTranslation('serviceDetail3_1', lang),
        getTranslation('serviceDetail3_2', lang),
        getTranslation('serviceDetail3_3', lang),
      ],
      image: '/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png'
    },
    {
      title: getTranslation('serviceTitle4', lang),
      description: getTranslation('serviceDesc4', lang),
      details: [
        getTranslation('serviceDetail4_1', lang),
        getTranslation('serviceDetail4_2', lang),
        getTranslation('serviceDetail4_3', lang),
      ],
      image: '/lovable-uploads/774363a0-cc02-4bd3-a0f7-df3d7d252267.png'
    },
    {
      title: getTranslation('serviceTitle5', lang),
      description: getTranslation('serviceDesc5', lang),
      details: [
        getTranslation('serviceDetail5_1', lang),
        getTranslation('serviceDetail5_2', lang),
        getTranslation('serviceDetail5_3', lang),
      ],
      image: '/lovable-uploads/a8644c19-c54a-4906-82a8-1a2c5ba5a4b8.png'
    },
    {
      title: getTranslation('serviceTitle6', lang),
      description: getTranslation('serviceDesc6', lang),
      details: [
        getTranslation('serviceDetail6_1', lang),
        getTranslation('serviceDetail6_2', lang),
        getTranslation('serviceDetail6_3', lang),
      ],
      image: '/lovable-uploads/b4617c09-81f1-4ed3-b38c-a1e477cc3b4a.png'
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
            {getTranslation('servicesSubtitle', lang)}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold reveal-on-scroll">
            {getTranslation('servicesTitle', lang)}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              details={service.details}
              image={service.image}
              lang={lang}
              onLearnMore={openChat}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
