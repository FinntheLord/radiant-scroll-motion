
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
import { Language } from "../lib/translations";

interface AssistantChatProps {
  lang: Language;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

// Simple mock function instead of using external hook
const useMockOpenAI = (lang: Language) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    userMessage: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const aiResponse = lang === 'en' 
        ? "Thank you for your message. I'm here to help you with AI solutions for your business."
        : "Дякую за ваше повідомлення. Я тут, щоб допомогти вам з AI-рішеннями для вашого бізнесу.";
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          content: aiResponse,
          sender: "ai",
        },
      ]);
      
      setIsLoading(false);
    }, 1000);
  };

  return { sendMessage, isLoading };
};

const AssistantChat: React.FC<AssistantChatProps> = ({ lang }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: lang === 'en' 
        ? "Hello! I'm Connexi AI assistant. How can I help you today?"
        : "Привіт! Я AI-помічник Connexi. Як я можу вам допомогти сьогодні?",
      sender: "ai",
    }
  ]);
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useMockOpenAI(lang);

  // Update initial message when language changes
  useEffect(() => {
    setMessages([{
      id: 1,
      content: lang === 'en' 
        ? "Hello! I'm Connexi AI assistant. How can I help you today?"
        : "Привіт! Я AI-помічник Connexi. Як я можу вам допомогти сьогодні?",
      sender: "ai",
    }]);
  }, [lang]);

  async function handleSubmit(e: FormEvent) {
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

    await sendMessage(userMessage, messages, setMessages);
  }

  return (
    <div className="h-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-lg flex flex-col overflow-hidden shadow-xl">      
      <div className="flex-1 overflow-hidden">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
                fallback={message.sender === "user" ? (lang === 'en' ? "You" : "Ви") : "AI"}
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
                src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      {/* Improved mobile input area */}
      <div className="p-3 md:p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border border-gray-700 bg-gray-800/50 focus-within:ring-1 focus-within:ring-connexi-orange"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === 'en' ? 'Enter your message...' : 'Введіть ваше повідомлення...'}
            className="min-h-12 max-h-32 resize-none rounded-lg bg-transparent border-0 p-3 pr-12 shadow-none focus-visible:ring-0 text-white text-base md:text-sm leading-relaxed"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 top-2 flex items-end">
            <Button 
              type="submit" 
              size="sm" 
              className="contact-button h-8 w-8 p-0 min-w-8 shrink-0"
              disabled={isLoading || !input.trim()}
            >
              <CornerDownLeft className="size-3.5" />
              <span className="sr-only">
                {lang === 'en' ? 'Send' : 'Відправити'}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantChat;
