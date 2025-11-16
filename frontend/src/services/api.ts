import axios from 'axios';

// API URL: Use VITE_API_URL from environment, or default to localhost
// For Netlify: Set VITE_API_URL to your Render backend URL (with /api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Debug: Log the API URL being used (only in development)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🔗 VITE_API_URL env var:', import.meta.env.VITE_API_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Sweet {
  _id: string;
  id?: string; // For compatibility, we'll map _id to id
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SweetInput {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface User {
  _id: string;
  id?: string; // For compatibility
  email: string;
  role: 'user' | 'admin';
}

// Helper to normalize MongoDB user response
const normalizeUser = (user: any): User => {
  if (!user) {
    throw new Error('Invalid user data received');
  }
  return {
    ...user,
    id: user._id || user.id,
    _id: user._id || user.id,
  };
};

export const authAPI = {
  register: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      return {
        ...response.data,
        user: normalizeUser(response.data.user),
      };
    } catch (error: any) {
      // Re-throw with more context
      if (error.response) {
        throw error; // Axios error with response
      } else {
        // Network error or other issues
        throw new Error(error.message || 'Network error. Please check if the backend server is running.');
      }
    }
  },
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return {
        ...response.data,
        user: normalizeUser(response.data.user),
      };
    } catch (error: any) {
      if (error.response) {
        throw error;
      } else {
        throw new Error(error.message || 'Network error. Please check if the backend server is running.');
      }
    }
  },
};

// Helper to normalize MongoDB response (add id field from _id)
const normalizeSweet = (sweet: any): Sweet => {
  return {
    ...sweet,
    id: sweet._id || sweet.id,
  };
};

export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get('/sweets');
    return response.data.map(normalizeSweet);
  },
  getById: async (id: string): Promise<Sweet> => {
    const response = await api.get(`/sweets/${id}`);
    return normalizeSweet(response.data);
  },
  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> => {
    const response = await api.get('/sweets/search', { params });
    return response.data.map(normalizeSweet);
  },
  create: async (sweet: SweetInput): Promise<Sweet> => {
    const response = await api.post('/sweets', sweet);
    return normalizeSweet(response.data);
  },
  update: async (id: string, sweet: Partial<SweetInput>): Promise<Sweet> => {
    const response = await api.put(`/sweets/${id}`, sweet);
    return normalizeSweet(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },
  purchase: async (id: string, quantity: number = 1): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return normalizeSweet(response.data);
  },
  restock: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return normalizeSweet(response.data);
  },
};

export default api;

