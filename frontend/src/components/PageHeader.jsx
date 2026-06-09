export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-7 rounded-[2rem] bg-white/90 p-6 shadow-card border border-slate-200/70">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Personal dashboard</p>
          <h1 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-[2.2rem]">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
