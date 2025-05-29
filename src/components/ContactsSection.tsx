import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ContactPopup from './ContactPopup';
import { Language, getTranslation } from '../lib/translations';

interface ContactsSectionProps {
  lang: Language;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ lang }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section id="contacts" className="contacts-section py-20 bg-gray-50">
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 connexi-gradient-text">
              {getTranslation('contactsTitle', lang)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getTranslation('contactsSubtitle', lang)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-connexi-orange/10 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-connexi-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{getTranslation('phone', lang)}</h3>
                  <p className="text-gray-600">+380 63 123 45 67</p>
                  <p className="text-gray-600">+380 50 987 65 43</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-connexi-pink/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-connexi-pink" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{getTranslation('email', lang)}</h3>
                  <p className="text-gray-600">info@connexi.ai</p>
                  <p className="text-gray-600">support@connexi.ai</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-connexi-purple/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-connexi-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{getTranslation('address', lang)}</h3>
                  <p className="text-gray-600">
                    {getTranslation('addressLine1', lang)}<br />
                    {getTranslation('addressLine2', lang)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-connexi-blue/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-connexi-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{getTranslation('workingHours', lang)}</h3>
                  <p className="text-gray-600">
                    {getTranslation('workingHoursWeekdays', lang)}<br />
                    {getTranslation('workingHoursWeekends', lang)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">{getTranslation('quickContact', lang)}</h3>
              <Button 
                className="contact-button w-full"
                onClick={() => setIsContactOpen(true)}
              >
                {getTranslation('openContactForm', lang)}
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img 
                src="/lovable-uploads/09862013-fb91-4cc9-a2fc-8db3f0a33759.png" 
                alt="connexi.ai logo" 
                className="h-13 md:h-16 mb-6 brightness-0 invert"
              />
              <p className="text-gray-400 max-w-md">
                {getTranslation('footerDescription', lang)}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{getTranslation('quickLinks', lang)}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">{getTranslation('about', lang)}</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">{getTranslation('services', lang)}</a></li>
                <li><a href="#cases" className="hover:text-white transition-colors">{getTranslation('cases', lang)}</a></li>
                <li><a href="#contacts" className="hover:text-white transition-colors">{getTranslation('contacts', lang)}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{getTranslation('contactInfo', lang)}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+380 63 123 45 67</li>
                <li>info@connexi.ai</li>
                <li>
                  {getTranslation('addressLine1', lang)}<br />
                  {getTranslation('addressLine2', lang)}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Connexi.ai. {getTranslation('allRightsReserved', lang)}</p>
          </div>
        </div>
      </footer>

      <ContactPopup 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)}
        lang={lang}
      />
    </>
  );
};

export default ContactsSection;
