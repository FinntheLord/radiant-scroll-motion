
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
    const { chatId } = await req.json();

    if (!chatId) {
      console.log('❌ ОТСУТСТВУЕТ CHAT ID в запросе');
      return new Response(JSON.stringify({ 
        error: 'Missing chatId',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('=== RECEIVE-CHAT-RESPONSE ===');
    console.log('🔍 ПРОВЕРКА ОТВЕТА для chat ID:', chatId);
    
    // Получаем конфигурацию Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    console.log('📡 ВЫЗОВ receive-ai-response функции...');
    
    // Делаем запрос к receive-ai-response для получения сохраненного ответа
    const response = await fetch(`${supabaseUrl}/functions/v1/receive-ai-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ 
        action: 'get_response',
        chatId: chatId 
      })
    });

    if (!response.ok) {
      console.log('❌ ОШИБКА при запросе к receive-ai-response:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Текст ошибки:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📥 ОТВЕТ ОТ receive-ai-response:', data);
    
    if (data.success && data.message) {
      console.log('✅ НАЙДЕН ОТВЕТ для чата:', chatId);
      console.log('Длина ответа:', data.message.length, 'символов');
      
      return new Response(JSON.stringify({ 
        success: true,
        message: data.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если ответа нет, возвращаем success: false
    console.log('❌ ОТВЕТ НЕ НАЙДЕН для чата:', chatId);
    return new Response(JSON.stringify({ 
      success: false,
      message: null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА в receive-chat-response:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
