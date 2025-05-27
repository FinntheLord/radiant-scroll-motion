import React, { useState, FormEvent, useEffect } from "react";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AssistantSection: React.FC<{ className?: string }> = ({ className }) => {
  const [messages, setMessages] = useState([
    {
      text: "Привіт! Я AI-асистент. Чим я можу допомогти вам сьогодні?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const assistantMessages = document.getElementById("assistant-messages");
    if (assistantMessages) {
      assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { text: data.response, isUser: false };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error: any) {
      console.error("Помилка відправки:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Вибачте, сталася помилка. Спробуйте ще раз пізніше.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`py-20 ${className} relative`}>
      <div className="absolute top-8 left-8 z-30">
        <span className="text-4xl md:text-5xl font-bold text-white/30">{"{ 04 }"} ПОМІЧНИК</span>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-md p-6 relative">
          <div className="absolute top-4 right-4">
            <Badge className="uppercase">AI Асистент</Badge>
          </div>

          <div
            id="assistant-messages"
            className="mb-4 h-64 overflow-y-auto pr-2"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 flex ${message.isUser ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`rounded-lg p-3 w-fit max-w-[70%] ${message.isUser
                      ? "bg-connexi-orange text-white"
                      : "bg-gray-700 text-gray-300"
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="mb-2 flex justify-start">
                <div className="rounded-lg p-3 w-fit max-w-[70%] bg-gray-700 text-gray-300">
                  <span className="animate-pulse">
                    Завантаження відповіді...
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <Label htmlFor="prompt" className="sr-only">
              Введіть ваше питання:
            </Label>
            <Textarea
              id="prompt"
              placeholder="Введіть ваше питання..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm focus:border-connexi-orange focus:ring-connexi-orange"
            />
            <Button
              type="submit"
              className="absolute bottom-2 right-2 rounded-full bg-connexi-orange text-white hover:bg-connexi-pink transition-colors"
              disabled={isLoading}
            >
              <CornerDownLeft className="h-4 w-4 mr-2" />
              Відправити
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AssistantSection;
