<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { siteLink } from './siteLink'
const { frontmatter } = useData()
const wide = ref(false)
const labels: Record<string, string> = { basics: '基础知识', 'reinforcement-learning': '强化学习', cad: 'CAD' }
const category = computed(() => labels[frontmatter.value.category] || '学习导航')
const isLanding = computed(() => frontmatter.value.pageClass === 'atlas-home')
function toggleWidth() {
  wide.value = !wide.value
  try { localStorage.setItem('atlas-wide-reading', String(wide.value)) } catch {}
}
onMounted(() => {
  try { wide.value = localStorage.getItem('atlas-wide-reading') === 'true' } catch {}
})
</script>

<template>
  <div class="atlas-shell" :class="{ 'reading-wide': wide, 'landing-shell': isLanding }">
    <DefaultTheme.Layout>
      <template #nav-bar-title-before>
        <svg class="atlas-mark" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6 24L16 6l10 18M11 16h10M6 24h20" fill="none" stroke="currentColor" stroke-width="2"/>
          <circle cx="16" cy="6" r="3" fill="currentColor"/><circle cx="6" cy="24" r="3" fill="currentColor"/><circle cx="26" cy="24" r="3" fill="currentColor"/>
        </svg>
      </template>
      <template #sidebar-nav-before>
        <div class="sidebar-caption"><span>知识目录</span><small>LEARNING ATLAS</small></div>
      </template>
      <template #doc-before>
        <div v-if="!isLanding" class="reading-toolbar">
          <nav class="article-breadcrumb" aria-label="当前位置">
            <a :href="siteLink('/')">学习地图</a><span aria-hidden="true">/</span>
            <a v-if="frontmatter.category" :href="siteLink('/' + frontmatter.category + '/')">{{ category }}</a>
            <span v-else>{{ category }}</span>
          </nav>
          <button class="reading-toggle" type="button" :aria-pressed="wide" @click="toggleWidth">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 4H4v12h3M13 4h3v12h-3M8 10h4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
            {{ wide ? '标准阅读' : '宽屏阅读' }}
          </button>
        </div>
        <div v-if="frontmatter.id" class="article-meta">
          <span class="meta-kind">{{ frontmatter.type === 'paper' ? '论文阅读' : '知识笔记' }}</span>
          <span>{{ frontmatter.id }}</span><span>更新 {{ frontmatter.updated }}</span>
          <span class="meta-status">{{ frontmatter.reviewed ? '已复核' : '待人工复核' }}</span>
        </div>
      </template>
    </DefaultTheme.Layout>
  </div>
</template>
