'use client';

import { useState, useEffect } from 'react';

interface TelegramSetupProps {
  onChatIdSet: (chatId: string) => void;
}

// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
        };
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

export default function TelegramSetup({ onChatIdSet }: TelegramSetupProps) {
  const [chatId, setChatId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      
      // Пытаемся получить данные пользователя автоматически
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      
      if (user?.id) {
        const telegramChatId = String(user.id);
        localStorage.setItem('telegram_chat_id', telegramChatId);
        onChatIdSet(telegramChatId);
        setIsAutoDetected(true);
        console.log('Telegram Chat ID автоматически определен:', telegramChatId);
        return;
      }
    }

    // Если не открыто через Telegram, проверяем localStorage
    const savedChatId = localStorage.getItem('telegram_chat_id');
    if (savedChatId) {
      onChatIdSet(savedChatId);
    } else {
      setIsVisible(true);
    }
  }, [onChatIdSet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatId.trim()) {
      localStorage.setItem('telegram_chat_id', chatId.trim());
      onChatIdSet(chatId.trim());
      setIsVisible(false);
    }
  };

  const handleChange = () => {
    setIsVisible(true);
    localStorage.removeItem('telegram_chat_id');
  };

  if (!isVisible) {
    return (
      <div className="mb-4 text-center">
        <p className="text-sm text-pink-600 mb-2">
          {isAutoDetected ? (
            <>Telegram подключен автоматически ✨</>
          ) : (
            <>Telegram Chat ID сохранен ✅</>
          )}
        </p>
        {!isAutoDetected && (
          <button
            onClick={handleChange}
            className="text-xs text-pink-500 hover:text-pink-700 underline"
          >
            Изменить Chat ID
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-2 border-pink-200">
      <h2 className="text-lg font-bold text-pink-700 mb-2">
        📱 Настройка Telegram уведомлений
      </h2>
      <p className="text-sm text-pink-600 mb-3">
        {typeof window !== 'undefined' && window.Telegram?.WebApp 
          ? 'Откройте игру через бота в Telegram для автоматического подключения, или введите Chat ID вручную:'
          : 'Чтобы получать промокоды в Telegram, введите ваш Chat ID:'
        }
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="chatId" className="block text-xs font-medium text-pink-700 mb-1">
            Ваш Telegram Chat ID:
          </label>
          <input
            type="text"
            id="chatId"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Например: 123456789"
            className="w-full px-4 py-2 rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:outline-none text-sm"
            required
          />
          <p className="text-xs text-pink-600 mt-1">
            💡 <strong>Совет:</strong> Откройте игру через бота в Telegram - Chat ID определится автоматически!
            <br />
            Или напишите <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="underline font-semibold">@userinfobot</a> и отправьте /start
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md"
        >
          Сохранить ✨
        </button>
      </form>
    </div>
  );
}
