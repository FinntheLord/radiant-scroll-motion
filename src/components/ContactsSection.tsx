
import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const ContactsSection: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <footer className={`py-20 ${className} relative`}>
      <div className="absolute top-8 left-8 z-30">
        <span className="text-4xl md:text-5xl font-bold text-white/30">{"{ 08 }"} КОНТАКТИ</span>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold connexi-gradient-text mb-6">
              КОНТАКТНА ІНФОРМАЦІЯ
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="h-5 w-5 text-connexi-orange" />
                <span>+38 (067) 200-26-75</span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <Mail className="h-5 w-5 text-connexi-orange" />
                <span>info@connexi.ai</span>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-connexi-orange" />
                <span>
                  Україна, м. Київ
                  <br />
                  вул. Хрещатик, 1
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold connexi-gradient-text mb-6">
              НАВІГАЦІЯ
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-connexi-orange transition-colors">
                  ПРО НАС
                </a>
              </li>
              <li>
                <a href="#assistant" className="hover:text-connexi-orange transition-colors">
                  ПОМІЧНИК
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-connexi-orange transition-colors">
                  ПОСЛУГИ
                </a>
              </li>
              <li>
                <a href="#partners" className="hover:text-connexi-orange transition-colors">
                  ПАРТНЕРИ
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-connexi-orange transition-colors">
                  КЕЙСИ
                </a>
              </li>
              <li>
                <a href="#contacts" className="hover:text-connexi-orange transition-colors">
                  КОНТАКТИ
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold connexi-gradient-text mb-6">
              ПІДПИШІТЬСЯ НА НОВИНИ
            </h3>
            <p>
              Отримуйте останні новини та оновлення про наші AI-рішення.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-grow border-gray-700 bg-transparent text-white py-2 px-4 rounded-l-md focus:outline-none"
              />
              <button className="bg-connexi-orange text-white py-2 px-4 rounded-r-md hover:bg-connexi-pink transition-colors">
                Підписатися
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Connexi. Усі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ContactsSection;
