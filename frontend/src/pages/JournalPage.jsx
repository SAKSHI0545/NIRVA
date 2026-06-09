import { useEffect, useState } from 'react';
import { Edit3, Globe2, Lock, Search, Trash2, X } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import { journalService } from '../services/journalService';
import { formatDate } from '../utils/formatters';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ search: '', mood: '', date_from: '', date_to: '' });
  const [form, setForm] = useState({ mood: 'balanced', content: '', visibility: 'private' });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const pageSize = 6;
  const pagedEntries = entries.slice((page - 1) * pageSize, page * pageSize);

  const loadEntries = async () => {
    const data = await journalService.list({
      search: filters.search || undefined,
      mood: filters.mood || undefined,
      date_from: filters.date_from ? `${filters.date_from}T00:00:00` : undefined,
      date_to: filters.date_to ? `${filters.date_to}T23:59:59` : undefined,
    });
    setEntries(data);
    setPage(1);
  };

  useEffect(() => {
    loadEntries().catch((err) => setError(err.response?.data?.detail || 'Unable to load journals'));
  }, []);

  const createEntry = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingId) {
        await journalService.update(editingId, form);
      } else {
        await journalService.create(form);
      }
      setForm({ mood: 'balanced', content: '', visibility: 'private' });
      setEditingId(null);
      await loadEntries();
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to save journal');
    }
  };

  const deleteEntry = async (id) => {
    await journalService.remove(id);
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const editEntry = (entry) => {
    setEditingId(entry.id);
    setForm({ mood: entry.mood, content: entry.content, visibility: entry.visibility || 'private' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ mood: 'balanced', content: '', visibility: 'private' });
  };

  return (
    <>
      <PageHeader title="Journal" subtitle="Create private entries with mood and sentiment tracking." />
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <section className="panel rounded-2xl p-5">
          <div className="mb-5">
            <p className="text-lg font-bold text-ink">{editingId ? 'Edit reflection' : 'New reflection'}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Log the mood, capture the context, and let sentiment analysis do the quiet work.
            </p>
          </div>
          <form onSubmit={createEntry} className="space-y-4">
            <label className="block">
              <span className="label">Mood</span>
              <select className="field mt-1" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}>
                {['balanced', 'happy', 'sad', 'anxious', 'motivated', 'tired', 'angry'].map((mood) => (
                  <option key={mood}>{mood}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label">Entry</span>
              <textarea
                className="field mt-1 min-h-48 resize-y"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="label">Visibility</span>
              <select
                className="field mt-1"
                value={form.visibility}
                onChange={(e) => setForm({ ...form, visibility: e.target.value })}
              >
                <option value="private">Private 🔒</option>
                <option value="public">Public 🌍</option>
              </select>
            </label>
            {error ? <p className="rounded-lg bg-coral/20 px-3 py-2 text-sm font-medium text-coral">{error}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update entry' : 'Save entry'}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" onClick={cancelEdit} aria-label="Cancel edit">
                  <X size={18} />
                </Button>
              ) : null}
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/78 p-3 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                className="field pl-10"
                placeholder="Search entries"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <input
              className="field sm:w-48"
              placeholder="Filter mood"
              value={filters.mood}
              onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
            />
            <input
              className="field sm:w-44"
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            />
            <input
              className="field sm:w-44"
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            />
            <Button variant="secondary" onClick={loadEntries}>
              Apply
            </Button>
          </div>

          <div className="space-y-3">
            {entries.length === 0 ? (
              <EmptyState title="No entries yet" message="Write your first reflection to begin tracking patterns." />
            ) : (
              pagedEntries.map((entry) => (
                <article key={entry.id} className="panel rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <p className="badge capitalize text-sage">{entry.mood}</p>
                        <p className="badge flex items-center gap-1 capitalize text-slate-500">
                          {entry.visibility === 'public' ? <Globe2 size={13} /> : <Lock size={13} />}
                          {entry.visibility || 'private'}
                        </p>
                      </div>
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        {formatDate(entry.created_at)} - {entry.sentiment}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" aria-label="Edit entry" onClick={() => editEntry(entry)} className="icon-button hover:bg-ink hover:text-white">
                        <Edit3 size={17} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete entry"
                        onClick={() => deleteEntry(entry.id)}
                        className="icon-button text-coral hover:bg-coral hover:text-white"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{entry.content}</p>
                </article>
              ))
            )}
          </div>

          {entries.length > pageSize ? (
            <Pagination page={page} pageSize={pageSize} total={entries.length} onPageChange={setPage} />
          ) : null}
        </section>
      </div>
    </>
  );
}
