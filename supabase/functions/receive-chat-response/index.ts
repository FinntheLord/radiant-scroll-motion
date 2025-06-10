
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

    console.log('Проверка ответа для chat ID:', chatId);
    
    // Делаем запрос к receive-ai-response для получения сохраненного ответа
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/receive-ai-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({ 
        action: 'get_response',
        chatId: chatId 
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.message) {
        console.log('Найден ответ для чата:', chatId);
        
        return new Response(JSON.stringify({ 
          success: true,
          message: data.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Если ответа нет, возвращаем success: false
    console.log('Ответ не найден для чата:', chatId);
    return new Response(JSON.stringify({ 
      success: false,
      message: null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in receive-chat-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
