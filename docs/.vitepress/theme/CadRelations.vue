<script setup lang="ts">
import { computed, ref } from 'vue'
import data from '../../../catalog/cad-research.json'
import { siteLink } from './siteLink'
const focus = ref('Wu21')
const options = [...new Set(data.relations.flatMap(r=>[r.from,r.to]))]
const title = (id:string) => data.papers.find(p=>p.id===id)?.short || data.concepts.find(p=>p.id===id)?.title || id
const url = (id:string) => data.papers.find(p=>p.id===id)?.urlLocal
const edges = computed(()=>data.relations.filter(r=>r.from===focus.value||r.to===focus.value))
</script>
<template>
  <section class="cad-relations" aria-label="局部发展关系图">
    <label>查看某篇论文或基础概念的联系<select v-model="focus" aria-label="关系图中心记录"><option v-for="id in options" :key="id" :value="id">{{ title(id) }}</option></select></label>
    <p class="cad-description" role="status">{{ title(focus) }} · {{ edges.length }} 条已记录关系</p>
    <div v-for="edge in edges" :key="edge.id" class="cad-relation-edge">
      <div class="cad-edge-nodes"><a v-if="url(edge.from)" :href="siteLink(url(edge.from)!)">{{ title(edge.from) }}</a><span v-else>{{ title(edge.from) }}</span><span class="cad-edge-arrow" aria-label="关联到">→</span><a v-if="url(edge.to)" :href="siteLink(url(edge.to)!)">{{ title(edge.to) }}</a><span v-else>{{ title(edge.to) }}</span></div>
      <span class="cad-eyebrow">{{ edge.id }} · {{ edge.type }}</span><p>{{ edge.description }}</p><small>证据定位（来源记录）：{{ edge.evidence?.locator || '待核对' }}</small>
    </div>
  </section>
</template>
