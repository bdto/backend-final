import api from '../api/axiosConfig';

const AUTH_BASE = '/api/v1/auth';

export const authService = {
  async login(username, password) {
    const response = await api.post(`${AUTH_BASE}/login`, { username, password });
    return response.data;
  },

  async register(username, password, email) {
    const response = await api.post(`${AUTH_BASE}/register`, { username, password, email });
    return response.data;
  },

  async requestPasswordReset(email) {
    const response = await api.post(`${AUTH_BASE}/password-reset/request`, { email });
    return response.data;
  },

  async confirmPasswordReset(token, newPassword) {
    const response = await api.post(`${AUTH_BASE}/password-reset/confirm`, { token, newPassword });
    return response.data;
  },
};
