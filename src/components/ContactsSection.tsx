
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactsSectionProps {
  className?: string;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ className = "" }) => {
  return (
    <section id="contacts" className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            КОНТАКТИ
          </h2>
          <p className={`max-w-2xl mx-auto ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
            Готові розпочати ваш проект з штучним інтелектом? Зв'яжіться з нами
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-connexi-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>Телефон</h3>
            <p className={`${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>+38 (067) 200-26-75</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-connexi-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>Email</h3>
            <p className={`${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>hello@connexi.com.ua</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-connexi-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>Адреса</h3>
            <p className={`${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>Київ, Україна</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
