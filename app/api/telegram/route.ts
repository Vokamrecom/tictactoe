import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, promoCode, chatId } = body;

    // Получаем переменные окружения (токен бота должен быть настроен)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
    
    // Chat ID теперь приходит от пользователя, а не из переменных окружения
    const CHAT_ID = chatId || '';

    console.log('Telegram Bot Config:', { 
      hasToken: !!BOT_TOKEN, 
      hasChatId: !!CHAT_ID,
      chatId: CHAT_ID,
      tokenLength: BOT_TOKEN.length
    });

    if (!BOT_TOKEN) {
      console.warn('Telegram Bot токен не настроен');
      return NextResponse.json({ 
        success: false, 
        message: 'Telegram Bot не настроен на сервере' 
      });
    }

    if (!CHAT_ID) {
      console.warn('Chat ID не предоставлен пользователем');
      return NextResponse.json({ 
        success: false, 
        message: 'Chat ID не указан. Пожалуйста, укажите ваш Telegram Chat ID.' 
      });
    }

    let message = '';

    if (type === 'win' && promoCode) {
      message = `🎉 Победа! Промокод выдан: ${promoCode}`;
    } else if (type === 'lose') {
      message = '😔 Проигрыш';
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Неверный тип сообщения' 
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const requestBody = {
      chat_id: CHAT_ID,
      text: message,
    };

    console.log('Отправка в Telegram:', { url: telegramUrl.replace(BOT_TOKEN, '***'), chatId: CHAT_ID, message });

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('Ответ Telegram API:', data);

    if (!response.ok) {
      console.error('Ошибка отправки в Telegram:', data);
      return NextResponse.json({ 
        success: false, 
        error: data,
        details: `Ошибка: ${data.description || 'Неизвестная ошибка'}` 
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Сообщение отправлено' 
    });
  } catch (error) {
    console.error('Ошибка при отправке в Telegram:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 });
  }
}

