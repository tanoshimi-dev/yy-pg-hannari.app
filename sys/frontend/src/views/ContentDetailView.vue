<script setup lang="ts">
import { onMounted, ref, computed, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Marked, Renderer } from 'marked';
import { useLearningStore } from '../stores/learning';
import AppLayout from '../components/AppLayout.vue';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const route = useRoute();
const router = useRouter();
const learningStore = useLearningStore();
const bodyContentRef = ref<HTMLElement | null>(null);
const activeHeadingId = ref('');
const tocOpen = ref(false);

const contentId = route.params.id as string;
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

onMounted(async () => {
  await learningStore.fetchContent(contentId);
  await learningStore.markProgress(contentId);
  await nextTick();
  observeHeadings();
});

onUnmounted(() => {
  if (headingObserver) headingObserver.disconnect();
});

// Extract TOC from markdown body
const toc = computed<TocItem[]>(() => {
  const body = learningStore.currentContent?.body;
  if (!body) return [];
  const items: TocItem[] = [];
  const cleaned = body.replace(/```[\s\S]*?```/g, '');
  const regex = /^(#{1,3}) (.+)$/gm;
  let match;
  while ((match = regex.exec(cleaned)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*`]/g, '');
    const id = 'heading-' + items.length;
    items.push({ id, text, level });
  }
  return items;
});

function scrollToHeading(id: string) {
  const el = bodyContentRef.value?.querySelector(`[id="${id}"]`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeHeadingId.value = id;
  }
  tocOpen.value = false;
}

let headingObserver: IntersectionObserver | null = null;

function observeHeadings() {
  if (!bodyContentRef.value) return;
  const headings = bodyContentRef.value.querySelectorAll('h1[id], h2[id], h3[id]');
  if (headings.length === 0) return;

  headingObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeHeadingId.value = entry.target.id;
          break;
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
  );

  headings.forEach((h) => headingObserver!.observe(h));
}

function startQuiz() {
  router.push(`/contents/${contentId}/quiz`);
}

function goBack() {
  router.push('/contents');
}

function resolveMediaUrl(src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${apiBase}${src}`;
}

function renderBody(body: string): string {
  let headingIndex = 0;

  // Pre-process: convert @[alt](src) video syntax before marked parses it
  const preprocessed = body.replace(/@\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    const url = resolveMediaUrl(src);
    return `<div class="video-wrapper"><video controls preload="metadata" title="${alt}"><source src="${url}">お使いのブラウザは動画再生に対応していません。</video>${alt ? `<p class="media-caption">${alt}</p>` : ''}</div>`;
  });

  // Configure marked with custom renderer
  const renderer = new Renderer();

  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = 'heading-' + headingIndex++;
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };

  renderer.image = function ({ href, title, text }) {
    const url = resolveMediaUrl(href);
    const alt = text || '';
    const titleAttr = title ? ` title="${title}"` : '';
    return `<figure class="image-wrapper"><img src="${url}" alt="${alt}"${titleAttr} loading="lazy">${alt ? `<figcaption class="media-caption">${alt}</figcaption>` : ''}</figure>`;
  };

  const marked = new Marked({ renderer });

  const html = marked.parse(preprocessed) as string;

  // Wrap tables in scrollable container for mobile
  return html.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
}
</script>

<template>
  <AppLayout>
    <div class="content-detail">
      <button class="back-btn" @click="goBack">
        &#8592; コンテンツ一覧へ
      </button>

      <div v-if="learningStore.loading" class="loading">
        <div class="spinner"></div>
        <p>読み込み中...</p>
      </div>

      <div v-else-if="learningStore.error" class="error-message">
        <p>{{ learningStore.error }}</p>
      </div>

      <template v-else-if="learningStore.currentContent">
        <div class="content-header">
          <div
            v-if="learningStore.currentContent.category"
            class="content-category"
          >
            {{ learningStore.currentContent.category.name }}
          </div>
          <h1>{{ learningStore.currentContent.title }}</h1>
          <p class="content-description">
            {{ learningStore.currentContent.description }}
          </p>
        </div>

        <div class="content-layout">
          <!-- Table of Contents (sidebar on desktop, collapsible on mobile) -->
          <aside v-if="toc.length > 0" class="toc-sidebar">
            <nav class="toc-nav">
              <button class="toc-toggle" @click="tocOpen = !tocOpen">
                <span class="toc-toggle-icon">{{ tocOpen ? '&#9650;' : '&#9660;' }}</span>
                もくじ
              </button>
              <ul class="toc-list" :class="{ 'toc-open': tocOpen }">
                <li
                  v-for="item in toc"
                  :key="item.id"
                  class="toc-item"
                  :class="{
                    [`toc-level-${item.level}`]: true,
                    'toc-active': activeHeadingId === item.id,
                  }"
                >
                  <a @click.prevent="scrollToHeading(item.id)">{{ item.text }}</a>
                </li>
              </ul>
            </nav>
          </aside>

          <!-- Main content -->
          <div class="content-main">
            <div class="content-body">
              <div
                ref="bodyContentRef"
                class="body-content"
                v-html="renderBody(learningStore.currentContent.body)"
              ></div>
            </div>

            <div
              v-if="
                learningStore.currentContent.quizzes &&
                learningStore.currentContent.quizzes.length > 0
              "
              class="quiz-cta"
            >
              <div class="quiz-cta-inner">
                <div class="quiz-cta-text">
                  <h3>クイズに挑戦しよう！</h3>
                  <p>
                    {{ learningStore.currentContent.quizzes.length }}問のクイズがあります
                  </p>
                </div>
                <button class="btn-primary btn-large" @click="startQuiz">
                  クイズをはじめる
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.content-detail {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  color: #7c3aed;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #6d28d9;
}

.content-header {
  margin-bottom: 2rem;
}

.content-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ede9fe;
  color: #7c3aed;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.content-header h1 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.content-description {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.content-body {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  min-width: 0;
}

