import { Link } from 'react-router-dom';
import { Activity, BarChart3, Bot, HeartPulse, Music, PenLine, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useAnalytics();

  const dominantMood = data?.dominant_mood || 'balanced';

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.username}`}
        subtitle="A calm command center for emotional insight, journaling, music, and conversation."
        actions={
          <>
            <Link to="/journal">
              <Button>
                <PenLine size={18} />
                Journal
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="secondary">
                <Bot size={18} />
                Chat
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Journal entries"
          value={loading ? '...' : data?.total_journal_entries ?? 0}
          tone="sage"
          icon={PenLine}
          helper="Private reflections stored locally"
        />
        <MetricCard
          label="Dominant mood"
          value={dominantMood}
          tone="coral"
          icon={HeartPulse}
          helper="Based on recent journal patterns"
        />
        <MetricCard
          label="Wellness score"
          value={loading ? '...' : data?.wellness_score ?? 72}
          tone="amber"
          icon={Activity}
          helper="Sentiment-weighted estimate"
        />
        <MetricCard
          label="Sentiment types"
          value={Object.keys(data?.sentiment_distribution || {}).length}
          tone="plum"
          icon={BarChart3}
          helper="Positive, neutral, negative mix"
        />
      </div>

      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <article className="panel border-l-8 border-sage/50 rounded-[1.75rem] p-6 shadow-soft lg:col-span-2 bg-gradient-to-br from-sage/12 to-transparent">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage text-white shadow-soft shadow-sage/30">
                  <Sparkles size={22} />
                </span>
                <h2 className="text-xl font-semibold text-sage">Emotional insight</h2>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700">
                Your current pattern points toward <span className="font-bold text-sage">{dominantMood}</span>.
                Capture what is driving that state, then compare trends across the week for a steadier read.
              </p>
            </div>
            <span className="badge bg-sage/15 text-sage border-sage/30">Live summary</span>
          </div>
        </article>

        <article className="panel border-l-8 border-coral/50 rounded-[1.75rem] p-6 shadow-soft bg-gradient-to-br from-coral/12 to-transparent">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-coral text-white shadow-soft shadow-coral/30">
              <Music size={22} />
            </span>
            <h2 className="text-xl font-semibold text-coral">Music nudge</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Generate a playlist recommendation from your mood when you want a quick shift in energy.
          </p>
          <Link className="mt-5 block" to="/music">
            <Button variant="secondary" className="w-full">
              <Music size={18} />
              Open music
            </Button>
          </Link>
        </article>
      </section>
    </>
  );
}
