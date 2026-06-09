import { ShieldCheck, Sparkles, Waves } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen surface px-4 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-soft backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="auth-art hidden flex-col justify-between p-10 lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white/88">
              <Sparkles size={16} />
              AI-powered emotional wellness
            </div>
            <h1 className="mt-12 max-w-lg text-5xl font-semibold leading-tight text-white">NIRVA</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/72">
              A polished private workspace for journaling, emotional insight, music nudges, and reflective chat.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              { icon: ShieldCheck, label: 'Secure JWT sessions and bcrypt password hashing' },
              { icon: Waves, label: 'Mood-aware insights across journal and chat activity' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/80">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-white">
                  <Icon size={18} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </aside>
        <div className="flex items-center justify-center p-5 sm:p-8">
          <section className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">NIRVA</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>
            <div className="panel rounded-[1.75rem] p-6 sm:p-7">{children}</div>
            {footer ? <div className="mt-5 text-center text-sm text-slate-500">{footer}</div> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
