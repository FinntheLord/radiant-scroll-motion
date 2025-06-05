
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Language, getTranslation } from "../lib/translations";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
}

export const useOpenAI = (lang: Language) => {
  const [isLoading, setIsLoading] = useState(false);

  // OpenAI API configuration
  const OPENAI_API_KEY = "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";
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

  // Function to send message to OpenAI API
  async function sendMessageToOpenAI(userMessage: string, messages: Message[]): Promise<string> {
    try {
      const systemPrompt = lang === 'en'
        ? "You are Connexi AI assistant - from a technology company that specializes in implementing artificial intelligence in client business processes. Respond briefly in English. Our main services: developing chatbots and voice assistants for customer support, automating routine tasks, data analysis, marketing personalization, sales forecasting, fraud detection, logistics optimization, staff recruitment and reporting automation. We start by studying the client's business, develop AI agents for their tasks, integrate them into business processes and train them on the company's unique content. Tell about these capabilities professionally and friendly."
        : "Ти AI-помічник Connexi - технологічної компанії, що спеціалізується на впровадженні штучного інтелекту в бізнес-процеси клієнтів. Відповідай коротко, українською мовою. Наші основні послуги: розробка чат-ботів та голосових асистентів для підтримки клієнтів, автоматизація рутинних завдань, аналіз даних, персоналізація маркетингу, прогнозування продажів, виявлення шахрайства, оптимізація логістики, підбір персоналу та автоматизацію звітності. Ми починаємо з вивчення бізнесу клієнта, розробляємо AI-агентів під їхні задачі, інтегруємо їх у бізнес-процеси та навчаємо на унікальному контенті компанії. Розкажи про ці можливості професійно та дружньо.";

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
  }

  const sendMessage = async (userMessage: string, messages: Message[], setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
    setIsLoading(true);

    try {
      // Get response from OpenAI
      const aiResponse = await sendMessageToOpenAI(userMessage, messages);
      
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
        description: lang === 'en' ? "Failed to get AI response. Please try again later." : "Не вдалося отримати відповідь від AI. Спробуйте ще раз пізніше.",
        variant: "destructive",
      });
      console.error("Error getting AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
};
