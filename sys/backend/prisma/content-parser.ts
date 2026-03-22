import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

interface QuizChoice {
  text: string;
  isCorrect: boolean;
}

interface Quiz {
  question: string;
  explanation: string;
  choices: QuizChoice[];
}

interface ContentMeta {
  title: string;
  description: string;
}

interface ParsedContent {
  categoryTag: string;
  sortOrder: number;
  meta: ContentMeta;
  body: string;
  quizzes: Quiz[];
}

interface CategoryDef {
  tag: string;
  name: string;
  description: string;
  sortOrder: number;
}

export function loadCategories(contentsDir: string): CategoryDef[] {
  const filePath = path.join(contentsDir, 'categories.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function parseContentDir(dirPath: string): ParsedContent {
  const dirName = path.basename(dirPath);

  // Parse folder name: {categoryTag}-{sortOrder}-{slug}
  const match = dirName.match(/^([a-z]+)-(\d+)-/);
  if (!match) {
    throw new Error(`Invalid content directory name: ${dirName}. Expected format: {tag}-{order}-{slug}`);
  }
  const categoryTag = match[1];
  const sortOrder = parseInt(match[2], 10);

  // Read README.md for metadata
  const readmePath = path.join(dirPath, 'README.md');
  const readmeRaw = fs.readFileSync(readmePath, 'utf-8');
  const { data } = matter(readmeRaw);
  const meta: ContentMeta = {
    title: data.title,
    description: data.description,
  };

  // Read lesson.md for body, rewrite relative asset paths to absolute /media/ URLs
  const lessonPath = path.join(dirPath, 'lesson.md');
  const bodyRaw = fs.readFileSync(lessonPath, 'utf-8');
  const mediaBase = `/media/${dirName}`;
  const body = bodyRaw.replace(
    /(\!\[.*?\]\(|@\[.*?\]\()(?!https?:\/\/)(.+?\))/g,
    (_, prefix, rest) => `${prefix}${mediaBase}/${rest}`,
  );

  // Read quiz.json
  const quizPath = path.join(dirPath, 'quiz.json');
  let quizzes: Quiz[] = [];
  if (fs.existsSync(quizPath)) {
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));
    quizzes = quizData.questions;
  }

  return { categoryTag, sortOrder, meta, body, quizzes };
}

export function loadAllContents(contentsDir: string): ParsedContent[] {
  const entries = fs.readdirSync(contentsDir, { withFileTypes: true });
  const contentDirs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => path.join(contentsDir, e.name))
    .filter((p) => fs.existsSync(path.join(p, 'README.md')));

  return contentDirs
    .map((dirPath) => parseContentDir(dirPath))
    .sort((a, b) => {
      if (a.categoryTag !== b.categoryTag) return a.categoryTag.localeCompare(b.categoryTag);
      return a.sortOrder - b.sortOrder;
    });
}
