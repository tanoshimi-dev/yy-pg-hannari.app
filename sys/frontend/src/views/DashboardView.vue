<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useLearningStore } from '../stores/learning';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';

const authStore = useAuthStore();
const learningStore = useLearningStore();
const router = useRouter();

onMounted(async () => {
  await authStore.fetchProfile();
  await learningStore.fetchDashboard();
});

function goToContents() {
  router.push('/contents');
}

function completionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
</script>

<template>
  <AppLayout>
    <div class="dashboard">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>
            おかえりなさい、
            <span class="user-name">{{ authStore.user?.displayName || 'ゲスト' }}</span>
            さん！
          </h1>
          <p>今日も楽しく学びましょう</p>
        </div>
        <div v-if="authStore.user?.avatarUrl" class="welcome-avatar">
          <img :src="authStore.user.avatarUrl" :alt="authStore.user.displayName" />
        </div>
      </div>

      <div v-if="learningStore.loading" class="loading">
        <div class="spinner"></div>
        <p>読み込み中...</p>
      </div>

      <div v-else-if="learningStore.error" class="error-message">
        <p>{{ learningStore.error }}</p>
      </div>

      <template v-else-if="learningStore.dashboard">
        <div class="stats-grid">
          <div class="stat-card stat-contents">
            <div class="stat-icon">&#128218;</div>
            <div class="stat-info">
              <span class="stat-value">
                {{ learningStore.dashboard.completedContents }} /
                {{ learningStore.dashboard.totalContents }}
              </span>
              <span class="stat-label">コンテンツ完了</span>
            </div>
            <div class="stat-progress">
              <div
                class="stat-progress-bar"
                :style="{
                  width:
                    completionRate(
                      learningStore.dashboard.completedContents,
                      learningStore.dashboard.totalContents
                    ) + '%',
                }"
              ></div>
            </div>
          </div>

          <div class="stat-card stat-quizzes">
            <div class="stat-icon">&#9989;</div>
            <div class="stat-info">
              <span class="stat-value">
                {{ learningStore.dashboard.correctQuizAttempts }} /
                {{ learningStore.dashboard.totalQuizAttempts }}
              </span>
              <span class="stat-label">クイズ正解数</span>
            </div>
            <div class="stat-progress">
              <div
                class="stat-progress-bar quiz-bar"
                :style="{
                  width:
                    (learningStore.dashboard.quizAccuracy || 0) + '%',
                }"
              ></div>
            </div>
          </div>

          <div class="stat-card stat-accuracy">
            <div class="stat-icon">&#127942;</div>
            <div class="stat-info">
              <span class="stat-value">
                {{ learningStore.dashboard.quizAccuracy || 0 }}%
              </span>
              <span class="stat-label">正解率</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2>最近の学習</h2>
            <button class="btn-secondary" @click="goToContents">すべて見る</button>
          </div>

          <div
            v-if="learningStore.dashboard.recentProgress.length === 0"
            class="empty-state"
          >
            <div class="empty-icon">&#128640;</div>
            <p>まだ学習を始めていません</p>
            <button class="btn-primary" @click="goToContents">
              学習を始める
            </button>
          </div>

          <div v-else class="recent-list">
            <div
              v-for="progress in learningStore.dashboard.recentProgress"
              :key="progress.id"
              class="recent-item"
              @click="router.push(`/contents/${progress.contentId}`)"
            >
              <div class="recent-status" :class="{ completed: progress.completed }">
                <span v-if="progress.completed">&#10003;</span>
                <span v-else>&#9679;</span>
              </div>
              <div class="recent-info">
                <h3>{{ progress.content?.title || 'コンテンツ' }}</h3>
                <span class="recent-date">
                  {{ new Date(progress.lastAccessedAt).toLocaleDateString('ja-JP') }}
                </span>
              </div>
              <div class="recent-badge" :class="{ completed: progress.completed }">
                {{ progress.completed ? '完了' : '学習中' }}
              </div>
            </div>
          </div>
        </div>

        <div class="cta-section">
          <button class="btn-primary btn-large" @click="goToContents">
            学習をつづける
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #ede9fe, #f3e8ff);
  border-radius: 16px;
  border: 1px solid #ddd6fe;
}

.welcome-text h1 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.user-name {
  color: #7c3aed;
}

.welcome-text p {
  color: #64748b;
  margin: 0;
}

.welcome-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #7c3aed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

.stat-progress {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.stat-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #a855f7);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.quiz-bar {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.recent-item:hover {
  border-color: #7c3aed;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
}

.recent-status {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.recent-status.completed {
  background: #d1fae5;
  color: #059669;
}

.recent-info {
  flex: 1;
}

.recent-info h3 {
  font-size: 1rem;
  color: #1e293b;
  margin: 0 0 0.125rem;
}

.recent-date {
  font-size: 0.8rem;
  color: #94a3b8;
}

.recent-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fef3c7;
  color: #d97706;
}

.recent-badge.completed {
  background: #d1fae5;
  color: #059669;
}

.cta-section {
  text-align: center;
  margin-top: 1rem;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 12px;
  border: 1px solid #fecaca;
}

@media (max-width: 640px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
