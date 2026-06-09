import { ExternalLink, Music2 } from 'lucide-react';
import Button from './Button';

const formatFollowers = (followers) => {
  if (!followers) {
    return 'Spotify playlist';
  }
  return `${new Intl.NumberFormat().format(followers)} followers`;
};

export default function SpotifyPlaylistCard({ playlist }) {
  const openSpotify = () => {
    window.open(playlist.spotify_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="aspect-square w-full bg-slate-100">
        {playlist.image_url ? (
          <img src={playlist.image_url} alt={playlist.playlist_name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Music2 size={42} />
          </div>
        )}
      </div>
      <div className="flex min-h-60 flex-col p-4">
        <div className="flex-1">
          <p className="line-clamp-2 text-base font-bold text-ink">{playlist.playlist_name}</p>
          <p className="mt-1 text-xs font-semibold text-sage">{playlist.owner} - {formatFollowers(playlist.followers)}</p>
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
            {playlist.description || 'A Spotify playlist selected for this mood.'}
          </p>
        </div>
        <Button type="button" className="mt-4 w-full" onClick={openSpotify} disabled={!playlist.spotify_url}>
          <ExternalLink size={17} />
          Open in Spotify
        </Button>
      </div>
    </article>
  );
}
