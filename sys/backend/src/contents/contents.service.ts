import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categoryId?: string) {
    const where = categoryId ? { categoryId } : {};
    return this.prisma.content.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { quizzes: true },
        },
      },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        category: true,
        quizzes: {
          include: {
            choices: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!content) {
      throw new NotFoundException('コンテンツが見つかりません');
    }

    return content;
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    });
  }
}
