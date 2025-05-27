
import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConsultationChat from "./ConsultationChat";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-sm shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b4617c09-81f1-4ed3-b38c-a1e477cc3b4a.png" 
              alt="connexi.ai logo" 
              className="h-10 md:h-12"
            />
          </a>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-black transition-colors">
              ПРО НАС
            </a>
            <a href="#assistant" className="text-gray-700 hover:text-black transition-colors">
              ПОМІЧНИК
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
            <Button 
              className="contact-button"
              size="sm"
              onClick={() => setIsChatOpen(true)}
            >
              Консультація
              <MessageCircle className="ml-2 h-4 w-4" />
            </Button>
          </nav>
          
          <Button 
            className="md:hidden contact-button"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ConsultationChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
};

export default Navbar;
