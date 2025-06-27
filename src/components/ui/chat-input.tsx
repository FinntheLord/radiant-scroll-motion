
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend?: () => void;
  autoFocus?: boolean;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, onSend, onKeyDown, autoFocus = false, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;
    const isMobile = useIsMobile();

    React.useEffect(() => {
      if (autoFocus && !isMobile && textareaRef && 'current' in textareaRef && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [autoFocus, isMobile, textareaRef]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSend?.();
      }
      onKeyDown?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = 'auto';
      
      // Адаптивная максимальная высота
      const maxHeight = isMobile ? 120 : 150;
      const newHeight = Math.min(target.scrollHeight, maxHeight);
      target.style.height = `${newHeight}px`;
      
      // Обработка onChange
      const changeEvent = {
        ...e,
        target: target,
        currentTarget: target,
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      if (props.onChange) {
        props.onChange(changeEvent);
      }
    };

    return (
      <textarea
        autoComplete="off"
        ref={textareaRef}
        name="message"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[48px] w-full resize-none border-0 bg-transparent focus:outline-none focus:ring-0",
          // Мобильная оптимизация
          isMobile ? "px-3 py-3 text-base max-h-[120px]" : "px-4 py-3 text-base max-h-[150px]",
          "text-gray-100 placeholder:text-gray-400",
          // Улучшенная мобильная типографика
          "leading-relaxed",
          // Отключаем зум на iOS
          isMobile && "text-[16px]",
          // Сенсорная оптимизация
          "touch-manipulation",
          className,
        )}
        rows={1}
        style={{
          // Отключаем ресайз на мобильных
          resize: isMobile ? 'none' : 'vertical',
          // Улучшенная производительность на мобильных
          ...(isMobile && {
            WebkitAppearance: 'none',
            WebkitTapHighlightColor: 'transparent'
          })
        }}
        {...props}
      />
    );
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
