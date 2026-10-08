<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
const props = withDefaults(defineProps<{code: string; title?: string; caption?: string; compact?: boolean}>(), {
  title:'强化学习算法地图',caption:'课程算法地图 · 按知识层级阅读；具体区别见下方表格'
})
const { isDark } = useData()
const svg = ref('')
const dialog = ref<HTMLDialogElement>()
const expanded = ref(false)
const zoom = ref(1)
const instanceId = getCurrentInstance()?.uid ?? 0
const failed = ref(false)
let revision = 0
async function render() {
  const current = ++revision
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:isDark.value?'dark':'neutral'})
    const result = await mermaid.render(`learning-map-${instanceId}-${current}`, props.code)
    if (current === revision) { svg.value = result.svg; failed.value = false }
  } catch { failed.value = true }
}
onMounted(render)
watch(isDark, render)
async function openDiagram() {
  expanded.value = true
  zoom.value = 1
  await nextTick()
  dialog.value?.showModal()
}
</script>

<template>
  <figure class="algorithm-diagram" :class="{ 'diagram-compact': compact }">
    <div class="diagram-toolbar"><span>{{ title }}</span><button type="button" :disabled="!svg || failed" @click="openDiagram">放大查看</button></div>
    <div role="img" :aria-label="title" v-html="svg" />
    <pre v-if="failed">{{ code }}</pre>
    <figcaption>{{ caption }}</figcaption>
  </figure>
  <dialog ref="dialog" class="diagram-dialog" :aria-label="title + '放大图'" @close="expanded = false">
    <div class="diagram-toolbar"><strong>{{ title }}</strong><div class="diagram-actions">
      <button type="button" aria-label="缩小导图" :disabled="zoom <= 0.5" @click="zoom = Math.max(0.5, zoom - 0.25)">−</button>
      <span>{{ Math.round(zoom * 100) }}%</span>
      <button type="button" aria-label="放大导图" :disabled="zoom >= 3" @click="zoom = Math.min(3, zoom + 0.25)">＋</button>
      <button type="button" @click="dialog?.close()">关闭</button>
    </div></div>
    <div class="diagram-viewport"><div v-if="expanded" class="diagram-expanded" :style="{width: (zoom * 100) + '%'}" role="img" :aria-label="title" v-html="svg" /></div>
    <p>{{ caption }}</p>
  </dialog>
</template>
