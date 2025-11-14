import { browser } from '$app/environment';

const API_URL = browser ? '/api' : 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { requiresAuth = false, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers
  };

  if (requiresAuth && browser) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  login: (username: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  register: (username: string, password: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),

  // Post endpoints
  getPosts: () => apiRequest('/posts'),

  getPostsByCategory: (category: string) =>
    apiRequest(`/posts/category/${category}`),

  getPostById: (id: number) => apiRequest(`/posts/${id}`),

  createPost: (title: string, content: string, category: string) =>
    apiRequest('/posts', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify({ title, content, category })
    }),

  updatePost: (id: number, title: string, content: string, category: string) =>
    apiRequest(`/posts/${id}`, {
      method: 'PUT',
      requiresAuth: true,
      body: JSON.stringify({ title, content, category })
    }),

  deletePost: (id: number) =>
    apiRequest(`/posts/${id}`, {
      method: 'DELETE',
      requiresAuth: true
    })
};
