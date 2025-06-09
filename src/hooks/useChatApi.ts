
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string, 
    lang: 'en' | 'uk',
    userId?: string,
    chatId?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Генерируем ID если не переданы
      const currentUserId = userId || `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const currentChatId = chatId || `chat_${Date.now()}_${Math.random().toString(36).substring(2)}`;

      console.log('Sending message to n8n via Edge Function:', { 
        message, 
        language: lang, 
        userId: currentUserId, 
        chatId: currentChatId 
      });

      const { data, error: supabaseError } = await supabase.functions.invoke('chat-with-openai', {
        body: { 
          message: message,
          language: lang,
          userId: currentUserId,
          chatId: currentChatId
        }
      });

      console.log('Supabase function response:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error('No response received from n8n service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.message) {
        throw new Error('Invalid response format from n8n service');
      }

      // Теперь возвращаем временное сообщение, реальный ответ придет через webhook
      return data.message;
    } catch (err) {
      console.error('Error in sendMessage:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
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
