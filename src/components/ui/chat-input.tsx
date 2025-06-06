
import * as React from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend?: () => void;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, onSend, onKeyDown, ...props }, ref) => {
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
      target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
      
      // Правильная обработка onChange
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
        ref={ref}
        name="message"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[48px] max-h-[120px] w-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-0",
          className,
        )}
        rows={1}
        {...props}
      />
    );
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
