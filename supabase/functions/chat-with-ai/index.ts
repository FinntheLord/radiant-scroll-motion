
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
    const { message, chatId } = await req.json();

    if (!message || !chatId) {
      console.log('❌ ОТСУТСТВУЮТ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ');
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: message and chatId',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('=== CHAT-WITH-AI ===');
    console.log('📨 Получено сообщение:', message.substring(0, 100));
    console.log('🆔 Chat ID:', chatId);

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log('👤 Generated User ID:', userId);

    // Подготавливаем данные для n8n
    const webhookPayload = {
      message: message,
      chat_id: chatId,
      user_id: userId
    };

    console.log('📡 Отправка в n8n webhook...');
    console.log('🔗 URL: https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274');
    console.log('📦 Payload:', JSON.stringify(webhookPayload, null, 2));

    // Отправляем запрос в n8n с таймаутом
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

    try {
      const webhookResponse = await fetch('https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!webhookResponse.ok) {
        console.log('❌ N8N WEBHOOK ОШИБКА:', webhookResponse.status, webhookResponse.statusText);
        const errorText = await webhookResponse.text();
        console.log('Текст ошибки n8n:', errorText);
        throw new Error(`N8N webhook error: ${webhookResponse.status}`);
      }

      console.log('✅ N8N WEBHOOK УСПЕШНО');
      const webhookData = await webhookResponse.text();
      console.log('📥 Ответ от n8n:', webhookData.substring(0, 200));

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('💥 ОШИБКА ЗАПРОСА К N8N:', fetchError.message);
      
      if (fetchError.name === 'AbortError') {
        console.log('⏰ Таймаут запроса к n8n (10 секунд)');
      }
      
      return new Response(JSON.stringify({ 
        error: 'Failed to process message with n8n',
        success: false,
        details: fetchError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Возвращаем быстрый ответ клиенту
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Message sent to processing',
      chatId: chatId,
      userId: userId,
      status: 'processing'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА в chat-with-ai:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
