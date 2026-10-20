<script setup lang="ts">
import catalog from '../../../catalog/content-index.json'
import { siteLink } from './siteLink'
const topics = [
  { key: 'basics', number: '01', title: '基础知识', sub: '建立理解算法的语言', text: '从信息论到研究写作，把概念、问题和证据连起来。', url: '/basics/', links: [{ title: '信息论基础', url: '/basics/probability' }, { title: '研究与写作', url: '/basics/research-writing' }] },
  { key: 'reinforcement-learning', number: '02', title: '强化学习', sub: '从课程基础走向策略优化', text: '从课程知识地图出发，深入 PPO 与 GRPO。', url: '/reinforcement-learning/', links: [{ title: 'RL基础', url: '/reinforcement-learning/algorithm-map' }, { title: 'PPO', url: '/reinforcement-learning/ppo' }, { title: 'GRPO', url: '/reinforcement-learning/grpo' }] },
  { key: 'cad', number: '03', title: 'CAD', sub: '沿研究问题阅读论文', text: '按生成、重建、编辑与理解评估，连接论文、数据和研究问题。', url: '/cad/', links: [{ title: '第二版研究树', url: '/cad/' }, { title: '论文库', url: '/cad/reading-navigation' }, { title: '问题分析', url: '/cad/issues' }] }
]
const count = (key: string) => catalog.filter(row => row.category === key).length
const recent = [...catalog].sort((a, b) => String(b.updated).localeCompare(String(a.updated)) || (b.order ?? 0) - (a.order ?? 0)).slice(0, 4)
</script>

<template>
  <div class="home-dashboard">
    <div class="home-intro">
      <div class="home-intro-copy">
        <p class="home-kicker"><span></span> 个人研究知识库 · 持续整理</p>
        <h1>把知识连成图谱，<br><em>让阅读走向理解。</em></h1>
        <p class="hero-description">课程知识、算法推导与论文阅读，在这里汇成一条清晰的学习路径。从一个问题出发，沿着原始来源深入。</p>
        <div class="hero-actions"><a class="primary-action" :href="siteLink('/reinforcement-learning/algorithm-map')">从 RL基础开始 <span>↗</span></a><a class="secondary-action" :href="siteLink('/library')">浏览全部文章 <span>→</span></a></div>
        <div class="hero-stats"><span><strong>{{ catalog.length }}</strong> 篇内容</span><span><strong>3</strong> 个学习栏目</span><span>原始来源可追溯</span></div>
      </div>
      <div class="knowledge-art" role="img" aria-label="基础知识、强化学习与 CAD 连接为学习图谱的示意">
        <div class="art-label">A MAP FOR YOUR QUESTIONS</div>
        <svg viewBox="0 0 380 280" aria-hidden="true">
          <g fill="none" stroke="currentColor" opacity=".22"><path d="M75 75L190 145L310 65M190 145L300 235M75 75L80 220L190 145M310 65L300 235M190 145L200 30"/><circle cx="190" cy="145" r="85" stroke-dasharray="3 7"/><circle cx="190" cy="145" r="120" stroke-dasharray="2 9"/></g>
          <circle class="node-core" cx="190" cy="145" r="38"/><text x="190" y="150" text-anchor="middle" class="node-core-text">理解</text>
          <circle class="node" cx="75" cy="75" r="8"/><circle class="node" cx="310" cy="65" r="8"/><circle class="node node-accent" cx="300" cy="235" r="8"/>
          <circle class="node-small" cx="80" cy="220" r="4"/><circle class="node-small" cx="200" cy="30" r="4"/>
          <text x="40" y="50">基础知识</text><text x="274" y="40">强化学习</text><text x="314" y="260">CAD</text><text x="30" y="249" class="art-small">原始来源</text><text x="214" y="30" class="art-small">问题</text>
        </svg>
        <div class="art-footer"><span>阅读</span><i></i><span>连接</span><i></i><span>理解</span></div>
      </div>
    </div>
    <div class="home-section-heading"><div><span class="section-eyebrow">EXPLORE THE ATLAS</span><h2 id="学习栏目">选择一条学习路径</h2></div><a :href="siteLink('/library')">文章索引 ↗</a></div>
    <div class="topic-grid">
      <section v-for="topic in topics" :key="topic.key" class="topic-card" :class="'topic-' + topic.key">
        <div class="topic-top"><span>{{ topic.number }}</span><small>{{ count(topic.key) }} 篇内容</small></div>
        <a class="topic-title" :href="siteLink(topic.url)">{{ topic.title }} <span>↗</span></a>
        <h3>{{ topic.sub }}</h3><p>{{ topic.text }}</p>
        <div class="topic-links"><a v-for="link in topic.links" :key="link.url" :href="siteLink(link.url)">{{ link.title }} <span>→</span></a></div>
      </section>
    </div>
    <div class="feature-strip">
      <div><span class="section-eyebrow">FOCUS / 策略优化</span><h2>从 PPO 到 GRPO</h2><p>先理解裁剪目标，再比较价值估计与组内相对优势。</p></div>
      <a :href="siteLink('/reinforcement-learning/ppo')"><span>01 / PPO</span><strong>如何控制策略更新？</strong><small>概率比 · 优势 · 裁剪目标 ↗</small></a>
      <a :href="siteLink('/reinforcement-learning/grpo')"><span>02 / GRPO</span><strong>如何用一组回答学习？</strong><small>组内统计 · KL · 算法对比 ↗</small></a>
    </div>
    <div class="home-section-heading"><div><span class="section-eyebrow">RECENT NOTES</span><h2 id="近期整理">近期整理</h2></div><a :href="siteLink('/recent')">查看全部更新 ↗</a></div>
    <div class="recent-grid"><a v-for="row in recent" :key="row.id" :href="siteLink(row.url)" class="recent-note"><small>{{ row.updated }} </small><strong>{{ row.title }}</strong><span class="recent-tags">{{ row.tags.slice(0, 3).join(' / ') }}</span><span class="recent-arrow">↗</span></a></div>
    <div class="home-footnote"><span class="status-dot"></span><p>从基础概念到算法推导，再到论文方法与图表，沿着研究问题展开阅读。</p><a :href="siteLink('/cad/')">探索 CAD 研究 →</a></div>
  </div>
</template>
