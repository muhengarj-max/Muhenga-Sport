export default function Loading() {
  return (
    <div className="section-shell grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton h-56 rounded-[8px] border border-white/10" />
      ))}
    </div>
  );
}
