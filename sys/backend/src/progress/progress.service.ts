import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    return this.prisma.userProgress.findMany({
      where: { userId },
      include: {
        content: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });
  }

  async markProgress(
    userId: string,
    contentId: string,
    completed: boolean = false,
  ) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      throw new NotFoundException('コンテンツが見つかりません');
    }

    return this.prisma.userProgress.upsert({
      where: {
        userId_contentId: {
          userId,
          contentId,
        },
      },
      update: {
        completed,
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        contentId,
        completed,
        lastAccessedAt: new Date(),
      },
      include: {
        content: {
          include: { category: true },
        },
      },
    });
  }

  async getDashboard(userId: string) {
    const totalContents = await this.prisma.content.count();

    const completedContents = await this.prisma.userProgress.count({
      where: { userId, completed: true },
    });

    const startedContents = await this.prisma.userProgress.count({
      where: { userId },
    });

    const totalAttempts = await this.prisma.userQuizAttempt.count({
      where: { userId },
    });

    const correctAttempts = await this.prisma.userQuizAttempt.count({
      where: { userId, isCorrect: true },
    });

    const recentProgress = await this.prisma.userProgress.findMany({
      where: { userId },
      include: {
        content: {
          include: { category: true },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
      take: 5,
    });

    const categoryProgress = await this.prisma.category.findMany({
      include: {
        contents: {
          include: {
            progress: {
              where: { userId },
            },
            _count: {
              select: { quizzes: true },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const categories = categoryProgress.map((cat) => {
      const totalInCategory = cat.contents.length;
      const completedInCategory = cat.contents.filter((c) =>
        c.progress.some((p) => p.completed),
      ).length;
      return {
        id: cat.id,
        name: cat.name,
        totalContents: totalInCategory,
        completedContents: completedInCategory,
        progressPercent:
          totalInCategory > 0
            ? Math.round((completedInCategory / totalInCategory) * 100)
            : 0,
      };
    });

    return {
      totalContents,
      completedContents,
      startedContents,
      progressPercent:
        totalContents > 0
          ? Math.round((completedContents / totalContents) * 100)
          : 0,
      totalQuizAttempts: totalAttempts,
      correctQuizAttempts: correctAttempts,
      quizAccuracy:
        totalAttempts > 0
          ? Math.round((correctAttempts / totalAttempts) * 100)
          : 0,
      recentProgress,
      categories,
    };
  }
}
