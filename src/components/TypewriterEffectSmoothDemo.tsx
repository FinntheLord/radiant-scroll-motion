
"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "СИСТЕМНЫЕ",
    },
    {
      text: "ИТ",
      className: "connexi-gradient-text",
    },
    {
      text: "—",
    },
    {
      text: "РЕШЕНИЯ",
    },
  ];
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base mb-4">
        ПРОЕКТИРУЕМ
      </p>
      <TypewriterEffectSmooth 
        words={words} 
        cursorClassName="bg-connexi-gradient"
      />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-8">
        <a href="#services">
          <button className="contact-button px-8 py-3 rounded-full transition-all">
            НАШИ УСЛУГИ
          </button>
        </a>
      </div>
    </div>
  );
}
