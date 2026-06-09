export default function MetricCard({ label, value, tone = 'sage', icon: Icon, helper }) {
  const toneConfigs = {
    sage: { bg: 'from-sage to-sage/80', border: 'border-sage/40', text: 'text-sage', icon: 'bg-sage text-white shadow-soft shadow-sage/30' },
    coral: { bg: 'from-coral to-coral/80', border: 'border-coral/40', text: 'text-coral', icon: 'bg-coral text-white shadow-soft shadow-coral/30' },
    amber: { bg: 'from-amber to-amber/80', border: 'border-amber/40', text: 'text-amber', icon: 'bg-amber text-white shadow-soft shadow-amber/30' },
    plum: { bg: 'from-plum to-plum/80', border: 'border-plum/40', text: 'text-plum', icon: 'bg-plum text-white shadow-soft shadow-plum/30' },
  };

  const config = toneConfigs[tone];

  return (
    <article className={`panel border-l-8 ${config.border} rounded-[1.75rem] p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-soft bg-gradient-to-br ${config.bg}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${config.text}`}>{label}</p>
          <p className="mt-3 text-3xl font-bold leading-none text-ink">{value}</p>
        </div>
        {Icon ? (
          <span className={`grid h-12 w-12 place-items-center rounded-2xl ${config.icon}`}>
            <Icon size={20} className="text-current" />
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-4 text-sm text-slate-600">{helper}</p> : null}
    </article>
  );
}
