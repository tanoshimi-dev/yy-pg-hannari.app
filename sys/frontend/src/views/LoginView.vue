<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function loginWithGoogle() {
  window.location.href = `${apiUrl}/auth/google`;
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-logo">
        <img class="logo-icon" src="/yy-pg-logo.png" alt="yy-pg-logo" />
        <!-- <h1 class="logo-text">わいわい！プログラミング</h1> -->
        <!-- <p class="logo-tagline">楽しく学ぼう！</p> -->
      </div>

      <div class="login-card">
        <!-- <h2 class="hidden">ログイン</h2> -->
        <p class="login-description">
          ログインして、学習を始めましょう！
        </p>

        <button class="google-btn" @click="loginWithGoogle">
          <svg class="google-icon" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Googleでログイン</span>
        </button>
      </div>

      <div class="login-footer">
        <div class="decorative-stars">
          <img class="star" src="/star.png" alt="star" />
          <img class="star" src="/star.png" alt="star" />
          <img class="star" src="/star.png" alt="star" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8f6ff 50%, #ffffff 100%);
  padding: 1rem;
}

.login-container {
  text-align: center;
  max-width: 420px;
  width: 100%;
}

.login-logo {
  margin-bottom: 2rem;
}

.logo-icon {
  width: 80px;
  height: auto;
  border-radius: 20px;
  object-fit: contain;
  margin: 0 auto 1rem;
  display: block;
}

@media (min-width: 768px) {
  .logo-icon {
    width: 100%;
  }
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: 0.02em;
}

.logo-tagline {
  color: #7c3aed;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.login-card h2 {
  color: #1e293b;
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}

.login-description {
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.google-btn:hover {
  background: #f8fafc;
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

.google-icon {
  flex-shrink: 0;
}

.login-footer {
  margin-top: 2rem;
}

.decorative-stars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.star {
  width: 24px;
  height: 24px;
  object-fit: contain;
  animation: twinkle 2s ease-in-out infinite;
}

.star:nth-child(2) {
  animation-delay: 0.5s;
}

.star:nth-child(3) {
  animation-delay: 1s;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>
