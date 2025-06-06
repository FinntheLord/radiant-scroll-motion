
import { useState } from "react";
import { Language } from "../lib/translations";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

export const useOpenAI = (lang: Language) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    userMessage: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    setIsLoading(true);
    
    try {
      // Симуляция ответа AI (здесь будет интеграция с реальным API)
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
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};
