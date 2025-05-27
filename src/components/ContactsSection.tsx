
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactsSection: React.FC = () => {
  return (
    <section id="contacts" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            КОНТАКТИ
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Готові розпочати ваш проект з штучним інтелектом? Зв'яжіться з нами
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-connexi-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Телефон</h3>
            <p className="text-gray-600">+38 (067) 200-26-75</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-connexi-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">hello@connexi.com.ua</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-connexi-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Адреса</h3>
            <p className="text-gray-600">Київ, Україна</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
