import axios from 'axios';
import type { Content, DashboardData, Quiz, QuizAnswerResult, UserProgress, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const getProfile = () => api.get<User>('/auth/profile');

// Contents
export const getContents = (categoryId?: string) =>
  api.get<Content[]>('/contents', { params: { categoryId } });
export const getContent = (id: string) => api.get<Content>(`/contents/${id}`);

// Quizzes
export const getQuizzesByContent = (contentId: string) =>
  api.get<Quiz[]>(`/quizzes/content/${contentId}`);
export const submitAnswer = (quizId: string, choiceId: string) =>
  api.post<QuizAnswerResult>(`/quizzes/${quizId}/answer`, { choiceId });

// Progress
export const getProgress = () => api.get<UserProgress[]>('/progress');
export const updateProgress = (contentId: string) =>
  api.post<UserProgress>(`/progress/${contentId}`);
export const getDashboard = () => api.get<DashboardData>('/progress/dashboard');
