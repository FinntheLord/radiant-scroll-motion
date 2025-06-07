
import React, { useState, useEffect } from "react";
import { X, Send, MessageCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { Input } from "@/components/ui/input";
import { TrafficLight } from "./TrafficLight";
import { useChat } from "../contexts/ChatContext";
import { useChatApi } from "../hooks/useChatApi";
import { useTypingActivity } from "../hooks/useTypingActivity";
import { ChatMessage } from "../types/chat";
import { Language } from "../lib/translations";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, lang }) => {
  const { messages, addMessage, isLoading, setIsLoading, initializeChat } = useChat();
  const { sendMessage, error, clearError, apiKey, updateApiKey } = useChatApi();
  const [inputMessage, setInputMessage] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const { isTyping, startTyping } = useTypingActivity(1500);

  // Инициализация приветственного сообщения только один раз
  useEffect(() => {
    if (isOpen) {
      initializeChat(lang);
    }
  }, [isOpen, initializeChat, lang]);

  // Проверяем наличие API ключа при открытии
  useEffect(() => {
    if (isOpen && !apiKey) {
      setShowApiKeyInput(true);
      setTempApiKey('');
    } else {
      setShowApiKeyInput(false);
    }
  }, [isOpen, apiKey]);

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      updateApiKey(tempApiKey.trim());
      setShowApiKeyInput(false);
      setTempApiKey('');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputMessage.trim(), lang, messages);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      addMessage(botResponse);
    } catch (err) {
      console.error('Error sending message:', err);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: lang === 'en' 
          ? 'Sorry, I encountered an error. Please try again later.'
          : 'Вибачте, сталася помилка. Спробуйте пізніше.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      addMessage(errorResponse);
    } finally {
      setIsLoading(false);
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
    startTyping();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-gray-900 border-l border-gray-800 z-50 transform transition-all duration-700 ease-in-out ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                style={{ border: 'none', outline: 'none' }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                AI-Помічник Connexi
              </h2>
              <p className="text-sm text-white/60">
                {lang === 'en' ? 'Ask questions about our AI solutions' : 'Запитайте про наші AI-рішення'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <TrafficLight isActive={isTyping || isLoading} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <Key className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-gray-800 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <div className="p-4 border-b border-gray-800 bg-gray-800/50 relative z-10">
            <div className="mb-2">
              <label className="text-sm text-white/80 block mb-2">
                {lang === 'en' ? 'OpenAI API Key:' : 'OpenAI API ключ:'}
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder={lang === 'en' ? 'Enter your OpenAI API key...' : 'Введіть ваш OpenAI API ключ...'}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button onClick={handleSaveApiKey} className="contact-button">
                  {lang === 'en' ? 'Save' : 'Зберегти'}
                </Button>
              </div>
            </div>
            <p className="text-xs text-white/60">
              {lang === 'en' 
                ? 'Your API key is stored locally and used to communicate with OpenAI'
                : 'Ваш API ключ зберігається локально та використовується для зв\'язку з OpenAI'
              }
            </p>
          </div>
        )}

        {/* Chat Content */}
        <div className="h-[calc(100vh-80px)] md:h-[calc(100%-80px)] flex flex-col relative z-10">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ChatMessageList smooth>
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
                    src="https://mdlyglpbdqvgwnayumhh.supabase.co/storage/v1/object/sign/mediabucket/ezgif-8981affd404761.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84NDEzZTkzNS1mMTAyLTQxMjAtODkzMy0yNWI5OGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwaWYyOGNjY2Q1NDIiLCJhbGciOiJIUzI1NiJ9.c2y2iiXwEVJKJi9VUtm9MPShj2l1nRQK516-rgSniD8"
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
                  ×
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-connexi-orange transition-colors">
                <ChatInput
                  placeholder={lang === 'en' ? 'Ask about AI solutions...' : 'Запитайте про AI-рішення...'}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onSend={handleSendMessage}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading || !apiKey}
                  className="text-white placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim() || !apiKey}
                size="icon"
                className="contact-button h-12 w-12 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!apiKey && (
              <p className="text-xs text-yellow-400 mt-2">
                {lang === 'en' 
                  ? 'Please enter your OpenAI API key to start chatting'
                  : 'Будь ласка, введіть ваш OpenAI API ключ для початку спілкування'
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
