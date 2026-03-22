import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Content, Quiz, QuizAnswerResult, UserProgress, DashboardData } from '../types';
import {
  getContents,
  getContent,
  getQuizzesByContent,
  submitAnswer,
  getProgress,
  updateProgress,
  getDashboard,
} from '../api';

export const useLearningStore = defineStore('learning', () => {
  const contents = ref<Content[]>([]);
  const currentContent = ref<Content | null>(null);
  const quizzes = ref<Quiz[]>([]);
  const progressList = ref<UserProgress[]>([]);
  const dashboard = ref<DashboardData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Quiz session state
  const currentQuizIndex = ref(0);
  const quizResults = ref<{ quiz: Quiz; choiceId: string; result: QuizAnswerResult }[]>([]);

  async function fetchContents(categoryId?: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await getContents(categoryId);
      contents.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch contents';
    } finally {
      loading.value = false;
    }
  }

  async function fetchContent(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await getContent(id);
      currentContent.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch content';
    } finally {
      loading.value = false;
    }
  }

  async function fetchQuizzes(contentId: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await getQuizzesByContent(contentId);
      quizzes.value = response.data;
      currentQuizIndex.value = 0;
      quizResults.value = [];
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch quizzes';
    } finally {
      loading.value = false;
    }
  }

  async function answerQuiz(quizId: string, choiceId: string) {
    try {
      const response = await submitAnswer(quizId, choiceId);
      const quiz = quizzes.value.find((q) => q.id === quizId);
      if (quiz) {
        quizResults.value.push({ quiz, choiceId, result: response.data });
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to submit answer';
      return null;
    }
  }

  function nextQuiz() {
    if (currentQuizIndex.value < quizzes.value.length - 1) {
      currentQuizIndex.value++;
      return true;
    }
    return false;
  }

  function resetQuizSession() {
    currentQuizIndex.value = 0;
    quizResults.value = [];
    quizzes.value = [];
  }

  async function fetchProgress() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getProgress();
      progressList.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch progress';
    } finally {
      loading.value = false;
    }
  }

  async function markProgress(contentId: string) {
    try {
      await updateProgress(contentId);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update progress';
    }
  }

  async function fetchDashboard() {
    loading.value = true;
    error.value = null;
    try {
      const response = await getDashboard();
      dashboard.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard';
    } finally {
      loading.value = false;
    }
  }

  return {
    contents,
    currentContent,
    quizzes,
    progressList,
    dashboard,
    loading,
    error,
    currentQuizIndex,
    quizResults,
    fetchContents,
    fetchContent,
    fetchQuizzes,
    answerQuiz,
    nextQuiz,
    resetQuizSession,
    fetchProgress,
    markProgress,
    fetchDashboard,
  };
});
