import apiClient from './apiClient';

export const chatService = {
  history: () => apiClient.get('/chat/messages').then((res) => res.data),
  send: (message) => apiClient.post('/chat/message', { message }).then((res) => res.data),
};
