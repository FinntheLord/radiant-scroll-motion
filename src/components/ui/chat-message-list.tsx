
import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props }, _ref) => {
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
            "flex flex-col w-full h-full px-4 py-6",
            // Desktop scroll functionality
            "md:overflow-y-auto md:overflow-x-hidden",
            "md:scrollbar-thin md:scrollbar-thumb-gray-600 md:scrollbar-track-transparent",
            // Mobile - no scroll, fixed height
            "overflow-hidden",
            className
          )}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          style={{
            WebkitOverflowScrolling: smooth ? 'touch' : 'auto',
            scrollBehavior: smooth ? 'smooth' : 'auto'
          }}
          {...props}
        >
          <div className="flex flex-col space-y-4 min-h-full">{children}</div>
        </div>

        {/* Hide scroll-to-bottom button on mobile */}
        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 shadow-lg z-10 hidden md:flex"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
