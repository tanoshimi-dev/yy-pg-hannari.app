<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLearningStore } from '../stores/learning';
import AppLayout from '../components/AppLayout.vue';
import type { QuizAnswerResult } from '../types';

const route = useRoute();
const router = useRouter();
const learningStore = useLearningStore();

const contentId = route.params.id as string;
const selectedChoiceId = ref<string | null>(null);
const answerResult = ref<QuizAnswerResult | null>(null);
const isAnswering = ref(false);

onMounted(async () => {
  learningStore.resetQuizSession();
  await learningStore.fetchQuizzes(contentId);
});

const currentQuiz = computed(() => {
  return learningStore.quizzes[learningStore.currentQuizIndex] || null;
});

const progress = computed(() => {
  const total = learningStore.quizzes.length;
  if (total === 0) return 0;
  return Math.round(((learningStore.currentQuizIndex) / total) * 100);
});

const isLastQuiz = computed(() => {
  return learningStore.currentQuizIndex >= learningStore.quizzes.length - 1;
});

async function selectChoice(choiceId: string) {
  if (answerResult.value || isAnswering.value || !currentQuiz.value) return;
  selectedChoiceId.value = choiceId;
  isAnswering.value = true;

  const result = await learningStore.answerQuiz(currentQuiz.value.id, choiceId);
  if (result) {
    answerResult.value = result;
  }
  isAnswering.value = false;
}

function handleNext() {
  if (isLastQuiz.value) {
    router.push({ name: 'quiz-result' });
  } else {
    learningStore.nextQuiz();
    selectedChoiceId.value = null;
    answerResult.value = null;
  }
}

function goBackToContent() {
  router.push(`/contents/${contentId}`);
}

function choiceClass(choiceId: string) {
  if (!answerResult.value) {
    return { selected: selectedChoiceId.value === choiceId };
  }
  if (choiceId === answerResult.value.correctChoiceId) {
    return { correct: true };
  }
  if (choiceId === selectedChoiceId.value && !answerResult.value.isCorrect) {
    return { incorrect: true };
  }
  return { dimmed: true };
}
</script>

<template>
  <AppLayout>
    <div class="quiz-page">
      <div class="quiz-top-bar">
        <button class="back-btn" @click="goBackToContent">
          &#10005; やめる
        </button>
        <div class="quiz-counter">
          {{ learningStore.currentQuizIndex + 1 }} / {{ learningStore.quizzes.length }}
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>

      <div v-if="learningStore.loading" class="loading">
        <div class="spinner"></div>
        <p>クイズを読み込み中...</p>
      </div>

      <div v-else-if="learningStore.error" class="error-message">
        <p>{{ learningStore.error }}</p>
      </div>

      <div v-else-if="learningStore.quizzes.length === 0" class="empty-state">
        <p>クイズがありません</p>
        <button class="btn-secondary" @click="goBackToContent">戻る</button>
      </div>

      <template v-else-if="currentQuiz">
        <div class="quiz-question">
          <h2>{{ currentQuiz.question }}</h2>
        </div>

        <div class="quiz-choices">
          <button
            v-for="choice in currentQuiz.choices"
            :key="choice.id"
            class="choice-btn"
            :class="choiceClass(choice.id)"
            :disabled="!!answerResult"
            @click="selectChoice(choice.id)"
          >
            <span class="choice-text">{{ choice.text }}</span>
            <span
              v-if="answerResult && choice.id === answerResult.correctChoiceId"
              class="choice-icon correct-icon"
            >
              &#10003;
            </span>
            <span
              v-else-if="
                answerResult &&
                choice.id === selectedChoiceId &&
                !answerResult.isCorrect
              "
              class="choice-icon incorrect-icon"
            >
              &#10007;
            </span>
          </button>
        </div>

        <div v-if="answerResult" class="answer-feedback" :class="{ 'is-correct': answerResult.isCorrect }">
          <div class="feedback-header">
            <span v-if="answerResult.isCorrect" class="feedback-icon">&#127881;</span>
            <span v-else class="feedback-icon">&#128161;</span>
            <span class="feedback-text">
              {{ answerResult.isCorrect ? 'せいかい！' : 'ざんねん...' }}
            </span>
          </div>
          <p v-if="answerResult.explanation" class="feedback-explanation">
            {{ answerResult.explanation }}
          </p>
          <button class="btn-primary next-btn" @click="handleNext">
            {{ isLastQuiz ? 'けっかを見る' : 'つぎへ' }}
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.quiz-page {
  max-width: 680px;
  margin: 0 auto;
}

.quiz-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #dc2626;
}

.quiz-counter {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
}

.progress-bar-container {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #a855f7);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.quiz-question {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.quiz-question h2 {
  font-size: 1.35rem;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
}

.quiz-choices {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.choice-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.5rem;
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #1e293b;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.choice-btn:not(:disabled):hover {
  border-color: #7c3aed;
  background: #faf5ff;
}

.choice-btn.selected {
  border-color: #7c3aed;
  background: #f5f3ff;
}

.choice-btn.correct {
  border-color: #10b981;
  background: #ecfdf5;
  color: #059669;
}

.choice-btn.incorrect {
  border-color: #ef4444;
  background: #fef2f2;
  color: #dc2626;
}

.choice-btn.dimmed {
  opacity: 0.5;
}

.choice-btn:disabled {
  cursor: default;
}

.choice-text {
  flex: 1;
}

.choice-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-left: 0.75rem;
}

.correct-icon {
  color: #059669;
}

.incorrect-icon {
  color: #dc2626;
}

.answer-feedback {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  border: 1px solid #e2e8f0;
  text-align: center;
  animation: slideUp 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.answer-feedback.is-correct {
  border-color: #a7f3d0;
  background: #f0fdf4;
}

.feedback-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.feedback-icon {
  font-size: 1.75rem;
}

.feedback-text {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
}

.feedback-explanation {
  color: #64748b;
  margin: 0 0 1.25rem;
  line-height: 1.6;
}

.next-btn {
  padding: 0.75rem 2.5rem;
  font-size: 1rem;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  padding: 3rem;
  color: #64748b;
}

@media (max-width: 640px) {
  .quiz-question {
    padding: 1.25rem;
  }

  .quiz-question h2 {
    font-size: 1.15rem;
  }
}
</style>
