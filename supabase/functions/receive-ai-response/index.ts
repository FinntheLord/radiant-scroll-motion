
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Временное хранилище ответов от n8n
const responseStore = new Map<string, string>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { message, chatId, userId, action } = body;

    // Если это запрос на получение ответа
    if (action === 'get_response' && chatId) {
      console.log('Запрос на получение ответа для chat ID:', chatId);
      
      const storedResponse = responseStore.get(chatId);
      
      if (storedResponse) {
        console.log('Найден ответ для чата:', chatId);
        
        // Удаляем ответ после получения
        responseStore.delete(chatId);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: storedResponse
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        success: false,
        message: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Если это сохранение ответа от n8n
    if (!message || !chatId) {
      throw new Error('Missing required fields: message, chatId');
    }

    console.log('Received AI response from n8n:', { 
      chatId, 
      userId,
      message: message.substring(0, 100) + '...' 
    });

    // Сохраняем ответ в временное хранилище
    responseStore.set(chatId, message);

    console.log('Successfully stored AI response for chat:', chatId);

    return new Response(JSON.stringify({ 
      success: true,
      chatId: chatId,
      status: 'response_stored',
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
