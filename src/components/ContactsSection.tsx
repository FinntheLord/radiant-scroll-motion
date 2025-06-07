
import React from "react";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "../contexts/ChatContext";
import { Language, getTranslation } from "../lib/translations";

interface ContactsSectionProps {
  className?: string;
  lang: Language;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ className = "", lang }) => {
  const { openSidebarChat } = useChat();

  return (
    <section id="contacts" className={`py-20 relative overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
            {getTranslation('contactsSubtitle', lang)}
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white reveal-on-scroll">
            <span className="text-white">{getTranslation('contactsTitle1', lang)} </span>
            <span className="connexi-gradient-text">{getTranslation('contactsTitle2', lang)}</span>
            <br />
            <span className="text-white">{getTranslation('contactsTitle3', lang)} </span>
            <span className="connexi-gradient-text">{getTranslation('contactsTitle4', lang)}</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start reveal-on-scroll">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30">
                  <MapPin className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {lang === 'en' ? 'Address' : 'Адреса'}
                  </h3>
                  <p className="text-white/80">
                    {lang === 'en' ? 'Dnipro, Rabochaya, 23K' : 'Дніпро, Рабочая, 23К'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30">
                  <Phone className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {lang === 'en' ? 'Phone' : 'Телефон'}
                  </h3>
                  <a 
                    href="tel:+380672002675" 
                    className="text-white/80 hover:text-orange-500 transition-colors"
                  >
                    +38 (067) 200-26-75
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30">
                  <Mail className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {lang === 'en' ? 'Email' : 'Email'}
                  </h3>
                  <a 
                    href="mailto:info@connexi.ai" 
                    className="text-white/80 hover:text-orange-500 transition-colors"
                  >
                    info@connexi.ai
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - CTA and Social Media */}
            <div className="flex flex-col items-center justify-center space-y-8">
              <Button 
                className="contact-button px-12 py-6 rounded-full transition-all pulse-on-hover font-semibold text-lg"
                onClick={openSidebarChat}
              >
                <MessageCircle className="mr-3 h-5 w-5" />
                {getTranslation('consultation', lang)}
              </Button>

              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://t.me/connexi_ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://wa.me/380672002675" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="floating-element w-96 h-96 top-20 -left-48 opacity-20"></div>
      <div className="floating-element w-80 h-80 bottom-10 -right-40 opacity-20"></div>
    </section>
  );
};

export default ContactsSection;
