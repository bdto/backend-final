import api from '../api/axios'

export const productService = {
  getAll: async () => {
    const response = await api.get('/api/v1/products')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/products/${id}`)
    return response.data
  },

  getByCategory: async (categoryId) => {
    const response = await api.get(`/api/v1/products/category/${categoryId}`)
    return response.data
  },

  search: async (name) => {
    const response = await api.get(`/api/v1/products/search?name=${encodeURIComponent(name)}`)
    return response.data
  },

  create: async (product) => {
    const response = await api.post('/api/v1/products', product)
    return response.data
  },

  getCategories: async () => {
    const response = await api.get('/api/v1/products/categories')
    return response.data
  },
}
