
import { useState, useCallback } from 'react';
import { ChatMessage, ApiResponse } from '../types/chat';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  const sendMessage = useCallback(async (message: string, lang: 'en' | 'uk', chatHistory: ChatMessage[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    // Проверяем наличие API ключа
    const currentApiKey = apiKey || localStorage.getItem('openai_api_key');
    
    if (!currentApiKey) {
      setError(lang === 'en' ? 'Please enter your OpenAI API key' : 'Будь ласка, введіть ваш OpenAI API ключ');
      setIsLoading(false);
      throw new Error('API key required');
    }

    try {
      // Подготавливаем контекст для OpenAI
      const systemMessage = {
        role: 'system' as const,
        content: lang === 'en' 
          ? 'You are an AI assistant for Connexi, a company that provides AI solutions for businesses. Help users with questions about AI implementations, business automation, and our services. Be helpful and professional.'
          : 'Ви - AI-помічник компанії Connexi, яка надає AI-рішення для бізнесу. Допомагайте користувачам з питаннями про впровадження штучного інтелекту, автоматизацію бізнесу та наші послуги. Будьте корисними і професійними.'
      };

      // Конвертируем историю чата в формат OpenAI
      const messages = [
        systemMessage,
        ...chatHistory.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Вибачте, не вдалося отримати відповідь';
      
    } catch (err) {
      console.error('OpenAI API Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Fallback відповідь якщо API не працює
      const fallbackResponses = {
        en: 'I apologize, but I\'m having trouble connecting to our AI service right now. Please try again later or contact our support team.',
        uk: 'Вибачте, зараз виникли проблеми з підключенням до нашого AI-сервісу. Спробуйте пізніше або зверніться до нашої команди підтримки.'
      };
      
      return fallbackResponses[lang];
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const updateApiKey = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    apiKey: apiKey || localStorage.getItem('openai_api_key') || '',
    updateApiKey,
    clearError: () => setError(null)
  };
};
