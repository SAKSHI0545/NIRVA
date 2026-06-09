import apiClient from './apiClient';

export const analyticsService = {
  summary: () => apiClient.get('/analytics/summary').then((res) => res.data),
};
