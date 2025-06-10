
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Простое глобальное хранилище
const responseStore = new Map();
const TTL = 90000; // 1.5 минуты

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, chatId, chat_id, action } = body;
    const finalChatId = chatId || chat_id;

    console.log('=== RECEIVE-AI-RESPONSE ===');

    // Очистка старых записей
    const now = Date.now();
    for (const [key, value] of responseStore.entries()) {
      if (now - value.timestamp > TTL) {
        responseStore.delete(key);
      }
    }

    // Получение ответа
    if (action === 'get_response' && finalChatId) {
      console.log('🔍 Looking for response:', finalChatId);
      
      const storedData = responseStore.get(finalChatId);
      
      if (storedData) {
        console.log('✅ Response found');
        responseStore.delete(finalChatId); // Удаляем после получения
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('❌ Response not found');
      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Сохранение ответа от n8n
    if (message && finalChatId) {
      console.log('💾 Storing response from n8n');
      console.log('Chat ID:', finalChatId);

      responseStore.set(finalChatId, {
        message: message,
        timestamp: now
      });

      console.log('✅ Response stored, store size:', responseStore.size);

      return new Response(JSON.stringify({ 
        success: true,
        status: 'response_stored'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      error: 'Missing required fields',
      success: false
    }), {
      status: 400,
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
