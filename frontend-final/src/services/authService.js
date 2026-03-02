import api from '../api/axios'

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/api/v1/auth/login', { username, password })
    return response.data
  },

  register: async (username, password, email) => {
    const response = await api.post('/api/v1/auth/register', { username, password, email })
    return response.data
  },

  requestPasswordReset: async (email) => {
    const response = await api.post('/api/v1/auth/password-reset/request', { email })
    return response.data
  },

  confirmPasswordReset: async (token, newPassword) => {
    const response = await api.post('/api/v1/auth/password-reset/confirm', { token, newPassword })
    return response.data
  },
}
