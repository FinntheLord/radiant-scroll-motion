
import React, { useState, FormEvent, useEffect } from "react";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { toast } from "@/hooks/use-toast";

interface AssistantSectionProps {
  className?: string;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const initialMessages = [
  {
    id: 1,
    content: "Привіт! Я AI-помічник Connexi. Як я можу вам допомогти сьогодні?",
    sender: "ai",
  },
];

// OpenAI API configuration
const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const AssistantSection: React.FC<AssistantSectionProps> = ({ className = "" }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to send message to OpenAI API
  const sendMessageToOpenAI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Ти AI-помічник Connexi, який допомагає клієнтам дізнатися про послуги компанії з впровадження AI-рішень. Відповідай коротко, україньскою мовою. Надавай конкретну інформацію про послуги Connexi з впровадження AI, наші контакти, та як ми можемо допомогти. Намагайся відповідати дружньо та професійно."
            },
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content
            })),
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = input.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: userMessage,
        sender: "user",
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      // Get response from OpenAI
      const aiResponse = await sendMessageToOpenAI(userMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: aiResponse,
          sender: "ai",
        },
      ]);
    } catch (error) {
      toast({
        title: "Помилка",
        description: "Не вдалося отримати відповідь від AI. Спробуйте ще раз пізніше.",
        variant: "destructive",
      });
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
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
                        src={message.sender === "user" ? "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png" : "/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png"}
                        fallback={message.sender === "user" ? "Ви" : "AI"}
                      />
                      <ChatBubbleMessage
                        variant={message.sender === "user" ? "sent" : "received"}
                      >
                        {message.content}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}

                  {isLoading && (
                    <ChatBubble variant="received">
                      <ChatBubbleAvatar
                        className="h-8 w-8 shrink-0"
                        src="/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png"
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
                    <div className="flex"></div>
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="contact-button ml-auto gap-1.5"
                      disabled={isLoading}
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