.body-content {
  color: #475569;
  line-height: 1.8;
  font-size: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  min-width: 0;
}

.body-content :deep(h1) {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 1.5rem 0 0.75rem;
}

.body-content :deep(h2) {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 1.25rem 0 0.5rem;
}

.body-content :deep(h3) {
  font-size: 1.1rem;
  color: #1e293b;
  margin: 1rem 0 0.5rem;
}

.body-content :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.body-content :deep(code) {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875em;
  color: #7c3aed;
  word-break: break-all;
  overflow-wrap: break-word;
}

.body-content :deep(pre) {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

.body-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
  white-space: pre;
  word-break: normal;
  overflow-wrap: normal;
}

.body-content :deep(p) {
  margin: 0 0 1rem;
}

.body-content :deep(.table-scroll) {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1rem 0;
}

.body-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  min-width: 400px;
}

.body-content :deep(th),
.body-content :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.body-content :deep(th) {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

.body-content :deep(tr:nth-child(even)) {
  background: #f8fafc;
}

.body-content :deep(ul),
.body-content :deep(ol) {
  margin: 0.5rem 0 1rem;
  padding-left: 1.5rem;
}

.body-content :deep(li) {
  margin-bottom: 0.25rem;
}

.body-content :deep(hr) {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5rem 0;
}

.body-content :deep(blockquote) {
  border-left: 3px solid #7c3aed;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: #f5f3ff;
  color: #475569;
}

.body-content :deep(a) {
  color: #7c3aed;
  text-decoration: underline;
}

.body-content :deep(figure) {
  margin: 0;
  overflow: hidden;
}

.body-content :deep(.image-wrapper) {
  margin: 1.5rem 0;
  text-align: center;
  overflow: hidden;
}

.body-content :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}

.body-content :deep(.image-wrapper img) {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  object-fit: contain;
}

.body-content :deep(.video-wrapper) {
  margin: 1.5rem 0;
  text-align: center;
  overflow: hidden;
}

.body-content :deep(.video-wrapper video) {
  max-width: 100%;
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.body-content :deep(.media-caption) {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
  font-style: italic;
}

.quiz-cta {
  margin-bottom: 2rem;
}

.quiz-cta-inner {
  background: linear-gradient(135deg, #ede9fe, #f3e8ff);
  border: 1px solid #ddd6fe;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.quiz-cta-text h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0 0 0.25rem;
}

.quiz-cta-text p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  white-space: nowrap;
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

/* Layout with TOC sidebar */
.content-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.content-main {
  flex: 1;
  min-width: 0;
}

/* TOC Sidebar */
.toc-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
}

.toc-nav {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.toc-toggle {
  display: none;
  width: 100%;
  background: none;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  padding: 0.25rem 0;
  text-align: left;
  align-items: center;
  gap: 0.5rem;
}

.toc-toggle-icon {
  font-size: 0.7rem;
  color: #94a3b8;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0;
}

.toc-item a {
  display: block;
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
  text-decoration: none;
  border-left: 2px solid transparent;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1.4;
}

.toc-item a:hover {
  color: #7c3aed;
  background: #f5f3ff;
}

.toc-item.toc-active a {
  color: #7c3aed;
  border-left-color: #7c3aed;
  font-weight: 600;
  background: #f5f3ff;
}

.toc-level-2 a {
  padding-left: 1rem;
}

.toc-level-3 a {
  padding-left: 1.5rem;
  font-size: 0.75rem;
}

/* Mobile: collapsible TOC */
@media (max-width: 868px) {
  .content-layout {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .toc-sidebar {
    width: 100%;
    position: static;
    margin-bottom: 1rem;
  }

  .toc-toggle {
    display: flex;
  }

  .toc-list {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .toc-list.toc-open {
    max-height: 500px;
    margin-top: 0.5rem;
  }
}

@media (max-width: 640px) {
  .content-header h1 {
    font-size: 1.25rem;
  }

  .content-description {
    font-size: 0.85rem;
  }

  .content-body {
    padding: 0.75rem;
    border-radius: 10px;
  }

  .body-content {
    font-size: 0.85rem;
    line-height: 1.7;
  }

  .body-content :deep(h1) {
    font-size: 1.15rem;
  }

  .body-content :deep(h2) {
    font-size: 1.05rem;
  }

  .body-content :deep(h3) {
    font-size: 0.95rem;
  }

  .body-content :deep(p),
  .body-content :deep(li) {
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .body-content :deep(code) {
    font-size: 0.8em;
  }

  .body-content :deep(pre) {
    padding: 0.75rem;
    font-size: 0.75rem;
  }

  .body-content :deep(ul),
  .body-content :deep(ol) {
    padding-left: 1.25rem;
  }

  .body-content :deep(th),
  .body-content :deep(td) {
    padding: 0.3rem 0.4rem;
    font-size: 0.75rem;
  }

  .body-content :deep(blockquote) {
    padding: 0.375rem 0.75rem;
    font-size: 0.85rem;
  }

  .quiz-cta-inner {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
  }

  .quiz-cta-text h3 {
    font-size: 1rem;
  }

  .btn-large {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
