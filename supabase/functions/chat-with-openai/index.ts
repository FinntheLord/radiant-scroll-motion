
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

// Функция для отправки на webhook
async function sendToWebhook(url: string, payload: any): Promise<any> {
  console.log(`Отправка на webhook: ${url}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log(`Статус ответа от ${url}:`, response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Ошибка webhook ${url}:`, response.status, errorText);
    throw new Error(`Webhook error: ${response.status} - ${errorText}`);
  }

  let responseData;
  try {
    responseData = await response.json();
    console.log(`Данные ответа от ${url}:`, responseData);
  } catch (e) {
    const responseText = await response.text();
    console.log(`Текстовый ответ от ${url}:`, responseText);
    responseData = { message: responseText || 'Спасибо за сообщение! Мы обработаем ваш запрос.' };
  }

  return responseData;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, userId, chatId, isResponse, aiResponse } = await req.json();

    // Обработка входящего ответа от n8n
    if (isResponse && aiResponse) {
      console.log('Processing AI response from n8n:', { userId, chatId, aiResponse });
      
      return new Response(JSON.stringify({ 
        success: true,
        message: aiResponse,
        messageId: generateId(),
        userId: userId,
        chatId: chatId,
        type: 'ai_response'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Обработка исходящего сообщения пользователя
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
      responseUrl: `https://mdlyglpbdqvgwnayumhh.supabase.co/functions/v1/receive-ai-response`,
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

    let responseData;
    let usedTestWebhook = false;

    try {
      // Сначала пробуем основной webhook
      responseData = await sendToWebhook(N8N_WEBHOOK_URL, n8nPayload);
      console.log('Успешно отправлено на основной webhook');
    } catch (error) {
      console.warn('Основной webhook недоступен, пробуем тестовый:', error.message);
      
      try {
        // Если основной не работает, пробуем тестовый
        responseData = await sendToWebhook(N8N_WEBHOOK_TEST_URL, n8nPayload);
        usedTestWebhook = true;
        console.log('Успешно отправлено на тестовый webhook');
      } catch (testError) {
        console.error('Оба webhook недоступны:', testError.message);
        throw new Error('Все n8n webhooks недоступны');
      }
    }

    // Извлекаем сообщение из ответа n8n
    let aiMessage = '';
    
    if (responseData && typeof responseData === 'object') {
      // Пробуем разные возможные структуры ответа
      aiMessage = responseData.message || 
                 responseData.response || 
                 responseData.text || 
                 responseData.output ||
                 responseData.reply ||
                 responseData.content ||
                 (responseData.data && responseData.data.message) ||
                 (responseData.result && responseData.result.message);
                 
      // Проверяем, не является ли это служебным сообщением о запуске
      if (aiMessage === 'Workflow was started' || aiMessage === 'Workflow started' || !aiMessage) {
        console.log('Получено служебное сообщение, ждем реального ответа...');
        aiMessage = language === 'en' 
          ? 'I\'m processing your message. Please wait for the response...'
          : 'Обробляю ваше повідомлення. Зачекайте на відповідь...';
      }
    } else if (typeof responseData === 'string') {
      aiMessage = responseData;
      // Проверяем служебные сообщения
      if (aiMessage === 'Workflow was started' || aiMessage === 'Workflow started') {
        aiMessage = language === 'en' 
          ? 'I\'m processing your message. Please wait for the response...'
          : 'Обробляю ваше повідомлення. Зачекайте на відповідь...';
      }
    } else {
      aiMessage = language === 'en' 
        ? 'Thank you for your message! We will process your request.'
        : 'Спасибо за сообщение! Мы обработаем ваш запрос.';
    }

    console.log('Final AI message:', aiMessage);
    console.log('Used test webhook:', usedTestWebhook);

    return new Response(JSON.stringify({ 
      message: aiMessage,
      messageId: messageId,
      userId: currentUserId,
      chatId: currentChatId,
      usedTestWebhook: usedTestWebhook
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
