<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLearningStore } from '../stores/learning';
import AppLayout from '../components/AppLayout.vue';

const router = useRouter();
const learningStore = useLearningStore();

const results = computed(() => learningStore.quizResults);

const correctCount = computed(() =>
  results.value.filter((r) => r.result.isCorrect).length
);

const totalCount = computed(() => results.value.length);

const scorePercent = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((correctCount.value / totalCount.value) * 100);
});

const isPerfect = computed(() =>
  totalCount.value > 0 && correctCount.value === totalCount.value
);

const scoreMessage = computed(() => {
  if (isPerfect.value) return 'パーフェクト！すごい！';
  if (scorePercent.value >= 80) return 'よくできました！';
  if (scorePercent.value >= 60) return 'がんばりました！';
  return 'つぎはもっとがんばろう！';
});

function goToContents() {
  learningStore.resetQuizSession();
  router.push('/contents');
}

function goToDashboard() {
  learningStore.resetQuizSession();
  router.push('/');
}
</script>

<template>
  <AppLayout>
    <div class="result-page">
      <div v-if="results.length === 0" class="empty-state">
        <p>結果がありません</p>
        <button class="btn-primary" @click="goToContents">コンテンツ一覧へ</button>
      </div>

      <template v-else>
        <div class="result-hero" :class="{ perfect: isPerfect }">
          <div v-if="isPerfect" class="confetti">
            <span v-for="i in 20" :key="i" class="confetti-piece" :style="{ '--delay': i * 0.1 + 's', '--x': (Math.random() * 200 - 100) + 'px' }"></span>
          </div>

          <div class="score-circle">
            <svg viewBox="0 0 120 120" class="score-ring">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" stroke-width="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                :stroke="isPerfect ? '#fbbf24' : '#7c3aed'"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="326.7"
                :stroke-dashoffset="326.7 - (326.7 * scorePercent) / 100"
                transform="rotate(-90 60 60)"
                class="score-ring-progress"
              />
            </svg>
            <div class="score-text">
              <span class="score-number">{{ scorePercent }}</span>
              <span class="score-unit">%</span>
            </div>
          </div>

          <h1 class="result-title">{{ scoreMessage }}</h1>
          <p class="result-summary">
            {{ totalCount }}問中 {{ correctCount }}問正解
          </p>
        </div>

        <div class="result-details">
          <h2>回答一覧</h2>
          <div class="result-list">
            <div
              v-for="(item, index) in results"
              :key="index"
              class="result-item"
              :class="{ correct: item.result.isCorrect, incorrect: !item.result.isCorrect }"
            >
              <div class="result-index">
                <span v-if="item.result.isCorrect" class="result-icon correct-icon">&#10003;</span>
                <span v-else class="result-icon incorrect-icon">&#10007;</span>
              </div>
              <div class="result-info">
                <p class="result-question">{{ item.quiz.question }}</p>
                <p v-if="item.result.explanation" class="result-explanation">
                  {{ item.result.explanation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn-secondary" @click="goToContents">
            コンテンツ一覧へ
          </button>
          <button class="btn-primary" @click="goToDashboard">
            ダッシュボードへ
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.result-page {
  max-width: 680px;
  margin: 0 auto;
}

.result-hero {
  text-align: center;
  padding: 3rem 1rem 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.result-hero.perfect {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 20px;
  border: 1px solid #fde68a;
}

.confetti {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confetti-fall 2s ease-out var(--delay) forwards;
  transform: translateX(var(--x));
}

.confetti-piece:nth-child(odd) {
  background: #fbbf24;
}

.confetti-piece:nth-child(even) {
  background: #a855f7;
}

.confetti-piece:nth-child(3n) {
  background: #34d399;
  border-radius: 50%;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateX(var(--x)) translateY(300px) rotate(720deg);
  }
}

.score-circle {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 1.5rem;
}

.score-ring {
  width: 100%;
  height: 100%;
}

.score-ring-progress {
  transition: stroke-dashoffset 1s ease;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: baseline;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
}

.score-unit {
  font-size: 1rem;
  color: #64748b;
  margin-left: 2px;
}

.result-title {
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.result-summary {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

.result-details {
  margin-bottom: 2rem;
}

.result-details h2 {
  font-size: 1.1rem;
  color: #1e293b;
  margin: 0 0 1rem;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.result-item.correct {
  border-left: 3px solid #059669;
}

.result-item.incorrect {
  border-left: 3px solid #dc2626;
}

.result-index {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.result-icon {
  font-size: 1.1rem;
}

.correct-icon {
  color: #059669;
}

.incorrect-icon {
  color: #dc2626;
}

.result-info {
  flex: 1;
}

.result-question {
  color: #1e293b;
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.result-explanation {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
}

@media (max-width: 640px) {
  .result-actions {
    flex-direction: column;
  }

  .result-title {
    font-size: 1.35rem;
  }
}
</style>
