import apiClient from './apiClient';

export const authService = {
  register: (payload) => apiClient.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => apiClient.post('/auth/login', payload).then((res) => res.data),
  me: () => apiClient.get('/auth/me').then((res) => res.data),
  updateProfile: (payload) => apiClient.patch('/settings/profile', payload).then((res) => res.data),
  changePassword: (payload) => apiClient.post('/settings/change-password', payload).then((res) => res.data),
};
