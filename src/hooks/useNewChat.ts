
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useNewChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: `${role}-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      content,
      role,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const sendMessage = useCallback(async (message: string, chatId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Отправка сообщения:', { message, chatId });

      // Отправляем сообщение
      const { data: sendData, error: sendError } = await supabase.functions.invoke('chat-api', {
        body: {
          action: 'send',
          chatId: chatId,
          userMessage: message
        }
      });

      if (sendError) {
        throw new Error(`Ошибка отправки: ${sendError.message}`);
      }

      console.log('✅ Сообщение отправлено:', sendData);

      // Начинаем опрос ответа
      const maxAttempts = 30; // 2 минуты
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Попытка ${attempts}/${maxAttempts} получить ответ`);
        
        await new Promise(resolve => setTimeout(resolve, 4000)); // Ждем 4 секунды
        
        const { data: responseData, error: responseError } = await supabase.functions.invoke('chat-api', {
          body: {
            action: 'get',
            chatId: chatId
          }
        });

        console.log('📥 Ответ от API:', responseData);

        if (responseError) {
          console.log('❌ Ошибка при получении:', responseError);
          continue;
        }

        if (responseData?.success && responseData?.message) {
          console.log('🎉 Получен ответ AI!');
          addMessage(responseData.message, 'assistant');
          return;
        }
      }

      throw new Error('Превышено время ожидания ответа');

    } catch (err) {
      console.error('💥 Ошибка:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      addMessage(`Ошибка: ${errorMessage}`, 'assistant');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    clearMessages,
    clearError: () => setError(null)
  };
};
