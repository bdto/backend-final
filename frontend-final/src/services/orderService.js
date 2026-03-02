import api from '../api/axios'

export const orderService = {
  create: async (order) => {
    const response = await api.post('/api/v1/orders', order)
    return response.data
  },

  getByUser: async (userId) => {
    const response = await api.get(`/api/v1/orders/user/${userId}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/orders/${id}`)
    return response.data
  },

  confirm: async (id) => {
    const response = await api.patch(`/api/v1/orders/${id}/confirm`)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/v1/orders/${id}/status?status=${encodeURIComponent(status)}`)
    return response.data
  },

  getTracking: async (id) => {
    const response = await api.get(`/api/v1/orders/${id}/tracking`)
    return response.data
  },
}
