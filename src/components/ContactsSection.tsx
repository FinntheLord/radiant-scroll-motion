
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import ContactPopup from "./ContactPopup";
import { Language, getTranslation } from "../lib/translations";

interface ContactsSectionProps {
  className?: string;
  lang: Language;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ className = "", lang }) => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <footer id="contacts" className={`py-12 md:py-20 relative overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16 reveal-on-scroll">
          <div className="text-orange-500 text-lg md:text-xl mb-4 md:mb-6">{getTranslation('contactsSubtitle', lang)}</div>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            {getTranslation('contactsTitle1', lang)}
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="orange-highlight">{getTranslation('contactsTitle2', lang)}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="text-center reveal-on-scroll" style={{ animationDelay: "0.1s" }}>
            <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full ${className?.includes('bg-gray-900') ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Mail className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className={`text-xl md:text-2xl mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              {getTranslation('contactEmail', lang)}
            </h3>
            <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
              info@connexi.ai
            </p>
          </div>

          <div className="text-center reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
            <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full ${className?.includes('bg-gray-900') ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Phone className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className={`text-xl md:text-2xl mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              {getTranslation('contactPhone', lang)}
            </h3>
            <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
              +380 (50) 123-45-67
            </p>
          </div>

          <div className="text-center reveal-on-scroll" style={{ animationDelay: "0.3s" }}>
            <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full ${className?.includes('bg-gray-900') ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <MapPin className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className={`text-xl md:text-2xl mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              {getTranslation('contactAddress', lang)}
            </h3>
            <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-700'}>
              {getTranslation('contactAddressText', lang)}
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-12 md:mb-16 reveal-on-scroll">
          <Button 
            onClick={() => setIsContactPopupOpen(true)}
            className="contact-button flex items-center gap-2 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full"
          >
            {getTranslation('contactUs', lang)}
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>

        {/* Добавляем гифку в футер */}
        <div className="flex justify-center mb-8 reveal-on-scroll">
          <img 
            src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
            alt="connexi.ai animated logo"
            className="max-w-xs md:max-w-sm lg:max-w-md h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-700 reveal-on-scroll">
          <p className={className?.includes('text-white') ? 'text-gray-400' : 'text-gray-600'}>
            © 2024 connexi.ai. {getTranslation('allRightsReserved', lang)}
          </p>
        </div>
      </div>

      {/* Background elements */}
      <div className="floating-element w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 top-20 -left-16 md:-left-32 lg:-left-48 opacity-10 md:opacity-20"></div>
      <div className="floating-element w-24 h-24 md:w-48 md:h-48 lg:w-80 lg:h-80 bottom-10 -right-12 md:-right-24 lg:-right-40 opacity-10 md:opacity-20"></div>
      
      <ContactPopup 
        isOpen={isContactPopupOpen}
        onClose={() => setIsContactPopupOpen(false)}
        title={getTranslation('contactUsTitle', lang)}
        lang={lang}
      />
    </footer>
  );
};

export default ContactsSection;
