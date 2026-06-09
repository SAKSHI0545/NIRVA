import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyState from '../components/EmptyState';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import { useAnalytics } from '../hooks/useAnalytics';
import { toChartRows } from '../utils/formatters';

const palette = ['#4f8f80', '#df7962', '#efb34f', '#7b6695', '#4f8a9b'];

export default function AnalyticsPage() {
  const { data, loading, error } = useAnalytics();
  const moodRows = toChartRows(data?.mood_distribution);
  const sentimentRows = toChartRows(data?.sentiment_distribution);
  const weeklyRows = data?.weekly_trends || [];
  const monthlyRows = data?.monthly_trends || [];

  return (
    <>
      <PageHeader title="Analytics" subtitle="Mood distribution, sentiment balance, and wellness trends." />
      {error ? <p className="rounded-lg bg-coral/20 p-3 text-sm font-medium text-coral">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total entries" value={loading ? '...' : data?.total_journal_entries ?? 0} tone="sage" />
        <MetricCard label="Dominant mood" value={data?.dominant_mood || 'balanced'} tone="coral" />
        <MetricCard label="Wellness score" value={data?.wellness_score ?? 72} tone="amber" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Mood distribution</h2>
          {moodRows.length ? (
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={moodRows} dataKey="value" nameKey="name" outerRadius={92} innerRadius={48} paddingAngle={3}>
                    {moodRows.map((row, index) => <Cell key={row.name} fill={palette[index % palette.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No mood data" message="Journal entries will appear here." />
          )}
        </section>

        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Sentiment distribution</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={sentimentRows}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f8f80" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Weekly trends</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={weeklyRows}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#df7962" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel rounded-2xl p-5">
          <h2 className="text-lg font-bold text-ink">Monthly trends</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={monthlyRows}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#7b6695" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}
