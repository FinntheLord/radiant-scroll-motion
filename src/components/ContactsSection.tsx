
import React, { useState } from "react";
import { Language, getTranslation } from "../lib/translations";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import ContactPopup from "./ContactPopup";
import { useSiteChat } from "../contexts/SiteChatContext";

interface ContactsSectionProps {
  lang: Language;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ lang }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { openChat } = useSiteChat();

  return (
    <section id="contacts" className="py-20 bg-gray-100 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
            {getTranslation('contactsSubtitle', lang)}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 reveal-on-scroll">
            {getTranslation('contactsTitle', lang)}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 reveal-on-scroll">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getTranslation('contactsPhoneTitle', lang)}
                </h3>
                <p className="text-gray-600">+380 98 765 4321</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getTranslation('contactsEmailTitle', lang)}
                </h3>
                <p className="text-gray-600">info@connexi.ai</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getTranslation('contactsAddressTitle', lang)}
                </h3>
                <p className="text-gray-600">
                  {getTranslation('contactsAddressText', lang)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {getTranslation('contactsChatTitle', lang)}
                </h3>
                <p className="text-gray-600 mb-3">
                  {getTranslation('contactsChatText', lang)}
                </p>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  onClick={openChat}
                >
                  {lang === 'uk' ? 'Почати чат' : 'Start Chat'}
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg reveal-on-scroll">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {getTranslation('contactsFormTitle', lang)}
            </h3>
            
            <form className="space-y-6">
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={getTranslation('contactName', lang)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
                
                <input 
                  type="tel" 
                  placeholder={getTranslation('contactPhone', lang)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
                
                <input 
                  type="email" 
                  placeholder={getTranslation('contactEmail', lang)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
                
                <textarea 
                  rows={4} 
                  placeholder={getTranslation('contactMessage', lang)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors resize-none"
                />
              </div>
              
              <Button 
                type="button" 
                onClick={() => setIsPopupOpen(true)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                {getTranslation('contactSend', lang)}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <ContactPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)}
        lang={lang}
      />
    </section>
  );
};

export default ContactsSection;
