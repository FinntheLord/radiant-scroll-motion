
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import VideoBackgroundSection from "../components/VideoBackgroundSection";
import AssistantSection from "../components/AssistantSection";
import ServicesSection from "../components/ServicesSection";
import PartnersSection from "../components/PartnersSection";
import CasesSection from "../components/CasesSection";
import ContactsSection from "../components/ContactsSection";
import ScrollAnimation from "../components/ScrollAnimation";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "connexi.ai | AI-рішення для бізнесу в Україні";
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <ScrollAnimation />
      <Navbar />
      <HeroSection />
      <AboutSection className="bg-gray-900 text-white" />
      <VideoBackgroundSection />
      <AssistantSection className="bg-gray-900 text-white" />
      <ServicesSection className="bg-white text-gray-900" />
      <PartnersSection className="bg-gray-900 text-white" />
      <CasesSection className="bg-white text-gray-900" />
      <ContactsSection className="bg-gray-900 text-white" />
    </div>
  );
};

export default Index;
