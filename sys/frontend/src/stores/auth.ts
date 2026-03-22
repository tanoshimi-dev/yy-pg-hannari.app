import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';
import { getProfile } from '../api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function clearToken() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  async function fetchProfile() {
    if (!token.value) return;
    loading.value = true;
    error.value = null;
    try {
      const response = await getProfile();
      user.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch profile';
      if (err.response?.status === 401) {
        clearToken();
      }
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    clearToken();
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    setToken,
    clearToken,
    fetchProfile,
    logout,
  };
});
