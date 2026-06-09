import apiClient from './apiClient';

export const journalService = {
  list: (params) => apiClient.get('/journal/my', { params }).then((res) => res.data),
  public: (params) => apiClient.get('/journal/public', { params }).then((res) => res.data),
  community: (params) => apiClient.get('/community/journals', { params }).then((res) => res.data),
  get: (id) => apiClient.get(`/journal/${id}`).then((res) => res.data),
  create: (payload) => apiClient.post('/journals', payload).then((res) => res.data),
  update: (id, payload) => apiClient.patch(`/journals/${id}`, payload).then((res) => res.data),
  remove: (id) => apiClient.delete(`/journals/${id}`),
};
