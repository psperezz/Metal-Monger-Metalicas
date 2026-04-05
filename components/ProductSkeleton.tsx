export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-ink-border flex flex-col animate-skeleton">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="mt-2 h-5 bg-gray-200 rounded w-1/3" />
        <div className="mt-1 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded w-24" />
            <div className="h-2 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-6 w-6 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
