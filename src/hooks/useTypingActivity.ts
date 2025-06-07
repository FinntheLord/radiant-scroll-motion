
import { useState, useEffect } from 'react';

export const useTypingActivity = () => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleInput = () => {
      setIsTyping(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsTyping(false);
      }, 2000); // Светофор остается активным 2 секунды после окончания ввода
    };

    // Отслеживаем все input, textarea и contenteditable элементы
    const inputElements = document.querySelectorAll('input, textarea, [contenteditable="true"]');
    
    inputElements.forEach(element => {
      element.addEventListener('input', handleInput);
      element.addEventListener('keydown', handleInput);
    });

    // Также отслеживаем динамически добавляемые элементы
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const newInputs = element.querySelectorAll('input, textarea, [contenteditable="true"]');
            newInputs.forEach(input => {
              input.addEventListener('input', handleInput);
              input.addEventListener('keydown', handleInput);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeoutId);
      inputElements.forEach(element => {
        element.removeEventListener('input', handleInput);
        element.removeEventListener('keydown', handleInput);
      });
      observer.disconnect();
    };
  }, []);

  return isTyping;
};
