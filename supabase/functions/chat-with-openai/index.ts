
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// n8n webhook URLs
const N8N_WEBHOOK_URL = "https://n8n.srv838454.hstgr.cloud/webhook/84ac1eaf-efe6-4517-bc28-5b239286b274";
const N8N_WEBHOOK_TEST_URL = "https://n8n.srv838454.hstgr.cloud/webhook-test/84ac1eaf-efe6-4517-bc28-5b239286b274";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Функция для генерации уникального ID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, userId, chatId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Received message for n8n:', { message, language, userId, chatId });

    // Генерируем уникальные ID если не переданы
    const currentUserId = userId || generateId();
    const currentChatId = chatId || generateId();
    const messageId = generateId();

    // Формируем данные в формате, ожидаемом n8n
    const n8nPayload = {
      messageId: messageId,
      userId: currentUserId,
      chatId: currentChatId,
      message: message,
      language: language || 'uk',
      timestamp: Date.now(),
      source: 'connexi-chat',
      client: {
        id: currentUserId,
        chatId: currentChatId,
        browserLanguage: language || 'uk',
        chatLanguage: language || 'uk',
        displayedName: "Chat User",
        hostName: "connexi.io"
      },
      messages: [
        {
          id: messageId,
          type: "client",
          message: message,
          text: message,
          html: message,
          timestamp: Date.now(),
          createdAt: Date.now(),
          isFromOfflineForm: false,
          isAuto: false,
          isTrigger: false,
          isPushed: false,
          isOffline: false,
          isMissed: false,
          isMissedByClient: false
        }
      ],
      conversationId: currentChatId,
      eventName: "chatMessage"
    };

    console.log('Sending to n8n webhook:', JSON.stringify(n8nPayload, null, 2));

    // Отправляем данные в n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    });

    console.log('N8N response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('N8N webhook error:', response.status, errorText);
      throw new Error(`N8N webhook error: ${response.status}`);
    }

    let responseData;
    try {
      responseData = await response.json();
      console.log('N8N response data:', responseData);
    } catch (e) {
      // Если ответ не в формате JSON, используем текст
      const responseText = await response.text();
      console.log('N8N response text:', responseText);
      responseData = { message: responseText || 'Спасибо за сообщение! Мы обработаем ваш запрос.' };
    }

    // Извлекаем сообщение из ответа n8n
    let aiMessage = '';
    
    if (responseData && typeof responseData === 'object') {
      // Пробуем разные возможные структуры ответа
      aiMessage = responseData.message || 
                 responseData.response || 
                 responseData.text || 
                 responseData.output ||
                 (responseData.data && responseData.data.message) ||
                 'Спасибо за сообщение! Мы обработаем ваш запрос.';
    } else if (typeof responseData === 'string') {
      aiMessage = responseData;
    } else {
      aiMessage = 'Спасибо за сообщение! Мы обработаем ваш запрос.';
    }

    console.log('Final AI message:', aiMessage);

    return new Response(JSON.stringify({ 
      message: aiMessage,
      messageId: messageId,
      userId: currentUserId,
      chatId: currentChatId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-openai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      details: 'Please check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
