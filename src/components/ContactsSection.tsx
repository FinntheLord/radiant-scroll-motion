
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Phone, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { toast } from "sonner";
import { Language, getTranslation } from "../lib/translations";

interface ContactsSectionProps {
  className?: string;
  lang: Language;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const ContactsSection: React.FC<ContactsSectionProps> = ({
  className = "",
  lang
}) => {
  const initialMessages: Message[] = [{
    id: 1,
    content: "Чем я могу помочь?",
    sender: "ai"
  }];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to send message to OpenAI API (similar to AssistantSection)
  const sendMessageToOpenAI = async (userMessage: string): Promise<string> => {
    try {
      const systemPrompt = lang === 'en'
        ? "You are Connexi information bot. Your goal is to collect contact information from potential clients and basic information about their needs. Ask about company name, contact person, phone, email and brief task description. Respond briefly in English. Offer specific AI integration services depending on client requests."
        : "Ти інформаційний бот Connexi. Твоя мета — зібрати контактну інформацію потенційних клієнтів та базову інформацію про їхні потреби. Запитуй про назву компанії, контактну особу, телефон, email та коротке пояснення завдання. Відповідай коротко, українською мовою. Пропонуй конкретні послуги AI-інтеграції залежно від запитів клієнта.";

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: systemPrompt
          }, ...messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content
          })), {
            role: "user",
            content: userMessage
          }],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: userMessage,
      sender: "user"
    }]);
    setInput("");
    setIsLoading(true);
    try {
      // Get response from OpenAI
      const aiResponse = await sendMessageToOpenAI(userMessage);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: aiResponse,
        sender: "ai"
      }]);

      // Check if the message contains contact information and thank the user
      if (userMessage.includes("@") || /\d{3,}/.test(userMessage) || userMessage.length > 100) {
        toast.success(lang === 'en' 
          ? "Thank you for the information! Our manager will contact you soon."
          : "Дякуємо за інформацію! Наш менеджер зв'яжеться з вами найближчим часом."
        );
      }
    } catch (error) {
      toast.error(lang === 'en' 
        ? "Failed to get response. Please try again later."
        : "Не вдалося отримати відповідь. Спробуйте ще раз пізніше."
      );
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contacts" className={`py-20 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
          {getTranslation('contactsSubtitle', lang)}
        </div>
        
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            {getTranslation('contactsTitle1', lang)}
          </h2>
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
            {getTranslation('contactsTitle2', lang)}
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-connexi-orange">
            {getTranslation('contactsTitle3', lang)}
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-connexi-orange">
            {getTranslation('contactsTitle4', lang)}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 reveal-on-scroll">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-center">
              <a href="/" className="flex items-center mb-4">
                <img 
                  alt="connexi.ai logo" 
                  className="h-20 md:h-24" 
                  src="/lovable-uploads/0c823db9-7ce3-4eec-95d5-7f195348151d.png" 
                />
              </a>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'en' ? 'Contacts:' : 'Контакти:'}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="text-connexi-orange" size={20} />
                <a href="mailto:info@connexi.ai" className={`hover:text-connexi-orange transition-colors ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
                  info@connexi.ai
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="text-connexi-orange" size={20} />
                <a href="tel:+380672002675" className={`hover:text-connexi-orange transition-colors ${className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}`}>
                  +38 (067) 200-26-75
                </a>
              </div>
            </div>
            
            <div>
              <h3 className={`text-xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'en' ? 'Address:' : 'Адреса:'}
              </h3>
              <div className="flex items-start space-x-2">
                <MapPin className="text-connexi-orange mt-1" size={20} />
                <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}>
                  {lang === 'en' ? 'Dnipro, Robochaya, 23K' : 'Дніпро, Рабочая, 23К'}
                </p>
              </div>
            </div>

            <div>
              <h3 className={`text-xl font-bold mb-4 ${className?.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'en' ? 'Leave your contacts:' : 'Залиште свої контакти:'}
              </h3>
              <p className={className?.includes('text-white') ? 'text-gray-300' : 'text-gray-600'}>
                {lang === 'en'
                  ? 'Use our chatbot to leave your contact details and request. We will contact you within the business day to discuss cooperation details.'
                  : 'Скористайтеся нашим чат-ботом, щоб залишити свої контактні дані та запит. Ми зв\'яжемося з вами протягом робочого дня для обговорення деталей співпраці.'
                }
              </p>
            </div>
          </div>
          
          {/* Chat Bot - переделанный в стиле скриншота */}
          <div className="bg-gray-800 rounded-lg h-[500px] flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 p-3 border-b border-gray-700">
              <div className="size-3 rounded-full bg-red-500"></div>
              <div className="size-3 rounded-full bg-yellow-500"></div>
              <div className="size-3 rounded-full bg-green-500"></div>
              <div className="ml-2 text-sm font-medium text-gray-200 flex items-center gap-2">
                <img
                  src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                  alt="AI Animation"
                  className="h-4 w-4 rounded opacity-90"
                />
                Connexi Info Bot
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ChatMessageList>
                {messages.map(message => (
                  <ChatBubble key={message.id} variant={message.sender === "user" ? "sent" : "received"}>
                    {message.sender === "ai" && (
                      <ChatBubbleAvatar 
                        src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8" 
                        fallback="AI"
                      />
                    )}
                    <ChatBubbleMessage variant={message.sender === "user" ? "sent" : "received"}>
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar 
                      src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8" 
                      fallback="AI" 
                    />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </div>

            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-end gap-2 bg-gray-700 rounded-3xl px-4 py-2 focus-within:ring-1 focus-within:ring-blue-500">
                  <ChatInput 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Спросите что-нибудь..."
                    className="flex-1 bg-transparent border-0 focus:ring-0 resize-none"
                    onSend={handleSubmit}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0"
                    disabled={isLoading || !input.trim()}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
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
