
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, lang: 'en' | 'uk'): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('chat-with-openai', {
        body: { 
          message: message,
          language: lang 
        }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data || !data.message) {
        throw new Error('Invalid response from AI service');
      }

      return data.message;
    } catch (err) {
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
