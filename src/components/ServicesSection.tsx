import React from "react";
import { MovingBorder } from "@/components/ui/moving-border";

interface ServicesSectionProps {
  className?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "" }) => {
  const services = [
    {
      id: "01",
      title: "ПІДТРИМКА КЛІЄНТІВ І АВТОМАТИЗАЦІЯ",
      description: "Створення чат-ботів та голосових асистентів для підтримки клієнтів, а також автоматизація рутинних завдань і документообігу для підвищення ефективності бізнес-процесів",
    },
    {
      id: "02",
      title: "АНАЛІЗ ДАНИХ І ПЕРСОНАЛІЗАЦІЯ",
      description: "Обробка та аналіз великих даних для отримання цінних інсайтів, персоналізація маркетингу та пропозицій, прогнозування попиту та продажів на основі штучного інтелекту",
    },
    {
      id: "03",
      title: "ОПТИМІЗАЦІЯ БІЗНЕС-ПРОЦЕСІВ",
      description: "Виявлення ризиків і шахрайства, оптимізація логістики та управління запасами, підбір і навчання персоналу, моніторинг виробничих процесів та автоматизація звітності у фінансах",
    }
  ];

  return (
    <section id="services" className={`min-h-screen relative py-20 ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">{"{03}"} ПОСЛУГИ</div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-gray-800">КОМПЛЕКСНО </span>
            <span className="connexi-gradient-text">ВИРІШУЄМО<br />ЗАВДАННЯ</span>
          </h2>

          <div className="space-y-12 mt-16">
            {services.map((service) => (
              <div key={service.id} className="reveal-on-scroll">
                <div className="relative p-[1px] rounded-md overflow-hidden">
                  <MovingBorder duration={3000} rx="0.5rem" ry="0.5rem">
                    <div className="h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--connexi-orange)_40%,var(--connexi-pink)_60%,transparent_85%)]" />
                  </MovingBorder>
                
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-md p-6 z-10 border-l-4 border-connexi-orange">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-gray-400">{ `{ ${service.id} }` }</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/2">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                          {service.title.split(" ").map((word, i) => (
                            <span key={i} className={i >= 3 ? "text-connexi-orange" : ""}>
                              {word}{" "}
                            </span>
                          ))}
                        </h3>
                      </div>
                      <div className="md:w-1/2">
                        <p className="text-gray-700">{service.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
