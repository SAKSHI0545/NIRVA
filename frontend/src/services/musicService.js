import apiClient from './apiClient';

export const musicService = {
  history: () => apiClient.get('/music/recommendations').then((res) => res.data),
  recommend: (payload) => apiClient.post('/music/recommendations', payload).then((res) => res.data),
  spotifyRecommendations: (mood, limit = 10) =>
    apiClient.get(`/music/recommendations/${mood}`, { params: { limit } }).then((res) => res.data),
  spotifyPlaylist: (playlistId) => apiClient.get(`/music/playlists/${playlistId}`).then((res) => res.data),
};
