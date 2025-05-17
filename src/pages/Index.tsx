import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import ScrollAnimation from "../components/ScrollAnimation";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "Ask IT | Системные ИТ-Решения";
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <ScrollAnimation />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      
      {/* More sections will be added here */}
    </div>
  );
};

export default Index;
