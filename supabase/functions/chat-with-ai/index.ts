
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
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: message and chatId',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('=== CHAT-WITH-AI ===');
    console.log('📨 Message:', message.substring(0, 50) + '...');
    console.log('🆔 Chat ID:', chatId);

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Простой запрос к n8n без сложной логики
    const webhookPayload = {
      message: message,
      chat_id: chatId,
      user_id: userId
    };

    console.log('📡 Sending to n8n...');

    try {
      const response = await fetch('https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
        signal: AbortSignal.timeout(8000) // 8 секунд таймаут
      });

      if (response.ok) {
        console.log('✅ N8N request successful');
      } else {
        console.log('❌ N8N request failed:', response.status);
      }
    } catch (error) {
      console.log('❌ N8N request error:', error.message);
    }

    // Всегда возвращаем успешный ответ клиенту
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
    console.error('💥 Error:', error.message);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
