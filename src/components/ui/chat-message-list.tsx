
import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props }, _ref) => {
    const isMobile = useIsMobile();
    const {
      scrollRef,
      isAtBottom,
      autoScrollEnabled,
      scrollToBottom,
      disableAutoScroll,
    } = useAutoScroll({
      smooth,
      content: children,
    });

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "flex flex-col w-full h-full overflow-y-auto overflow-x-hidden",
            // Улучшенный скролл для мобильных
            isMobile ? "px-4 py-4" : "px-4 py-6",
            // Кастомный скроллбар на десктопе
            "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500",
            // Smooth scrolling для мобильных
            isMobile && "scroll-smooth",
            className
          )}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchStart={disableAutoScroll}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: smooth ? 'smooth' : 'auto',
            // Улучшенная производительность скролла на мобильных
            ...(isMobile && {
              overscrollBehavior: 'contain',
              scrollSnapType: 'y proximity'
            })
          }}
          {...props}
        >
          <div className={cn(
            "flex flex-col min-h-full",
            isMobile ? "space-y-3" : "space-y-4"
          )}>
            {children}
          </div>
        </div>

        {/* Кнопка скролла вниз - адаптивная */}
        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className={cn(
              "absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 shadow-lg z-10",
              isMobile ? "h-10 w-10" : "h-12 w-12"
            )}
            aria-label="Scroll to bottom"
          >
            <ArrowDown className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
          </Button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
