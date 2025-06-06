
import React, { useState, FormEvent, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CornerDownLeft, X } from "lucide-react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { Language } from "../lib/translations";
import { useOpenAI } from "../hooks/useOpenAI";

interface SiteChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const SiteChatDrawer: React.FC<SiteChatDrawerProps> = ({ isOpen, onClose, lang }) => {
  const initialMessage = lang === 'uk' 
    ? "Вітаю! Я AI-асистент Connexi. Чим можу вам допомогти сьогодні?"
    : "Hello! I'm the Connexi AI assistant. How can I help you today?";
    
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: initialMessage, sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useOpenAI(lang);

  // Reset chat when language changes
  useEffect(() => {
    setMessages([
      { 
        id: 1, 
        content: lang === 'uk' 
          ? "Вітаю! Я AI-асистент Connexi. Чим можу вам допомогти сьогодні?"
          : "Hello! I'm the Connexi AI assistant. How can I help you today?", 
        sender: "ai" 
      }
    ]);
  }, [lang]);
  
  // Clear the state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setInput("");
        setMessages([
          { 
            id: 1, 
            content: lang === 'uk' 
              ? "Вітаю! Я AI-асистент Connexi. Чим можу вам допомогти сьогодні?"
              : "Hello! I'm the Connexi AI assistant. How can I help you today?", 
            sender: "ai" 
          }
        ]);
      }, 300);
    }
  }, [isOpen, lang]);

  async function handleSubmit(e: FormEvent) {
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

    await sendMessage(userMessage, messages, setMessages);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg p-0 border-0 bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <SheetHeader className="p-4 border-b border-gray-800 flex flex-row items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X size={18} />
          </Button>
          <SheetTitle className="text-white flex items-center gap-2">
            <img
              src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
              alt="AI Avatar"
              className="h-6 w-6 rounded-full"
            />
            {lang === 'uk' ? "Чат з Connexi AI" : "Chat with Connexi AI"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-140px)]">
          <div className="flex-1 overflow-hidden p-4">
            <ChatMessageList>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={message.sender === "user" ? "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png" : "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"}
                    fallback={message.sender === "user" ? (lang === 'uk' ? "Ви" : "You") : "AI"}
                  />
                  <ChatBubbleMessage
                    variant={message.sender === "user" ? "sent" : "received"}
                    className={message.sender === "user" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : "bg-gray-800 text-white"}
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
                  <ChatBubbleMessage 
                    isLoading 
                    variant="received"
                    className="bg-gray-800 text-white"
                  />
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
                placeholder={lang === 'uk' ? 'Введіть ваше повідомлення...' : 'Enter your message...'}
                className="min-h-12 resize-none rounded-lg bg-transparent border-0 p-3 shadow-none focus-visible:ring-0 text-white"
              />
              <div className="flex items-center p-3 pt-0 justify-between">
                <div className="flex"></div>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 ml-auto gap-1.5 text-white"
                  disabled={isLoading}
                >
                  {lang === 'uk' ? 'Відправити' : 'Send'}
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SiteChatDrawer;
