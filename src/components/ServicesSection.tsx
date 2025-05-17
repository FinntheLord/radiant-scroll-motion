
import React from "react";
import { MovingBorder } from "@/components/ui/moving-border";

interface ServicesSectionProps {
  className?: string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ className = "" }) => {
  const services = [
    {
      id: "01",
      title: "ПРОЕКТИРОВАНИЕ И РАЗРАБОТКА КОМПЛЕКСНЫХ ИТ ПРОЕКТОВ",
      description: "Проектирование, построение и сопровождение отказо - и катастрофоустойчивых распределенных высокопроизводительных ИТ-инфраструктур",
    },
    {
      id: "02",
      title: "ПРОЕКТИРОВАНИЕ И РАЗРАБОТКА КОМПЛЕКСНЫХ ИТ ПРОЕКТОВ",
      description: "Проектирование, внедрение и предоставление частных облаков по модели аренды на всех актуальных стеках виртуализации (KVM-based, VMware, Hyper-V, Xen), в том числе с использованием Российских продуктов "БРЕСТ", "РЕД Виртуализация", "Р-Виртуализация", "HOSTVM", "ROSA Virtualization", "vStack", "zVirt"",
    },
    {
      id: "03",
      title: "ПРОЕКТИРОВАНИЕ И РАЗРАБОТКА КОМПЛЕКСНЫХ ИТ ПРОЕКТОВ",
      description: "Проектирование, внедрение и сопровождение процессов непрерывной разработки (CI/CD) и тестирования программного обеспечения с использованием контейнеризованных подходов упаковки и оркестрации ПО, автоматизированного тестирования и обеспечения непрерывного обновления продуктивных сред",
    }
  ];

  return (
    <section id="services" className={`min-h-screen relative py-20 ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">{ "{ 01 }" } УСЛУГИ</div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-gray-800">КОМПЛЕКСНО </span>
            <span className="connexi-gradient-text">РЕШАЕМ<br />ЗАДАЧИ</span>
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
