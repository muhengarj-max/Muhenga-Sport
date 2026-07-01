export default function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton h-56 rounded-[8px] border border-white/10" />
      ))}
    </div>
  );
}
