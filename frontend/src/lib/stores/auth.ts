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
  const { subscribe, set } = writable<AuthState>(initialState);

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
      if (!browser) return false;

      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false });
        return false;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        const user = (await response.json()) as User;
        set({
          user,
          token,
          isAuthenticated: true
        });
        return true;
      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
        return false;
      }
    }
  };
}

export const authStore = createAuthStore();
