export default function SectionHeader({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) {
  return (
    <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#00C853]">{eyebrow}</p>}
        <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {copy && <p className="max-w-xl text-sm leading-6 text-white/55">{copy}</p>}
    </div>
  );
}
