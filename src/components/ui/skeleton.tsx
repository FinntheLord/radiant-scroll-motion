
import { cn } from "@/lib/utils"
import { memo } from "react"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = memo<SkeletonProps>(({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
});

Skeleton.displayName = "Skeleton";

export { Skeleton }
