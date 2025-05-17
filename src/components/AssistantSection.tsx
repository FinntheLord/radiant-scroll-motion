
import React, { useState, FormEvent, useRef, useEffect } from "react";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";

interface AssistantSectionProps {
  className?: string;
}

const initialMessages = [
  {
    id: 1,
    content: "Привіт! Я AI-помічник Connexi. Як я можу вам допомогти сьогодні?",
    sender: "ai",
  },
];

const AssistantSection: React.FC<AssistantSectionProps> = ({ className = "" }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: input,
        sender: "user",
      },
    ]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: getAiResponse(input),
          sender: "ai",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const getAiResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    if (userInputLower.includes("послуги") || userInputLower.includes("сервіси")) {
      return "Ми пропонуємо широкий спектр послуг з впровадження AI, включаючи розробку індивідуальних моделей, інтеграцію AI в існуючі бізнес-процеси та автоматизацію рутинних завдань.";
    } else if (userInputLower.includes("ціни") || userInputLower.includes("вартість")) {
      return "Вартість наших послуг залежить від складності проекту. Ми пропонуємо індивідуальний підхід до кожного клієнта. Зв'яжіться з нами для отримання детальної консультації.";
    } else if (userInputLower.includes("контакти") || userInputLower.includes("зв'язатися")) {
      return "Ви можете зв'язатися з нами за телефоном +38 (067) 123-45-67 або заповнивши форму зворотного зв'язку в розділі 'Контакти'.";
    } else if (userInputLower.includes("привіт") || userInputLower.includes("доброго дня")) {
      return "Вітаю! Чим я можу вам допомогти сьогодні?";
    } else {
      return "Дякую за ваше запитання! Наша команда експертів готова допомогти вам впровадити AI-рішення для оптимізації вашого бізнесу. Розкажіть більше про ваші потреби або перегляньте розділ послуг для додаткової інформації.";
    }
  };

  const handleAttachFile = () => {
    // Functionality would be implemented here
    console.log("Attach file clicked");
  };

  const handleMicrophoneClick = () => {
    // Functionality would be implemented here
    console.log("Microphone clicked");
  };

  return (
    <section id="assistant" className={`min-h-screen py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-orange-500 text-xl mb-6 reveal-on-scroll">
          {"{03}"} ПОМІЧНИК
        </div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 text-center reveal-on-scroll">
            <span className="text-white">ОЗНАЙОМСЯ З НАШИМ </span>
            <span className="connexi-gradient-text">ПОМІЧНИКОМ</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal-on-scroll">
              <p className="text-lg text-white/80 mb-6">
                Наш AI-асистент готовий відповісти на ваші запитання про наші послуги, допомогти з
                підбором оптимального рішення для вашого бізнесу та надати інформацію про впровадження
                штучного інтелекту.
              </p>
              <p className="text-lg text-white/80 mb-6">
                Спробуйте задати питання прямо зараз і переконайтеся в ефективності AI-технологій,
                які ми пропонуємо для вашого бізнесу.
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 pl-4">
                <li>Дізнайтеся більше про наші послуги</li>
                <li>Отримайте попередню консультацію щодо впровадження AI</li>
                <li>Задайте питання про терміни реалізації проектів</li>
                <li>Дізнайтеся про вартість послуг</li>
              </ul>
            </div>
            
            <div className="h-[500px] border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-lg flex flex-col overflow-hidden shadow-xl reveal-on-scroll">
              <div className="flex items-center gap-2 p-3 border-b border-gray-800">
                <div className="size-3 rounded-full bg-red-500"></div>
                <div className="size-3 rounded-full bg-yellow-500"></div>
                <div className="size-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-sm font-medium text-white/70">Connexi AI Assistant</div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ChatMessageList>
                  {messages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      variant={message.sender === "user" ? "sent" : "received"}
                    >
                      <ChatBubbleAvatar
                        className="h-8 w-8 shrink-0"
                        src={message.sender === "user" ? undefined : "/lovable-uploads/b4617c09-81f1-4ed3-b38c-a1e477cc3b4a.png"}
                        fallback={message.sender === "user" ? "Ви" : "AI"}
                      />
                      <ChatBubbleMessage
                        variant={message.sender === "user" ? "sent" : "received"}
                        className={message.sender === "received" ? "bg-gray-800" : ""}
                      >
                        {message.content}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}

                  {isLoading && (
                    <ChatBubble variant="received">
                      <ChatBubbleAvatar
                        className="h-8 w-8 shrink-0"
                        src="/lovable-uploads/b4617c09-81f1-4ed3-b38c-a1e477cc3b4a.png"
                        fallback="AI"
                      />
                      <ChatBubbleMessage isLoading />
                    </ChatBubble>
                  )}
                </ChatMessageList>
              </div>

              <div className="p-4 border-t border-gray-800">
                <form
                  onSubmit={handleSubmit}
                  className="relative rounded-lg border border-gray-700 bg-gray-800/50 focus-within:ring-1 focus-within:ring-connexi-orange p-1"
                >
                  <ChatInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введіть ваше повідомлення..."
                    className="min-h-12 resize-none rounded-lg bg-transparent border-0 p-3 shadow-none focus-visible:ring-0 text-white"
                  />
                  <div className="flex items-center p-3 pt-0 justify-between">
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleAttachFile}
                        className="text-gray-400 hover:text-white"
                      >
                        <Paperclip className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleMicrophoneClick}
                        className="text-gray-400 hover:text-white"
                      >
                        <Mic className="size-4" />
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="contact-button ml-auto gap-1.5"
                    >
                      Відправити
                      <CornerDownLeft className="size-3.5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
