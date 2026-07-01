import { AlertTriangle } from "lucide-react";

export default function ErrorState({ title = "Could not load matches", message }: { title?: string; message?: string }) {
  return (
    <div className="glass mx-auto flex max-w-lg flex-col items-center rounded-[8px] p-8 text-center">
      <AlertTriangle className="mb-4 h-8 w-8 text-[#00C853]" />
      <h2 className="text-lg font-black uppercase tracking-wide">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/60">
        {message ?? "The streaming API is not responding right now. Please refresh in a moment."}
      </p>
    </div>
  );
}
