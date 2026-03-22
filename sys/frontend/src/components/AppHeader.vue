<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();
  router.push('/login');
}

function navigate(path: string) {
  router.push(path);
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo" @click="navigate('/')">
          <span class="logo-mark">H</span>
          <span class="logo-name">Hannari</span>
        </div>

        <nav v-if="authStore.isAuthenticated" class="nav-links">
          <a
            class="nav-link"
            :class="{ active: $route.path === '/' }"
            @click="navigate('/')"
          >
            ダッシュボード
          </a>
          <a
            class="nav-link"
            :class="{ active: $route.path.startsWith('/contents') }"
            @click="navigate('/contents')"
          >
            コンテンツ
          </a>
        </nav>
      </div>

      <div v-if="authStore.isAuthenticated" class="header-right">
        <div class="user-info">
          <img
            v-if="authStore.user?.avatarUrl"
            :src="authStore.user.avatarUrl"
            :alt="authStore.user.displayName"
            class="user-avatar"
          />
          <span class="user-name">{{ authStore.user?.displayName }}</span>
        </div>
        <button class="logout-btn" @click="logout" title="ログアウト">
          &#9211;
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  text-decoration: none;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.01em;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-link:hover {
  color: #1e293b;
  background: #f1f5f9;
}

.nav-link.active {
  color: #7c3aed;
  background: #7c3aed10;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
}

.user-name {
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #94a3b8;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: #f87171;
  color: #f87171;
  background: #fef2f2;
}

@media (max-width: 640px) {
  .user-name {
    display: none;
  }

  .nav-links {
    gap: 0;
  }

  .nav-link {
    padding: 0.5rem 0.625rem;
    font-size: 0.8rem;
  }

  .logo-name {
    display: none;
  }
}
</style>
