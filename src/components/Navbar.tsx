
import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-sm shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="/" className="font-bold text-2xl connexi-gradient-text">
          connexi.ai
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-700 hover:text-black transition-colors">
            ПРО НАС
          </a>
          <a href="#services" className="text-gray-700 hover:text-black transition-colors">
            ПОСЛУГИ
          </a>
          <a href="#partners" className="text-gray-700 hover:text-black transition-colors">
            ПАРТНЕРИ
          </a>
          <a href="#cases" className="text-gray-700 hover:text-black transition-colors">
            КЕЙСИ
          </a>
          <a href="#contacts" className="text-gray-700 hover:text-black transition-colors">
            КОНТАКТИ
          </a>
          <div className="flex items-center">
            <span className="connexi-gradient-text inline-flex items-center mr-4">
              +38 (067) 123-45-67
            </span>
            <Button 
              className="contact-button"
              size="sm"
            >
              Зв'язатися
              <Phone className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </nav>
        
        <Button className="md:hidden contact-button">
          <Phone className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
