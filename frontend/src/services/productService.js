import api from '../api/axiosConfig';

const PRODUCTS_BASE = '/api/v1/products';

export const productService = {
  async getAll() {
    const response = await api.get(PRODUCTS_BASE);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`${PRODUCTS_BASE}/${id}`);
    return response.data;
  },

  async getByCategory(categoryId) {
    const response = await api.get(`${PRODUCTS_BASE}/category/${categoryId}`);
    return response.data;
  },

  async search(name) {
    const response = await api.get(`${PRODUCTS_BASE}/search`, { params: { name } });
    return response.data;
  },

  async getCategories() {
    const response = await api.get(`${PRODUCTS_BASE}/categories`);
    return response.data;
  },

  async create(product) {
    const response = await api.post(PRODUCTS_BASE, product);
    return response.data;
  },
};
