
import { useState, useCallback } from 'react';
import { ChatMessage, ApiResponse } from '../types/chat';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'your-api-key-here'; // В продакшене использовать переменную среды

export const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, lang: 'en' | 'uk'): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      // Симуляция API запроса для демонстрации
      // В реальном проекте здесь должен быть настоящий API вызов
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          const responses = {
            en: [
              'Thank you for your question! Our AI specialists will help you implement artificial intelligence solutions to optimize your business processes. Would you like to schedule a consultation?',
              'I understand your needs. We can develop custom AI solutions for your specific business requirements. Let me connect you with our team.',
              'Great question! Our AI solutions can significantly improve your business efficiency. Would you like to learn more about our services?'
            ],
            uk: [
              'Дякую за ваше питання! Наші AI-спеціалісти допоможуть вам впровадити рішення штучного інтелекту для оптимізації бізнес-процесів. Хочете записатися на консультацію?',
              'Розумію ваші потреби. Ми можемо розробити індивідуальні AI-рішення для ваших специфічних бізнес-вимог. Дозвольте мені з\'єднати вас з нашою командою.',
              'Відмінне питання! Наші AI-рішення можуть значно покращити ефективність вашого бізнесу. Хочете дізнатися більше про наші послуги?'
            ]
          };
          
          const randomResponse = responses[lang][Math.floor(Math.random() * responses[lang].length)];
          resolve(randomResponse);
        }, 1000 + Math.random() * 1000);
      });

      return response;
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
