import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByContentId(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('コンテンツが見つかりません');
    }

    return this.prisma.quiz.findMany({
      where: { contentId },
      include: {
        choices: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            text: true,
            sortOrder: true,
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async submitAnswer(
    quizId: string,
    userId: string,
    selectedChoiceId: string,
  ) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { choices: true },
    });

    if (!quiz) {
      throw new NotFoundException('クイズが見つかりません');
    }

    const selectedChoice = quiz.choices.find((c) => c.id === selectedChoiceId);
    if (!selectedChoice) {
      throw new BadRequestException('選択肢が見つかりません');
    }

    const attempt = await this.prisma.userQuizAttempt.create({
      data: {
        userId,
        quizId,
        selectedChoiceId,
        isCorrect: selectedChoice.isCorrect,
      },
    });

    // Check if all quizzes for this content have been answered
    const totalQuizzes = await this.prisma.quiz.count({
      where: { contentId: quiz.contentId },
    });
    const answeredQuizzes = await this.prisma.userQuizAttempt.findMany({
      where: { userId, quiz: { contentId: quiz.contentId } },
      select: { quizId: true },
      distinct: ['quizId'],
    });

    if (answeredQuizzes.length >= totalQuizzes) {
      // Mark content as completed
      await this.prisma.userProgress.upsert({
        where: {
          userId_contentId: { userId, contentId: quiz.contentId },
        },
        update: { completed: true, lastAccessedAt: new Date() },
        create: {
          userId,
          contentId: quiz.contentId,
          completed: true,
          lastAccessedAt: new Date(),
        },
      });
    }

    const correctChoice = quiz.choices.find((c) => c.isCorrect);

    return {
      isCorrect: selectedChoice.isCorrect,
      correctChoiceId: correctChoice?.id,
      explanation: quiz.explanation,
      attemptId: attempt.id,
    };
  }
}
