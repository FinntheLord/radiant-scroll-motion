
import React, { useState, FormEvent, useEffect } from "react";
import { ArrowUp } from "lucide-react";
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
        ? "Чем я могу помочь?"
        : "Чем я могу помочь?",
      sender: "ai",
    }
  ]);
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useMockOpenAI(lang);

  // Update initial message when language changes
  useEffect(() => {
    setMessages([{
      id: 1,
      content: "Чем я могу помочь?",
      sender: "ai",
    }]);
  }, [lang]);

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

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
    <div className="h-full bg-gray-900 rounded-lg flex flex-col overflow-hidden">      
      <div className="flex-1 overflow-hidden">
        <ChatMessageList className="h-full">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              {message.sender === "ai" && (
                <ChatBubbleAvatar
                  src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                  fallback="AI"
                />
              )}
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
                src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-gray-700 rounded-full px-5 py-3 focus-within:ring-2 focus-within:ring-blue-500">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите что-нибудь..."
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none text-white placeholder:text-gray-400"
              onSend={handleSubmit}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0 transition-colors"
              disabled={isLoading || !input.trim()}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantChat;
