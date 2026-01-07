import { cn } from "./utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md relative overflow-hidden", className)}
      {...props}
    >
      {shimmer && (
        <div className="absolute inset-0 animate-shimmer" />
      )}
    </div>
  );
}

export { Skeleton };
