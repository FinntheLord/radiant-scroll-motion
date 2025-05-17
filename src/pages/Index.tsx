
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import ScrollAnimation from "../components/ScrollAnimation";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "Ask IT | Системные ИТ-Решения";
  }, []);

  return (
    <BackgroundGradientAnimation
      containerClassName="min-h-screen w-full"
      gradientBackgroundStart="rgb(255, 255, 255)"
      gradientBackgroundEnd="rgb(248, 248, 248)"
      firstColor="14, 165, 233"  // blue
      secondColor="217, 70, 239"  // pink 
      thirdColor="139, 92, 246"  // purple
      fourthColor="249, 115, 22"  // orange
      fifthColor="180, 180, 180"  // light gray
      interactive={true}
      blendingValue="soft-light"
      size="100%"
      className="z-0"  // Добавлен z-индекс для контейнера градиента
    >
      <div className="min-h-screen bg-transparent text-gray-900 overflow-x-hidden relative z-10">
        <ScrollAnimation />
        <Navbar />
        <HeroSection />
        <AboutSection className="bg-gray-900 text-white" />
        <ServicesSection className="bg-white text-gray-900" />
        <PartnersSection className="bg-gray-900 text-white" />
        <CasesSection className="bg-white text-gray-900" />
        <ContactsSection className="bg-gray-900 text-white" />
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Index;
