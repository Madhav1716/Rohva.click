export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-8">
        {/* Header */}
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        {/* Camera Icon Placeholder */}
        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
        
        {/* Button Placeholder */}
        <div className="h-12 bg-gray-200 rounded-full w-48"></div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 