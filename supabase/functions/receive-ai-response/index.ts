
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Здесь можно добавить логику для:
    // 1. Сохранения ответа в базу данных
    // 2. Отправки уведомления пользователю через WebSocket
    // 3. Обновления статуса сообщения
    
    // Для демонстрации просто логируем полученный ответ
    console.log('AI response processed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      messageId: messageId,
      status: 'response_received',
      timestamp: new Date().toISOString()
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
