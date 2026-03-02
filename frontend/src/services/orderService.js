import api from '../api/axiosConfig';

const ORDERS_BASE = '/api/v1/orders';

export const orderService = {
  async create(order) {
    const response = await api.post(ORDERS_BASE, order);
    return response.data;
  },

  async getByUser(userId) {
    const response = await api.get(`${ORDERS_BASE}/user/${userId}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${ORDERS_BASE}/${id}`);
    return response.data;
  },

  async confirmOrder(id) {
    const response = await api.patch(`${ORDERS_BASE}/${id}/confirm`);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.patch(`${ORDERS_BASE}/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  async getTracking(id) {
    const response = await api.get(`${ORDERS_BASE}/${id}/tracking`);
    return response.data;
  },
};
