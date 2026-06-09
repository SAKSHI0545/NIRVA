import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import { journalService } from '../services/journalService';
import { formatDate } from '../utils/formatters';

const moodFilters = ['All', 'Happy', 'Sad', 'Angry', 'Anxious', 'Balanced'];
const pageSize = 8;

function SkeletonCard() {
  return (
    <article className="panel rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mb-3 h-3 w-36 animate-pulse rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </article>
  );
}

export default function CommunityPage() {
  const [journals, setJournals] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [mood, setMood] = useState('All');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError('');
    journalService
      .community({
        page,
        page_size: pageSize,
        search: search.trim() || undefined,
        mood: mood === 'All' ? undefined : mood,
      })
      .then((data) => {
        setJournals(data.items);
        setTotal(data.total);
      })
      .catch((err) => setError(err.response?.data?.detail || 'Unable to load community journals'))
      .finally(() => setIsLoading(false));
  }, [mood, page, search]);

  return (
    <>
      <PageHeader title="Community" subtitle="Public journals shared by NIRVA members." />

      <section className="space-y-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/78 p-3 shadow-sm lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              className="field pl-10"
              placeholder="Search username, mood, or journal"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {moodFilters.map((item) => (
              <Button
                key={item}
                type="button"
                variant={mood === item ? 'primary' : 'secondary'}
                className="min-h-10 px-3"
                onClick={() => {
                  setMood(item);
                  setPage(1);
                }}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {error ? <p className="rounded-lg bg-coral/20 p-3 text-sm font-medium text-coral">{error}</p> : null}

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : null}

        {!isLoading && journals.length === 0 ? (
          <EmptyState title="No public journals available." message="Try a different search or mood filter." />
        ) : null}

        {!isLoading && journals.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {journals.map((journal) => (
              <article key={journal.id} className="panel rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-ink">{journal.username}</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">{formatDate(journal.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge capitalize text-sage">{journal.mood}</span>
                    <span className="badge capitalize text-slate-500">{journal.sentiment}</span>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{journal.entry}</p>
              </article>
            ))}
          </div>
        ) : null}

        {total > pageSize ? <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} /> : null}
      </section>
    </>
  );
}
