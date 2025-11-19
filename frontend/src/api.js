import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsAPI = {
  getAll: () => api.get('/products/'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products/', product),
  searchByBarcode: (barcode) => api.get(`/search/barcode/${barcode}`),
  searchByName: (query) => api.get(`/search/products?query=${query}`),
};

export const shoppingListsAPI = {
  getAll: () => api.get('/shopping-lists/'),
  getById: (id) => api.get(`/shopping-lists/${id}`),
  create: (list) => api.post('/shopping-lists/', list),
  addItem: (listId, item) => api.post(`/shopping-lists/${listId}/items`, item),
};

export const optimizationAPI = {
  optimize: (data) => api.post('/optimization/optimize', data),
  optimizeList: (listId) => api.post(`/optimization/optimize-list/${listId}`),
};