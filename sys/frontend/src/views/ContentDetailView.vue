<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLearningStore } from '../stores/learning';
import AppLayout from '../components/AppLayout.vue';

const route = useRoute();
const router = useRouter();
const learningStore = useLearningStore();

const contentId = route.params.id as string;

onMounted(async () => {
  await learningStore.fetchContent(contentId);
  await learningStore.markProgress(contentId);
});

function startQuiz() {
  router.push(`/contents/${contentId}/quiz`);
}

function goBack() {
  router.push('/contents');
}

function renderBody(body: string): string {
  // Handle fenced code blocks first (```lang ... ```)
  let result = body.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="code-block" data-lang="${lang}"><code>${escaped}</code></pre>`;
  });

  // Process non-code parts only
  const parts = result.split(/(<pre[\s\S]*?<\/pre>)/g);
  result = parts.map((part) => {
    if (part.startsWith('<pre')) return part;
    return part
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }).join('');

  return result;
}
</script>

<template>
  <AppLayout>
    <div class="content-detail">
      <button class="back-btn" @click="goBack">
        &#8592; コンテンツ一覧へ
      </button>

      <div v-if="learningStore.loading" class="loading">
        <div class="spinner"></div>
        <p>読み込み中...</p>
      </div>

      <div v-else-if="learningStore.error" class="error-message">
        <p>{{ learningStore.error }}</p>
      </div>

      <template v-else-if="learningStore.currentContent">
        <div class="content-header">
          <div
            v-if="learningStore.currentContent.category"
            class="content-category"
          >
            {{ learningStore.currentContent.category.name }}
          </div>
          <h1>{{ learningStore.currentContent.title }}</h1>
          <p class="content-description">
            {{ learningStore.currentContent.description }}
          </p>
        </div>

        <div class="content-body">
          <div
            class="body-content"
            v-html="renderBody(learningStore.currentContent.body)"
          ></div>
        </div>

        <div
          v-if="
            learningStore.currentContent.quizzes &&
            learningStore.currentContent.quizzes.length > 0
          "
          class="quiz-cta"
        >
          <div class="quiz-cta-inner">
            <div class="quiz-cta-text">
              <h3>クイズに挑戦しよう！</h3>
              <p>
                {{ learningStore.currentContent.quizzes.length }}問のクイズがあります
              </p>
            </div>
            <button class="btn-primary btn-large" @click="startQuiz">
              クイズをはじめる
            </button>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.content-detail {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  background: none;
  border: none;
  color: #7c3aed;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #6d28d9;
}

.content-header {
  margin-bottom: 2rem;
}

.content-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ede9fe;
  color: #7c3aed;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.content-header h1 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.content-description {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.content-body {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.body-content {
  color: #475569;
  line-height: 1.8;
  font-size: 1rem;
}

.body-content :deep(h1) {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 1.5rem 0 0.75rem;
}

.body-content :deep(h2) {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 1.25rem 0 0.5rem;
}

.body-content :deep(h3) {
  font-size: 1.1rem;
  color: #1e293b;
  margin: 1rem 0 0.5rem;
}

.body-content :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.body-content :deep(code) {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
  color: #7c3aed;
}

.body-content :deep(pre.code-block) {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
}

.body-content :deep(pre.code-block code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
  white-space: pre;
}

.body-content :deep(p) {
  margin: 0 0 1rem;
}

.quiz-cta {
  margin-bottom: 2rem;
}

.quiz-cta-inner {
  background: linear-gradient(135deg, #ede9fe, #f3e8ff);
  border: 1px solid #ddd6fe;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.quiz-cta-text h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.quiz-cta-text p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  white-space: nowrap;
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

@media (max-width: 640px) {
  .quiz-cta-inner {
    flex-direction: column;
    text-align: center;
  }

  .content-header h1 {
    font-size: 1.5rem;
  }

  .content-body {
    padding: 1.25rem;
  }
}
</style>
