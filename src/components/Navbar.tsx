import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimpleChatContext } from "@/contexts/SimpleChatContext";
import { Language, getTranslation } from "../lib/translations";

interface NavbarProps {
  lang: Language;
}

const Navbar: React.FC<NavbarProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openChat } = useSimpleChatContext();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { href: "#about", labelKey: "aboutUs" as const },
    { href: "#assistant", labelKey: "aiAssistant" as const },
    { href: "#services", labelKey: "services" as const },
    { href: "#cases", labelKey: "cases" as const },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="text-2xl md:text-3xl font-bold">
            <span className="text-white">connexi</span>
            <span className="text-connexi-orange">.ai</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-lg font-medium"
              >
                {getTranslation(item.labelKey, lang)}
              </a>
            ))}
            
            <Button 
              onClick={openChat}
              className="contact-button ml-4"
            >
              {getTranslation('consultation', lang)}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-gray-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-96 opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}>
          <div className="py-4 space-y-3 bg-gray-900/95 backdrop-blur-md rounded-lg mt-2 border border-gray-800">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {getTranslation(item.labelKey, lang)}
              </a>
            ))}
            
            <div className="px-6 py-3">
              <Button 
                onClick={() => {
                  openChat();
                  setIsOpen(false);
                }}
                className="contact-button w-full"
              >
                {getTranslation('consultation', lang)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
