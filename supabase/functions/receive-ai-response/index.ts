
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Хранилище активных WebSocket соединений по chatId
const activeChatSessions = new Map<string, WebSocket>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageId, userId, chatId, message, language } = await req.json();

    if (!message || !userId || !chatId) {
      throw new Error('Missing required fields: message, userId, chatId');
    }

    console.log('Received AI response from n8n:', { 
      messageId, 
      userId, 
      chatId, 
      message: message.substring(0, 100) + '...' 
    });

    // Попытка доставить сообщение через WebSocket (если есть активное соединение)
    const chatSession = activeChatSessions.get(chatId);
    if (chatSession && chatSession.readyState === WebSocket.OPEN) {
      console.log('Sending message via WebSocket to chatId:', chatId);
      chatSession.send(JSON.stringify({
        type: 'ai_response',
        messageId: messageId || `ai-${Date.now()}`,
        userId: userId,
        chatId: chatId,
        message: message,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.log('No active WebSocket connection for chatId:', chatId);
    }

    // Дополнительно: отправляем HTTP запрос обратно в основную функцию для обработки
    try {
      const chatResponse = await fetch(`https://mdlyglpbdqvgwnayumhh.supabase.co/functions/v1/chat-with-openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          isResponse: true,
          aiResponse: message,
          messageId: messageId,
          userId: userId,
          chatId: chatId,
          language: language
        })
      });

      if (chatResponse.ok) {
        console.log('Successfully forwarded AI response to chat function');
      } else {
        console.error('Failed to forward AI response to chat function:', chatResponse.status);
      }
    } catch (forwardError) {
      console.error('Error forwarding AI response:', forwardError);
    }

    console.log('AI response processed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      messageId: messageId,
      status: 'response_delivered',
      timestamp: new Date().toISOString(),
      chatId: chatId,
      userId: userId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in receive-ai-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Функция для регистрации WebSocket соединения
export function registerChatSession(chatId: string, websocket: WebSocket) {
  activeChatSessions.set(chatId, websocket);
  
  websocket.addEventListener('close', () => {
    activeChatSessions.delete(chatId);
    console.log('Chat session closed for chatId:', chatId);
  });
}
