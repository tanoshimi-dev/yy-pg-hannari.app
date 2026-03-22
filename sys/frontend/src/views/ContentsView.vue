<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLearningStore } from '../stores/learning';
import AppLayout from '../components/AppLayout.vue';
import type { Content } from '../types';

const learningStore = useLearningStore();
const router = useRouter();

onMounted(async () => {
  await learningStore.fetchContents();
  await learningStore.fetchProgress();
});

const groupedContents = computed(() => {
  const groups: Record<string, { categoryName: string; contents: Content[] }> = {};
  for (const content of learningStore.contents) {
    const catId = content.categoryId || 'uncategorized';
    const catName = content.category?.name || 'その他';
    if (!groups[catId]) {
      groups[catId] = { categoryName: catName, contents: [] };
    }
    groups[catId].contents.push(content);
  }
  return Object.values(groups);
});

function isCompleted(contentId: string): boolean {
  return learningStore.progressList.some(
    (p) => p.contentId === contentId && p.completed
  );
}

function isInProgress(contentId: string): boolean {
  return learningStore.progressList.some(
    (p) => p.contentId === contentId && !p.completed
  );
}

function navigateToContent(id: string) {
  router.push(`/contents/${id}`);
}
</script>

<template>
  <AppLayout>
    <div class="contents-page">
      <div class="page-header">
        <h1>コンテンツ一覧</h1>
        <p>学びたいコンテンツを選んでね</p>
      </div>

      <div v-if="learningStore.loading" class="loading">
        <div class="spinner"></div>
        <p>読み込み中...</p>
      </div>

      <div v-else-if="learningStore.error" class="error-message">
        <p>{{ learningStore.error }}</p>
      </div>

      <div v-else-if="learningStore.contents.length === 0" class="empty-state">
        <div class="empty-icon">&#128214;</div>
        <p>コンテンツがまだありません</p>
      </div>

      <template v-else>
        <div
          v-for="group in groupedContents"
          :key="group.categoryName"
          class="category-section"
        >
          <h2 class="category-title">{{ group.categoryName }}</h2>
          <div class="content-grid">
            <div
              v-for="content in group.contents"
              :key="content.id"
              class="content-card"
              :class="{
                'is-completed': isCompleted(content.id),
                'is-in-progress': isInProgress(content.id),
              }"
              @click="navigateToContent(content.id)"
            >
              <div class="card-header">
                <div class="card-status">
                  <span v-if="isCompleted(content.id)" class="status-badge completed">
                    &#10003; 完了
                  </span>
                  <span
                    v-else-if="isInProgress(content.id)"
                    class="status-badge in-progress"
                  >
                    &#9679; 学習中
                  </span>
                  <span v-else class="status-badge new">NEW</span>
                </div>
              </div>
              <h3 class="card-title">{{ content.title }}</h3>
              <p class="card-description">{{ content.description }}</p>
              <div class="card-footer">
                <span v-if="content.quizzes" class="quiz-count">
                  &#128221; {{ content.quizzes.length }} クイズ
                </span>
                <span class="card-arrow">&#10132;</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.contents-page {
  max-width: 960px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.page-header p {
  color: #64748b;
  margin: 0;
}

.category-section {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.1rem;
  color: #7c3aed;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.content-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.content-card:hover {
  transform: translateY(-3px);
  border-color: #7c3aed;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.1);
}

.content-card.is-completed {
  border-color: #a7f3d0;
}

.content-card.is-in-progress {
  border-color: #fde68a;
}

.card-header {
  margin-bottom: 0.75rem;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.completed {
  background: #d1fae5;
  color: #059669;
}

.status-badge.in-progress {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.new {
  background: #ede9fe;
  color: #7c3aed;
}

.card-title {
  font-size: 1.125rem;
  color: #1e293b;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}

.card-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  flex: 1;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.quiz-count {
  font-size: 0.8rem;
  color: #94a3b8;
}

.card-arrow {
  color: #7c3aed;
  font-size: 1.25rem;
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
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
