
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, lang: 'en' | 'uk'): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message to chat-with-openai function:', { message, language: lang });

      const { data, error: supabaseError } = await supabase.functions.invoke('chat-with-openai', {
        body: { 
          message: message,
          language: lang 
        }
      });

      console.log('Supabase function response:', { data, error: supabaseError });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error('No response received from AI service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.message) {
        throw new Error('Invalid response format from AI service');
      }

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
