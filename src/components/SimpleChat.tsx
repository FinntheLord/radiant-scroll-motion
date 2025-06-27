
import React, { useState, useEffect, memo, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/ui/chat-input';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { TrafficLight } from '@/components/TrafficLight';
import { useNewChat } from '@/hooks/useNewChat';
import { useSimpleChatContext } from '@/contexts/SimpleChatContext';
import { useTypingActivity } from '@/hooks/useTypingActivity';
import { useIsMobile } from '@/hooks/use-mobile';
import { Language } from '@/lib/translations';

interface SimpleChatProps {
  lang: Language;
}

const SimpleChat: React.FC<SimpleChatProps> = memo(({ lang }) => {
  const { isChatOpen, closeChat } = useSimpleChatContext();
  const { messages, isLoading, error, sendMessage, clearError, chatId } = useNewChat();
  const [inputMessage, setInputMessage] = useState('');
  const [isTrafficLightActive, setIsTrafficLightActive] = useState(false);
  const { isTyping, startTyping } = useTypingActivity(2000);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Активируем светофор при печати
  useEffect(() => {
    setIsTrafficLightActive(isTyping);
  }, [isTyping]);

  // Логируем изменения сообщений
  useEffect(() => {
    console.log('🔄 Сообщения в SimpleChat обновились:', messages);
    console.log('📊 Количество сообщений:', messages.length);
  }, [messages]);

  // Добавляем приветственное сообщение при открытии чата
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      console.log('🚀 Чат открыт, chatId:', chatId);
    }
  }, [isChatOpen, messages.length, chatId]);

  // Фокус на инпут при открытии чата (только на десктопе)
  useEffect(() => {
    if (isChatOpen && !isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Задержка для завершения анимации
    }
  }, [isChatOpen, isMobile]);

  const handleTrafficLightClick = () => {
    setIsTrafficLightActive(true);
    setTimeout(() => {
      setIsTrafficLightActive(false);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageContent = inputMessage.trim();
    console.log('📤 Отправляем сообщение из компонента:', messageContent);
    setInputMessage('');
    
    // Отправляем сообщение
    await sendMessage(messageContent);
    
    // Возвращаем фокус на инпут только на десктопе
    if (isChatOpen && !isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    // Активируем индикатор печати при вводе текста
    if (e.target.value.trim()) {
      startTyping();
    }
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
      
      {/* Chat Container - Полноэкранный на мобильных */}
      <div className={`fixed inset-0 md:right-0 md:top-0 md:left-auto md:h-full md:w-[600px] lg:w-[700px] bg-gray-900 md:border-l border-gray-800 z-50 transform transition-all duration-700 ease-in-out ${
        isChatOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        {/* Decorative circles - только на десктопе */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-connexi-orange/20 to-connexi-pink/20 blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-br from-connexi-pink/15 to-connexi-orange/15 blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-72 right-16 w-16 h-16 rounded-full bg-gradient-to-br from-connexi-orange/25 to-connexi-pink/25 blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header - Мобильно-адаптивный */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm relative z-10 safe-area-top">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/lovable-uploads/0602a23b-6fed-48fc-9ed3-ca7c446252a0.png" 
                alt="AI Assistant"
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-white truncate">
                AI-Помічник Connexi
              </h2>
              <p className="text-sm text-white/60 truncate">
                {lang === 'en' ? 'Realtime Chat System' : 'Система чату в реальному часі'}
              </p>
              {!isMobile && (
                <p className="text-xs text-white/40 truncate">
                  Chat ID: {chatId.substring(0, 16)}... | Сообщений: {messages.length}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isMobile && (
              <TrafficLight 
                isActive={isTrafficLightActive}
                className="cursor-pointer"
                onClick={handleTrafficLightClick}
              />
            )}
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
              className="text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200 h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Content - Улучшенная мобильная версия */}
        <div className="h-[calc(100vh-80px)] md:h-[calc(100%-80px)] flex flex-col relative z-10">
          {/* Messages - Правильная высота для скролла */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatMessageList smooth>
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400 px-4">
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
                      src="/lovable-uploads/0602a23b-6fed-48fc-9ed3-ca7c446252a0.png"
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
                    src="/lovable-uploads/0602a23b-6fed-48fc-9ed3-ca7c446252a0.png"
                    fallback="AI"
                    className="border-none outline-none"
                  />
                  <ChatBubbleMessage variant="received" isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </div>

          {/* Input - Мобильная оптимизация */}
          <div className="p-4 border-t border-gray-800 bg-gray-900 safe-area-bottom">
            {error && (
              <div className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
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
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-connexi-orange transition-colors">
                <ChatInput
                  ref={inputRef}
                  placeholder={lang === 'en' ? 'Type your message...' : 'Введіть ваше повідомлення...'}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onSend={handleSendMessage}
                  disabled={isLoading}
                  autoFocus={!isMobile && isChatOpen}
                  className="text-white placeholder:text-gray-400 px-4 py-3 text-base resize-none"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="contact-button h-12 w-12 rounded-full shrink-0"
              >
                <Send className="h-5 w-5" />
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
