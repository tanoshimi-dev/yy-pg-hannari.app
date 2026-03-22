import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import { loadCategories, loadAllContents } from './content-parser';

const prisma = new PrismaClient();

const CONTENTS_DIR =
  process.env.CONTENTS_DIR || path.resolve(__dirname, '../../../doc/contents');

async function main() {
  // Clean existing data
  await prisma.userQuizAttempt.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.quizChoice.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.content.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Load and create categories
  const categoryDefs = loadCategories(CONTENTS_DIR);
  const categoryMap = new Map<string, string>();

  for (const cat of categoryDefs) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap.set(cat.tag, created.id);
  }

  // Load and create contents with quizzes
  const contents = loadAllContents(CONTENTS_DIR);
  let totalQuizzes = 0;
  let totalChoices = 0;

  for (const content of contents) {
    const categoryId = categoryMap.get(content.categoryTag);
    if (!categoryId) {
      throw new Error(`Unknown category tag: ${content.categoryTag}`);
    }

    const created = await prisma.content.create({
      data: {
        title: content.meta.title,
        description: content.meta.description,
        body: content.body,
        categoryId,
        sortOrder: content.sortOrder,
      },
    });

    // Create quizzes
    for (let qi = 0; qi < content.quizzes.length; qi++) {
      const quiz = content.quizzes[qi];
      const createdQuiz = await prisma.quiz.create({
        data: {
          contentId: created.id,
          question: quiz.question,
          explanation: quiz.explanation,
          sortOrder: qi + 1,
        },
      });

      await prisma.quizChoice.createMany({
        data: quiz.choices.map((choice, ci) => ({
          quizId: createdQuiz.id,
          text: choice.text,
          isCorrect: choice.isCorrect,
          sortOrder: ci + 1,
        })),
      });

      totalQuizzes++;
      totalChoices += quiz.choices.length;
    }
  }

  console.log('Seed data created successfully!');
  console.log(`Categories: ${categoryDefs.length}`);
  console.log(`Contents: ${contents.length}`);
  console.log(`Quizzes: ${totalQuizzes} (with ${totalChoices} choices)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
