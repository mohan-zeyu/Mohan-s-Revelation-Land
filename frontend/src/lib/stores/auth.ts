import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: number;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: browser ? localStorage.getItem('token') : null,
  isAuthenticated: false
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    login: (token: string, user: User) => {
      if (browser) {
        localStorage.setItem('token', token);
      }
      set({
        user,
        token,
        isAuthenticated: true
      });
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('token');
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    },
    checkAuth: async () => {
      if (!browser) return;

      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      // Token exists, consider user authenticated
      // In a real app, you might want to verify the token with the backend
      update(state => ({ ...state, isAuthenticated: true, token }));
    }
  };
}

export const authStore = createAuthStore();
