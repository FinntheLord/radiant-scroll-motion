
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useSimpleChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<any>(null);

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
      // Сохраняем сообщение пользователя в БД
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          chat_id: chatId,
          message: message,
          role: 'user'
        });

      if (insertError) {
        throw new Error('Ошибка сохранения сообщения пользователя');
      }

      // Отправляем сообщение в n8n через edge function
      const { error: functionError } = await supabase.functions.invoke('send-to-n8n', {
        body: { message, chatId }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Ошибка отправки в n8n');
      }

    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Создаем подписку только один раз при монтировании
  useEffect(() => {
    console.log('Trying to establish connection');
    if (channelRef.current)
    {
      console.log('connection duplicated');
      return; 
    } // Предотвращаем дублирование подписок

    const channel = supabase
      .channel('chat-messages-optimized')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          console.log('Новое сообщение получено:', payload.new);
          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.message,
            role: payload.new.role as 'user' | 'assistant',
            timestamp: new Date(payload.new.created_at)
          };
          
          setMessages(prev => {
            // Проверяем, нет ли уже такого сообщения
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []); // Пустой массив зависимостей - подписка создается только один раз

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    clearError
  };
};
