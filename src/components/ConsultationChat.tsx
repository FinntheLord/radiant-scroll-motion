
import React, { useState, FormEvent } from "react";
import { CornerDownLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { toast } from "@/hooks/use-toast";
import { Language, getTranslation } from "../lib/translations";

interface ConsultationChatProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

interface UserInfo {
  name: string;
  phone: string;
}

const ConsultationChat: React.FC<ConsultationChatProps> = ({ isOpen, onClose, lang }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", phone: "" });
  const [isInfoCollected, setIsInfoCollected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OpenAI API configuration
  const OPENAI_API_KEY = "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";
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

  const sendMessageToOpenAI = async (userMessage: string): Promise<string> => {
    try {
      const systemPrompt = lang === 'en' 
        ? `You are a consultant for Connexi - a technology company that specializes in implementing artificial intelligence in business processes. The client's name is ${userInfo.name}, their phone is ${userInfo.phone}. Respond professionally and friendly in English. Our services: developing chatbots and voice assistants, automating routine tasks, data analysis, marketing personalization, sales forecasting, fraud detection, logistics optimization, staff recruitment and reporting automation. Offer specific solutions according to client needs.`
        : `Ти консультант компанії Connexi - технологічної компанії, що спеціалізується на впровадженні штучного інтелекту в бізнес-процеси. Клієнта звати ${userInfo.name}, його телефон ${userInfo.phone}. Відповідай професійно та дружньо українською мовою. Наші послуги: розробка чат-ботів та голосових асистентів, автоматизація рутинних завдань, аналіз даних, персоналізація маркетингу, прогнозування продажів, виявлення шахрайства, оптимізація логістики, підбір персоналу та автоматизація звітності. Пропонуй конкретні рішення відповідно до потреб клієнта.`;

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
              content: systemPrompt
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
        throw new Error("API Error");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  };

  const handleInfoSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userInfo.name.trim() || !userInfo.phone.trim()) {
      toast({
        title: getTranslation('contactError', lang),
        description: getTranslation('contactErrorDescription', lang),
        variant: "destructive",
      });
      return;
    }

    setIsInfoCollected(true);
    const welcomeMessage = lang === 'en' 
      ? `Hello, ${userInfo.name}! Thank you for your contact details. How can I help you with AI implementation for your business?`
      : `Привіт, ${userInfo.name}! Дякую за контактні дані. Чим можу допомогти з впровадженням AI у ваш бізнес?`;
    
    setMessages([
      {
        id: 1,
        content: welcomeMessage,
        sender: "ai",
      },
    ]);
  };

  const handleMessageSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
        title: getTranslation('contactError', lang),
        description: lang === 'en' ? "Failed to get response. Please try again." : "Не вдалося отримати відповідь. Спробуйте ще раз.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setUserInfo({ name: "", phone: "" });
    setIsInfoCollected(false);
    setMessages([]);
    setInput("");
  };

  const handleClose = () => {
    resetChat();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md h-[500px] p-0 overflow-hidden border-0 shadow-2xl">
        <DialogHeader className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <img
              src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
              alt="AI Animation"
              className="h-5 w-5 rounded opacity-90"
            />
            {lang === 'en' ? 'AI Consultation' : 'Консультація AI'}
          </DialogTitle>
        </DialogHeader>

        {!isInfoCollected ? (
          <div className="p-6 flex flex-col justify-center h-full bg-white">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                  alt="AI Animation"
                  className="h-8 w-8 rounded opacity-90"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {lang === 'en' ? 'Free Consultation' : 'Безкоштовна консультація'}
              </h3>
              <p className="text-sm text-gray-600">
                {lang === 'en' ? 'Leave your contacts for personal consultation' : 'Залиште контакти для персональної консультації'}
              </p>
            </div>
            
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <Input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder={getTranslation('contactName', lang)}
                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
              <Input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={getTranslation('contactPhone', lang)}
                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium transition-all duration-200"
              >
                {lang === 'en' ? 'Start Consultation' : 'Почати консультацію'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      className="h-7 w-7 shrink-0"
                      src={message.sender === "user" ? "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png" : "/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png"}
                      fallback={message.sender === "user" ? (lang === 'en' ? "You" : "У") : "AI"}
                    />
                    <ChatBubbleMessage
                      variant={message.sender === "user" ? "sent" : "received"}
                      className={message.sender === "user" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : "bg-gray-100 text-gray-800"}
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      className="h-7 w-7 shrink-0"
                      src="/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png"
                      fallback="AI"
                    />
                    <ChatBubbleMessage 
                      isLoading 
                      className="bg-gray-100 text-gray-800"
                    />
                  </ChatBubble>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
              <form onSubmit={handleMessageSubmit} className="relative">
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={lang === 'en' ? 'Write your question...' : 'Напишіть ваше питання...'}
                  className="pr-12 h-10 border-gray-200 focus:border-orange-500 resize-none"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  disabled={isLoading}
                >
                  <CornerDownLeft className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationChat;
