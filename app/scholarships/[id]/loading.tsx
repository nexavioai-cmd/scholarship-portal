export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Skeleton Image */}
        <div className="h-80 w-full bg-gray-200 rounded-3xl mb-8" />
        
        {/* Skeleton Title & Provider */}
        <div className="space-y-3 mb-8">
          <div className="h-10 w-2/3 bg-gray-200 rounded-lg" />
          <div className="h-6 w-1/3 bg-gray-200 rounded-lg" />
        </div>

        {/* Skeleton Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>

        {/* Skeleton Description */}
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded-lg" />
          <div className="h-4 w-full bg-gray-200 rounded-lg" />
          <div className="h-4 w-full bg-gray-200 rounded-lg" />
          <div className="h-4 w-3/4 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </main>
  );
}