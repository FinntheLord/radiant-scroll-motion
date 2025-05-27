
import React, { useState, FormEvent } from "react";
import { X, CornerDownLeft, Bot, User } from "lucide-react";
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

interface ConsultationChatProps {
  isOpen: boolean;
  onClose: () => void;
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

const ConsultationChat: React.FC<ConsultationChatProps> = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", phone: "" });
  const [isInfoCollected, setIsInfoCollected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialMessage: Message = {
    id: 1,
    content: "Привіт! Я консультант Connexi. Щоб почати консультацію, будь ласка, надайте ваше ім'я та номер телефону.",
    sender: "ai",
  };

  // OpenAI API configuration
  const OPENAI_API_KEY = "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";
  const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

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
              content: `Ти консультант компанії Connexi - технологічної компанії, що спеціалізується на впровадженні штучного інтелекту в бізнес-процеси. Клієнта звати ${userInfo.name}, його телефон ${userInfo.phone}. Відповідай професійно та дружньо українською мовою. Наші послуги: розробка чат-ботів та голосових асистентів, автоматизація рутинних завдань, аналіз даних, персоналізація маркетингу, прогнозування продажів, виявлення шахрайства, оптимізація логістики, підбір персоналу та автоматизація звітності. Пропонуй конкретні рішення відповідно до потреб клієнта.`
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
        throw new Error("Помилка API");
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
        title: "Помилка",
        description: "Будь ласка, заповніть всі поля",
        variant: "destructive",
      });
      return;
    }

    setIsInfoCollected(true);
    setMessages([
      initialMessage,
      {
        id: 2,
        content: `Дякую, ${userInfo.name}! Тепер я можу вас проконсультувати. Які питання у вас є щодо впровадження AI в ваш бізнес?`,
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
        title: "Помилка",
        description: "Не вдалося отримати відповідь. Спробуйте ще раз.",
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
      <DialogContent className="max-w-sm h-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-3 border-b bg-connexi-gradient text-white">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Bot className="h-4 w-4" />
            Консультація Connexi
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-2 top-2 h-6 w-6 text-white hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </DialogHeader>

        {!isInfoCollected ? (
          <div className="p-4 flex flex-col justify-center h-full">
            <div className="text-center mb-4">
              <Bot className="h-8 w-8 mx-auto mb-3 text-connexi-orange" />
              <p className="text-gray-600 mb-4 text-sm">
                Для початку консультації надайте ваші дані:
              </p>
            </div>
            
            <form onSubmit={handleInfoSubmit} className="space-y-3">
              <Input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ваше ім'я"
                className="w-full text-sm"
              />
              <Input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+380..."
                className="w-full text-sm"
              />
              <Button type="submit" className="w-full contact-button text-sm py-2">
                Почати консультацію
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <ChatMessageList>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar
                      className="h-6 w-6 shrink-0"
                      src={message.sender === "user" ? "/lovable-uploads/ad89a77e-e3fb-4b1e-adfa-7ab6b2d12421.png" : "/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png"}
                      fallback={message.sender === "user" ? "У" : "AI"}
                    />
                    <ChatBubbleMessage
                      variant={message.sender === "user" ? "sent" : "received"}
                      className="text-sm"
                    >
                      {message.content}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

                {isLoading && (
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar
                      className="h-6 w-6 shrink-0"
                      src="/lovable-uploads/0f978ddb-430d-4057-9952-f4aeaf603be9.png"
                      fallback="AI"
                    />
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                )}
              </ChatMessageList>
            </div>

            <div className="p-3 border-t">
              <form onSubmit={handleMessageSubmit} className="relative">
                <ChatInput
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Введіть повідомлення..."
                  className="pr-10 text-sm h-8"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1 contact-button h-6 w-6 p-0"
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
