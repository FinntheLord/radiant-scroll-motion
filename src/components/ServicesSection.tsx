
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesSection: React.FC = () => {
  useEffect(() => {
    // Add animated background elements
    const section = document.getElementById('services');
    if (section) {
      for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element floating';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.width = `${Math.random() * 100 + 50}px`;
        element.style.height = `${Math.random() * 100 + 50}px`;
        element.style.opacity = `${Math.random() * 0.15 + 0.02}`;
        section.appendChild(element);
      }
    }
  }, []);

  return (
    <section id="services" className="min-h-screen relative bg-dark-darker py-20 animated-bg">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-orange text-xl mb-6 reveal-on-scroll">{`{01}`} УСЛУГИ</div>
        
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-gray-200">ПРОЕКТИРОВАНИЕ<br />И РАЗРАБОТКА </span>
            <span className="orange-highlight">КОМПЛЕКСНЫХ<br />ИТ ПРОЕКТОВ</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto mt-10 space-y-12">
          {/* Service Item 1 */}
          <div className="flex flex-col md:flex-row gap-6 items-start reveal-on-scroll">
            <div className="text-orange font-medium w-20 text-xl">{`{01}`}</div>
            <div className="flex-1">
              <Card className="bg-dark-lighter border-none rounded-lg p-2 card-hover">
                <CardContent className="p-6">
                  <p className="text-gray-300">
                    Проектирование, построение и сопровождение отказо - и 
                    катастрофоустойчивых распределенных высокопроизводительных 
                    ИТ-инфраструктур
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Item 2 */}
          <div className="flex flex-col md:flex-row gap-6 items-start reveal-on-scroll" style={{ animationDelay: "0.2s" }}>
            <div className="text-orange font-medium w-20 text-xl">{`{02}`}</div>
            <div className="flex-1">
              <Card className="bg-dark-lighter border-none rounded-lg p-2 card-hover">
                <CardContent className="p-6">
                  <p className="text-gray-300">
                    Проектирование, внедрение и предоставление частных облаков по 
                    модели аренды на всех актуальных стеках виртуализации ( KVM-
                    based, VMware, Hyper-V, Xen ), в том числе с использованием 
                    Российских продуктов "БРЕСТ", "РЕД Виртуализация", "Р-
                    Виртуализация", "HOSTVM", "ROSA Virtualization", "vStack", "zVirt"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Item 3 */}
          <div className="flex flex-col md:flex-row gap-6 items-start reveal-on-scroll" style={{ animationDelay: "0.4s" }}>
            <div className="text-orange font-medium w-20 text-xl">{`{03}`}</div>
            <div className="flex-1">
              <Card className="bg-dark-lighter border-none rounded-lg p-2 card-hover">
                <CardContent className="p-6">
                  <p className="text-gray-300">
                    Проектирование, внедрение и сопровождение процессов 
                    непрерывной разработки (CI/CD) и тестирования программного 
                    обеспечения с использованием контейнеризованных подходов
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
