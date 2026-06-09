import { useEffect, useState } from 'react';
import { Loader2, Music, Sparkles } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SpotifyPlaylistCard from '../components/SpotifyPlaylistCard';
import { journalService } from '../services/journalService';
import { musicService } from '../services/musicService';
import { formatDate } from '../utils/formatters';

const moods = ['happy', 'sad', 'stressed', 'anxious', 'calm', 'energetic', 'focused', 'balanced'];
const fallbackMoodMap = {
  motivated: 'energetic',
  tired: 'calm',
  angry: 'stressed',
  neutral: 'balanced',
};

export default function MusicPage() {
  const [mood, setMood] = useState('anxious');
  const [targetMood, setTargetMood] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState([]);
  const [latestJournalMood, setLatestJournalMood] = useState('');
  const [spotifyMood, setSpotifyMood] = useState('');
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [error, setError] = useState('');

  const load = () => musicService.history().then(setRecommendations);

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.detail || 'Unable to load music history'));
    journalService
      .list({})
      .then((entries) => {
        const detected = entries[0]?.mood;
        setLatestJournalMood(detected ? (fallbackMoodMap[detected] || detected) : '');
      })
      .catch(() => setLatestJournalMood(''));
  }, []);

  const recommend = async (event) => {
    event.preventDefault();
    await musicService.recommend({ mood, target_mood: targetMood || undefined });
    await load();
  };

  const loadSpotify = async (selectedMood = mood) => {
    setError('');
    setLoadingSpotify(true);
    try {
      const data = await musicService.spotifyRecommendations(selectedMood, 10);
      setSpotifyMood(data.mood);
      setSpotifyPlaylists(data.playlists);
    } catch (err) {
      setSpotifyPlaylists([]);
      setSpotifyMood('');
      setError(err.response?.data?.detail || 'Unable to load Spotify recommendations');
    } finally {
      setLoadingSpotify(false);
    }
  };

  const useLatestJournalMood = () => {
    if (!latestJournalMood) {
      return;
    }
    setMood(latestJournalMood);
    loadSpotify(latestJournalMood);
  };

  return (
    <>
      <PageHeader title="Music" subtitle="Turn a mood check-in into Spotify playlists for emotional regulation." />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <section className="panel rounded-2xl p-5">
          <div className="mb-5">
            <p className="text-lg font-bold text-ink">Spotify recommendations</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Choose a mood or use the latest journal mood.</p>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="label">Current mood</span>
              <select className="field mt-1" value={mood} onChange={(e) => setMood(e.target.value)}>
                {moods.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Button type="button" className="w-full" onClick={() => loadSpotify(mood)} disabled={loadingSpotify}>
              {loadingSpotify ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Show Spotify Playlists
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={useLatestJournalMood} disabled={!latestJournalMood || loadingSpotify}>
              <Music size={18} />
              Use Latest Journal Mood
            </Button>
            {latestJournalMood ? <p className="badge capitalize">Latest journal: {latestJournalMood}</p> : null}
          </div>

          <div className="my-6 border-t border-slate-200/80" />

          <div className="mb-5">
            <p className="text-base font-bold text-ink">Save local recommendation</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Keep NIRVA's internal playlist direction in your history.</p>
          </div>
          <form onSubmit={recommend} className="space-y-4">
            <label className="block">
              <span className="label">Target mood</span>
              <input className="field mt-1" placeholder="Optional" value={targetMood} onChange={(e) => setTargetMood(e.target.value)} />
            </label>
            <Button type="submit" className="w-full">
              <Music size={18} />
              Recommend
            </Button>
          </form>
        </section>

        <section className="space-y-6">
          {error ? <p className="rounded-lg bg-coral/15 px-4 py-3 text-sm font-semibold text-coral">{error}</p> : null}
          <div>
            <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-lg font-bold text-ink">Spotify playlists</p>
                <p className="text-sm text-slate-500">
                  {spotifyMood ? `Top ${spotifyPlaylists.length} playlists for ${spotifyMood}.` : 'Select a mood to load live recommendations.'}
                </p>
              </div>
            </div>
            {loadingSpotify ? (
              <div className="soft-panel flex min-h-56 items-center justify-center rounded-xl">
                <Loader2 className="animate-spin text-sage" size={28} />
              </div>
            ) : spotifyPlaylists.length === 0 ? (
              <EmptyState title="No Spotify playlists loaded" message="Choose a mood to see live playlist recommendations from Spotify." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {spotifyPlaylists.map((playlist) => (
                  <SpotifyPlaylistCard key={playlist.playlist_id} playlist={playlist} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-lg font-bold text-ink">Saved NIRVA history</p>
              <p className="text-sm text-slate-500">Internal recommendations generated from previous mood check-ins.</p>
            </div>
          {recommendations.length === 0 ? (
            <EmptyState title="No recommendations yet" message="Generate one from a mood to start your music history." />
          ) : (
            recommendations.map((item) => (
              <article key={item.id} className="panel rounded-2xl p-5">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <p className="font-bold capitalize text-ink">{item.detected_mood} to {item.target_mood}</p>
                    <p className="text-xs font-medium text-slate-500">{formatDate(item.created_at)} - {item.recommendation_type}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {item.playlists.map((playlist) => (
                    <div key={playlist.title} className="rounded-xl border border-slate-200/80 bg-white/82 p-4">
                      <p className="font-semibold text-ink">{playlist.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{playlist.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
          </div>
        </section>
      </div>
    </>
  );
}
