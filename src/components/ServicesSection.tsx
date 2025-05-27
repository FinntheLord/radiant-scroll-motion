import React from "react";
import { Lightbulb, Rocket, ShieldCheck } from "lucide-react";

const ServicesSection: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <section className={`py-20 ${className} relative`}>
      <div className="absolute top-8 left-8 z-30">
        <span className="text-4xl md:text-5xl font-bold text-gray-400">{ 05 } ПОСЛУГИ</span>
      </div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Наші Послуги
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-6 w-6 mr-2 text-connexi-orange" />
              <h3 className="text-xl font-semibold">Розробка AI-рішень</h3>
            </div>
            <p className="text-gray-700">
              Створення індивідуальних AI-рішень для автоматизації бізнес-процесів,
              аналізу даних та покращення взаємодії з клієнтами.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <Rocket className="h-6 w-6 mr-2 text-connexi-orange" />
              <h3 className="text-xl font-semibold">Впровадження AI</h3>
            </div>
            <p className="text-gray-700">
              Інтеграція штучного інтелекту в існуючі системи для підвищення
              ефективності, зниження витрат та забезпечення конкурентних переваг.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-6 w-6 mr-2 text-connexi-orange" />
              <h3 className="text-xl font-semibold">Консалтинг з AI</h3>
            </div>
            <p className="text-gray-700">
              Надання експертних консультацій з питань використання штучного
              інтелекту для досягнення стратегічних цілей бізнесу.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
