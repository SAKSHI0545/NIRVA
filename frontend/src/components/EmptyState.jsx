export default function EmptyState({ title, message }) {
  return (
    <div className="soft-panel rounded-xl border-dashed p-8 text-center">
      <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-sage/30" />
      <p className="font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
    </div>
  );
}
