
import React, { useState, useEffect, memo } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ui/chat-input';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { useSimpleChatContext } from '@/contexts/SimpleChatContext';
import { useChatApi } from '@/hooks/useChatApi';
import { Language } from '@/lib/translations';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface SimpleChatProps {
  lang: Language;
}

const SimpleChat: React.FC<SimpleChatProps> = memo(({ lang }) => {
  const { isChatOpen, closeChat } = useSimpleChatContext();
  const { sendMessage, isLoading, error, clearError } = useChatApi();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

  // Подписка на realtime обновления сообщений
  useEffect(() => {
    if (!isChatOpen) return;

    console.log('🔌 Устанавливаем realtime подписку для chatId:', chatId);
    
    const channel = supabase
      .channel('chat-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('📨 Получено новое сообщение через realtime:', payload.new);
          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.message,
            role: payload.new.role as 'user' | 'assistant',
            timestamp: new Date(payload.new.created_at)
          };
          
          setMessages(prev => {
            // Проверяем, нет ли уже такого сообщения
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) {
              console.log('⚠️ Сообщение уже существует, пропускаем');
              return prev;
            }
            
            console.log('✅ Добавляем новое сообщение в UI');
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Отключаем realtime подписку');
      supabase.removeChannel(channel);
    };
  }, [isChatOpen, chatId]);

  // Загружаем существующие сообщения при открытии чата
  useEffect(() => {
    if (!isChatOpen) return;

    const loadExistingMessages = async () => {
      console.log('📋 Загружаем существующие сообщения для chatId:', chatId);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Ошибка загрузки сообщений:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('📋 Загружено сообщений:', data.length);
        const existingMessages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          content: msg.message,
          role: msg.role as 'user' | 'assistant',
          timestamp: new Date(msg.created_at)
        }));
        setMessages(existingMessages);
      } else {
        console.log('📋 Нет существующих сообщений');
      }
    };

    loadExistingMessages();
  }, [isChatOpen, chatId]);

  // Логируем изменения сообщений
  useEffect(() => {
    console.log('🔄 Сообщения в SimpleChat обновились:', messages);
    console.log('📊 Количество сообщений:', messages.length);
    if (messages.length > 0) {
      console.log('📝 Последнее сообщение:', messages[messages.length - 1]);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageContent = inputMessage.trim();
    console.log('📤 Отправляем сообщение:', messageContent);
    setInputMessage('');
    
    try {
      await sendMessage(messageContent, chatId);
      console.log('✅ Сообщение отправлено успешно');
    } catch (error) {
      console.error('❌ Ошибка отправки сообщения:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  console.log('🎨 Рендер SimpleChat. Сообщений:', messages.length, 'isLoading:', isLoading);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out ${
          isChatOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeChat}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-gray-900 border-l border-gray-800 z-50 transform transition-all duration-700 ease-in-out ${
        isChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        {/* Decorative circles - только на десктопе */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-connexi-orange/20 to-connexi-pink/20 blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-br from-connexi-pink/15 to-connexi-orange/15 blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-72 right-16 w-16 h-16 rounded-full bg-gradient-to-br from-connexi-orange/25 to-connexi-pink/25 blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8" 
                alt="AI Assistant"
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                AI-Помічник Connexi
              </h2>
              <p className="text-sm text-white/60">
                {lang === 'en' ? 'Realtime Chat System' : 'Система чату в реальному часі'}
              </p>
              <p className="text-xs text-white/40">
                Chat ID: {chatId.substring(0, 16)}... | Сообщений: {messages.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              isLoading ? 'bg-yellow-500 animate-pulse' : 
              messages.length > 0 ? 'bg-green-500' : 'bg-blue-500'
            }`} title={
              isLoading ? 'Отправка...' : 
              messages.length > 0 ? 'Активен' : 'Ожидание'
            } />
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChat}
              className="text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="h-[calc(100vh-80px)] md:h-[calc(100%-80px)] flex flex-col relative z-10">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ChatMessageList smooth>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <p className="text-lg mb-2">👋 Начните диалог</p>
                    <p className="text-sm">Отправьте сообщение, чтобы начать...</p>
                    <p className="text-xs mt-2 opacity-50">
                      Realtime подключение активно
                    </p>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.role === 'user' ? 'sent' : 'received'}
                >
                  {message.role === 'assistant' && (
                    <ChatBubbleAvatar 
                      src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                      fallback="AI"
                      className="border-none outline-none"
                    />
                  )}
                  <ChatBubbleMessage variant={message.role === 'user' ? 'sent' : 'received'}>
                    {message.content}
                  </ChatBubbleMessage>
                  {message.role === 'user' && (
                    <ChatBubbleAvatar 
                      fallback={lang === 'en' ? 'You' : 'Ви'} 
                      className="bg-blue-600 border-none outline-none"
                    />
                  )}
                </ChatBubble>
              ))}
              {isLoading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar 
                    src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYWJ1Y2tldC9lemdpZi04OTgxYWZmZDQwNDc2MS53ZWJwIiwiaWF0IjoxNzQ5MTE5NTgyLCJleHAiOjE3NDk3MjQzODJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
                    fallback="AI"
                    className="border-none outline-none"
                  />
                  <ChatBubbleMessage variant="received" isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            {error && (
              <div className="mb-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">
                {error}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="ml-2 text-red-200 hover:text-white"
                >
                  ✕
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-connexi-orange transition-colors">
                <ChatInput
                  placeholder={lang === 'en' ? 'Type your message...' : 'Введіть ваше повідомлення...'}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onSend={handleSendMessage}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="contact-button h-12 w-12 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

SimpleChat.displayName = 'SimpleChat';

export { SimpleChat };
