
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Улучшенное глобальное хранилище
const responseStore = new Map<string, { 
  message: string; 
  timestamp: number;
  userId?: string;
}>();

const TTL = 120000; // 2 минуты

// Функция очистки старых записей
const cleanupOldEntries = () => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [key, value] of responseStore.entries()) {
    if (now - value.timestamp > TTL) {
      responseStore.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`🧹 Очищено старых записей: ${cleanedCount}`);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('=== RECEIVE-AI-RESPONSE ===');
    
    const { message, chatId, chat_id, userId, action } = body;
    const finalChatId = chatId || chat_id;

    // Очистка при каждом запросе
    cleanupOldEntries();

    // Запрос на получение ответа
    if (action === 'get_response' && finalChatId) {
      console.log('🔍 ПОИСК ОТВЕТА для:', finalChatId);
      console.log('📦 Размер хранилища:', responseStore.size);
      
      const storedData = responseStore.get(finalChatId);
      
      if (storedData) {
        const age = Math.round((Date.now() - storedData.timestamp) / 1000);
        console.log('✅ ОТВЕТ НАЙДЕН, возраст:', age, 'сек');
        
        // Удаляем ответ после получения
        responseStore.delete(finalChatId);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedData.message,
          retrievedAt: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('❌ ОТВЕТ НЕ НАЙДЕН');
      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Сохранение ответа от n8n
    if (message && finalChatId) {
      console.log('💾 СОХРАНЕНИЕ ОТВЕТА ОТ N8N');
      console.log('Chat ID:', finalChatId);
      console.log('Длина сообщения:', message.length);

      responseStore.set(finalChatId, {
        message: message,
        timestamp: Date.now(),
        userId: userId
      });

      console.log('✅ ОТВЕТ СОХРАНЕН');
      console.log('📊 Размер хранилища:', responseStore.size);

      return new Response(JSON.stringify({ 
        success: true,
        chatId: finalChatId,
        status: 'response_stored'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('❌ НЕДОСТАТОЧНО ДАННЫХ');
    return new Response(JSON.stringify({
      error: 'Missing required fields',
      success: false
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 ОШИБКА:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
