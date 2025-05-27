
import React from "react";
import { Rocket } from "lucide-react";
import { Sparkles } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Lightbulb } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className }) => {
  return (
    <section className={`py-20 ${className}`}>
      <div className="absolute top-8 left-8 z-30">
        <span className="text-4xl md:text-5xl font-bold text-white/30">{"{ 02 }"} ПРО НАС</span>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 connexi-gradient-text">
              ПРО КОМПАНІЮ
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Ми — команда професіоналів, яка прагне надати вашому бізнесу
              інноваційні рішення на основі штучного інтелекту. Наша місія
              полягає в тому, щоб допомогти вам досягти нових висот,
              використовуючи передові технології та індивідуальний підхід.
            </p>

            <DisplayCards />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <Rocket className="text-connexi-orange h-8 w-8 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-white">
                ІННОВАЦІЇ
              </h3>
              <p className="text-gray-400">
                Постійно впроваджуємо новітні розробки в AI.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <Sparkles className="text-connexi-orange h-8 w-8 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-white">
                ЕФЕКТИВНІСТЬ
              </h3>
              <p className="text-gray-400">
                Оптимізуємо процеси для досягнення максимальних результатів.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <ShieldCheck className="text-connexi-orange h-8 w-8 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-white">
                НАДІЙНІСТЬ
              </h3>
              <p className="text-gray-400">
                Гарантуємо стабільність та безпеку ваших даних.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <Lightbulb className="text-connexi-orange h-8 w-8 mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-white">
                ЕКСПЕРТИЗА
              </h3>
              <p className="text-gray-400">
                Володіємо глибокими знаннями та багаторічним досвідом.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
