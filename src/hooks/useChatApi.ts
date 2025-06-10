
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string, 
    chatId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('=== ОТПРАВКА СООБЩЕНИЯ ===');
      console.log('Сообщение:', message);
      console.log('Chat ID:', chatId);

      const requestBody = {
        message: message,
        chatId: chatId,
        timestamp: Date.now()
      };

      console.log('Тело запроса:', JSON.stringify(requestBody, null, 2));

      const { data, error: supabaseError } = await supabase.functions.invoke('chat-with-ai', {
        body: requestBody
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      console.log('Ответ от функции:', data);
      console.log('=== СООБЩЕНИЕ ОТПРАВЛЕНО УСПЕШНО ===');

    } catch (err) {
      console.error('=== ОШИБКА ОТПРАВКИ ===');
      console.error('Полная ошибка:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка при отправке сообщения';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
