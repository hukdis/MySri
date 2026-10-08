<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
const props = defineProps<{ src: string; title: string; source: string; page?: number }>()
const dialog = ref<HTMLDialogElement>()
</script>
<template>
  <figure class="paper-figure">
    <div class="paper-figure-heading"><span>{{ title }}</span><button type="button" @click="dialog?.showModal()">放大原图</button></div>
    <button class="paper-figure-preview" type="button" :aria-label="'放大查看：' + title" @click="dialog?.showModal()"><img :src="withBase(props.src)" :alt="title" loading="lazy" decoding="async"></button>
    <figcaption>原论文截图<span v-if="page"> · PDF 第 {{ page }} 页</span> · <a :href="source" target="_blank" rel="noopener noreferrer">论文出处 ↗</a></figcaption>
  </figure>
  <dialog ref="dialog" class="paper-image-dialog" :aria-label="title + '放大图'">
    <div class="paper-figure-heading"><strong>{{ title }}</strong><button type="button" @click="dialog?.close()">关闭</button></div>
    <div class="paper-image-viewport"><img :src="withBase(props.src)" :alt="title"></div>
    <p>原图表版权归原作者及相应权利人 · <a :href="source" target="_blank" rel="noopener noreferrer">原论文</a></p>
  </dialog>
</template>
