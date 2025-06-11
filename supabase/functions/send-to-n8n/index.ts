
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, chatId } = await req.json()
    
    console.log('Отправка сообщения в n8n:', { message, chatId })

    if (!message || !chatId) {
      return new Response(
        JSON.stringify({ error: 'Требуются поля message и chatId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Отправляем POST запрос на n8n webhook
    const n8nResponse = await fetch('https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chatId: chatId
      })
    })

    if (!n8nResponse.ok) {
      console.error('Ошибка отправки в n8n:', n8nResponse.status, n8nResponse.statusText)
      return new Response(
        JSON.stringify({ error: 'Ошибка отправки в n8n' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Сообщение успешно отправлено в n8n')
    
    return new Response(
      JSON.stringify({ success: true, message: 'Сообщение отправлено в n8n' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Ошибка в send-to-n8n function:', error)
    return new Response(
      JSON.stringify({ error: 'Внутренняя ошибка сервера' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
