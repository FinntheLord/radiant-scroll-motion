
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    // Auto-resize functionality
    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = `${Math.min(target.scrollHeight, 128)}px`; // Max height of 128px (8rem)
      
      // Call original onChange if provided
      if (props.onChange) {
        props.onChange(e as React.ChangeEvent<HTMLTextAreaElement>);
      }
    };

    return (
      <Textarea
        autoComplete="off"
        ref={ref}
        name="message"
        onInput={handleInput}
        className={cn(
          "min-h-12 max-h-32 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md resize-none overflow-y-auto",
          "touch-manipulation", // Better touch experience on mobile
          className,
        )}
        {...props}
      />
    );
  },
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
