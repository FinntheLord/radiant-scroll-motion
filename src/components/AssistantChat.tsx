
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
import { useOpenAI } from "../hooks/useOpenAI";

interface AssistantChatProps {
  lang: Language;
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Привіт! Я AI-помічник Connexi. Як я можу вам допомогти сьогодні?",
    sender: "ai",
  },
];

const AssistantChat: React.FC<AssistantChatProps> = ({ lang }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useOpenAI(lang);

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
    <div className="h-[500px] border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-lg flex flex-col overflow-hidden shadow-xl reveal-on-scroll">
      <div className="flex items-center gap-2 p-3 border-b border-gray-800">
        <div className="size-3 rounded-full bg-red-500"></div>
        <div className="size-3 rounded-full bg-yellow-500"></div>
        <div className="size-3 rounded-full bg-green-500"></div>
        <div className="ml-2 text-sm font-medium text-white/70 flex items-center gap-2">
          <img
            src="/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"
            alt="AI Animation"
            className="h-4 w-4 rounded opacity-90"
          />
          Connexi AI Assistant
        </div>
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
                src={message.sender === "user" ? "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png" : "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png"}
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

      <div className="p-4 border-t border-gray-800">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border border-gray-700 bg-gray-800/50 focus-within:ring-1 focus-within:ring-connexi-orange p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === 'en' ? 'Enter your message...' : 'Введіть ваше повідомлення...'}
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
              {lang === 'en' ? 'Send' : 'Відправити'}
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantChat;
