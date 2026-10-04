interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded-md h-4",
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantStyles[variant]} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36 mt-2" />
      <Skeleton className="h-3 w-20 mt-1" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className={`h-4 ${i === 0 ? "w-32" : i === 1 ? "w-24" : "w-16"}`} />
        </td>
      ))}
    </tr>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 h-96">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>
    </div>
  );
}
