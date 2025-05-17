
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import ScrollAnimation from "../components/ScrollAnimation";
import { BackgroundGradientAnimationDemo } from "@/components/ui/demo";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "Ask IT | Системные ИТ-Решения";
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <ScrollAnimation />
      <Navbar />
      <HeroSection />
      <AboutSection className="bg-gray-900 text-white" />
      <ServicesSection className="bg-white text-gray-900" />
      <PartnersSection className="bg-gray-900 text-white" />
      <CasesSection className="bg-white text-gray-900" />
      <ContactsSection className="bg-gray-900 text-white" />
      
      {/* More sections will be added here */}
    </div>
  );
};

export default Index;
