
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import ScrollAnimation from "../components/ScrollAnimation";

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
      <AboutSection className="animated-bg text-white" />
      <ServicesSection className="animated-bg-light text-gray-900" />
      <PartnersSection className="animated-bg text-white" />
      <CasesSection className="animated-bg-light text-gray-900" />
      <ContactsSection className="animated-bg text-white" />
    </div>
  );
};

export default Index;
