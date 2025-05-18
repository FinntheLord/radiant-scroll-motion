
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContactsSectionProps {
  className?: string;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({ className = "" }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const handleSubmit = async (data: any) => {
    if (!isAgreed) {
      toast.error("Будь ласка, прийміть політику конфіденційності");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success("Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.");
    form.reset();
    setIsAgreed(false);
  };

  return (
    <section id="contacts" className={`py-20 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-4 reveal-on-scroll flex items-center">
          <span className="text-connexi-orange font-bold mr-2">04</span>
          <h2 className="text-2xl font-bold text-connexi-orange">КОНТАКТИ</h2>
        </div>
        
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            ПРОКОНСУЛЬТУЄМО
          </h2>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            ТА РОЗРАХУЄМО
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-connexi-orange">
            ВІД ЗАВДАННЯ ДО
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-connexi-orange">
            РІШЕННЯ ОДИН КРОК — JUST ASK AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 reveal-on-scroll">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className={`text-xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>ТОВ "КОННЕКСІ АІ"</h3>
              <p className={className?.includes('text-white') ? 'text-gray-400' : 'text-gray-600 mb-2'}>
                Юридична адреса: 01001, м. Київ, вул. Хрещатик, 1, офіс 205
              </p>
              <p className={className?.includes('text-white') ? 'text-gray-400' : 'text-gray-600'}>
                ЄДРПОУ 12345678
              </p>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>Контакти:</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="text-connexi-orange" size={20} />
                <a href="mailto:info@connexi.ai" className={`hover:text-connexi-orange transition-colors ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
                  info@connexi.ai
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-connexi-orange" size={20} />
                <a href="tel:+380999191191" className={`hover:text-connexi-orange transition-colors ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
                  +380999191191
                </a>
              </div>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>Адреса:</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="text-connexi-orange mt-1" size={20} />
                <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}>
                  Київ, Хрещатик, 1, офіс 205
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className={`p-6 rounded-lg ${className?.includes('bg-gray-900') ? 'bg-gray-800 bg-opacity-40' : 'bg-gray-50'}`}>
            <p className={className?.includes('text-white') ? 'text-gray-300 mb-6' : 'text-gray-600 mb-6'}>
              Ми зв'яжемося з вами протягом робочого дня для обговорення деталей. Вартісна оцінка здійснюється за індивідуальними умовами.
            </p>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <Input 
                placeholder="Ваше ім'я" 
                className={`focus:border-connexi-orange ${className?.includes('bg-gray-900') ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`} 
                {...form.register("name", { required: true })}
              />
              
              <Input 
                placeholder="Компанія" 
                className={`focus:border-connexi-orange ${className?.includes('bg-gray-900') ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`} 
                {...form.register("company")}
              />
              
              <Input 
                type="email" 
                placeholder="Пошта" 
                className={`focus:border-connexi-orange ${className?.includes('bg-gray-900') ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`} 
                {...form.register("email", { required: true })}
              />
              
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 text-gray-500">
                  <span className="flex items-center justify-center h-10">+38</span>
                </div>
                <Input
                  type="tel"
                  placeholder="(067) 123-45-67"
                  className={`focus:border-connexi-orange ml-2 ${className?.includes('bg-gray-900') ? 'bg-transparent border-gray-700' : 'bg-white border-gray-300'}`}
                  {...form.register("phone", { required: true })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="privacy-policy" 
                  className={`rounded focus:ring-connexi-orange ${className?.includes('bg-gray-900') ? 'border-gray-700 text-connexi-orange' : 'border-gray-300'}`}
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <label htmlFor="privacy-policy" className={`text-sm ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
                  Погоджуюсь з <a href="#" className="text-connexi-orange underline">політикою конфіденційності</a>
                </label>
              </div>
              
              <Button 
                type="submit"
                className="contact-button w-full flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "ВІДПРАВКА..." : "НАДІСЛАТИ"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="floating-element w-96 h-96 top-20 -left-48 opacity-20"></div>
      <div className="floating-element w-80 h-80 bottom-10 -right-40 opacity-20"></div>
    </section>
  );
};

export default ContactsSection;
