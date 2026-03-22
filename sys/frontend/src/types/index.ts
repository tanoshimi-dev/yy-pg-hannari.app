export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  body: string;
  categoryId: string;
  category?: Category;
  quizzes?: Quiz[];
  sortOrder: number;
}

export interface Quiz {
  id: string;
  contentId: string;
  question: string;
  explanation?: string;
  choices: QuizChoice[];
  sortOrder: number;
}

export interface QuizChoice {
  id: string;
  text: string;
  isCorrect?: boolean;
  sortOrder: number;
}

export interface UserProgress {
  id: string;
  contentId: string;
  completed: boolean;
  lastAccessedAt: string;
  content?: Content;
}

export interface DashboardData {
  totalContents: number;
  completedContents: number;
  totalQuizAttempts: number;
  correctQuizAttempts: number;
  quizAccuracy: number;
  recentProgress: UserProgress[];
}

export interface QuizAnswerResult {
  isCorrect: boolean;
  correctChoiceId: string;
  explanation?: string;
}
