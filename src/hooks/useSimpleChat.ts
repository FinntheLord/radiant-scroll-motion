
import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useSimpleChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: `${role}-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      content,
      role,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendMessage = useCallback(async (message: string, chatId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Здесь будет новая логика отправки сообщений
      console.log('Отправка сообщения:', { message, chatId });
      
      // Временная заглушка - просто добавляем ответ через секунду
      setTimeout(() => {
        addMessage('Временный ответ - функционал будет переделан', 'assistant');
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      setError('Ошибка отправки сообщения');
      setIsLoading(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    clearMessages,
    clearError
  };
};
