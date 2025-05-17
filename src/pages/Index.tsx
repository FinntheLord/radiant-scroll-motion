
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
      gradientClassName="opacity-30"
    >
      <div className="min-h-screen bg-transparent text-gray-900 overflow-x-hidden">
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
