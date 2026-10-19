<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import data from '../../../catalog/cad-research.json'
import { siteLink } from './siteLink'

const props = withDefaults(defineProps<{mode?:'overview'|'tree'|'library'|'foundations'|'resources'|'issues'; task?:string}>(), {mode:'overview',task:''})
interface Card {
  id:string; title:string; detail:string; year:number|null; date:string; url:string;
  task:string; tasks:string[]; tags:Record<string,string[]>; kind:string;
  hasReading:boolean; status:string; formats:string[]; access:string
}
const taskSlugs:Record<string,string> = {GEN:'generation',REC:'reconstruction',EDIT:'editing',ANALYZE:'analysis'}
const taskName = (id:string) => data.tasks.find(t=>t.id===id)?.title || '共用基础与资料'
const filters = ref({q:'',task:props.task,from:'',to:'',sort:'asc',reading:false,kind:'',status:'',access:'',format:'',inputs:'',representations:'',methods:'',objects:'',requirements:''})
const expanded = ref(false)
const isPaper = computed(()=>!['resources','issues'].includes(props.mode))
const isTree = computed(()=>['overview','tree'].includes(props.mode))
const cards = computed<Card[]>(()=> {
  if(props.mode==='resources') return data.datasets.map(d=>({id:d.id,title:d.name,detail:d.scale,year:d.year??null,date:String(d.year??''),url:'/cad/datasets/'+d.id.toLowerCase(),task:'',tasks:d.task_ids,tags:{},kind:'resource',hasReading:false,status:'',formats:d.formats,access:d.access.status}))
  if(props.mode==='issues') return data.issues.map(i=>({id:i.id,title:i.title,detail:i.failure,year:null,date:'',url:'/cad/issues/'+i.id.toLowerCase(),task:i.primary_task,tasks:[i.primary_task,...i.secondary_tasks],tags:{},kind:'issue',hasReading:false,status:i.status,formats:[],access:''}))
  return data.papers.filter(p=>props.mode==='foundations'?p.classification.entry_type==='foundation':isTree.value?p.classification.entry_type==='research':true).map(p=>({id:p.id,title:p.short,detail:p.contribution.join(' '),year:p.year??null,date:p.timeline_date??String(p.year??''),url:p.urlLocal,task:p.classification.primary_task??'',tasks:p.classification.applicable_tasks,tags:p.classification.tags,kind:p.classification.entry_type,hasReading:p.hasReading,status:'',formats:[],access:''}))
})
const results = computed(()=>cards.value.filter(c=>{
  const f=filters.value
  return (!f.q||[c.id,c.title,c.detail,...Object.values(c.tags).flat(),...c.formats].join(' ').toLocaleLowerCase().includes(f.q.toLocaleLowerCase().trim()))
    && (!f.task||(isTree.value?c.task===f.task:c.tasks.includes(f.task))) && (!f.from||(c.year!==null&&c.year>=Number(f.from)))
    && (!f.to||(c.year!==null&&c.year<=Number(f.to))) && (!f.reading||c.hasReading)
    && (!f.kind||c.kind===f.kind) && (!f.status||c.status===f.status)
    && (!f.access||c.access===f.access) && (!f.format||c.formats.includes(f.format))
    && data.facets.every(facet=>{const value=f[facet.id as keyof typeof f];return !value||(c.tags[facet.id]??[]).includes(String(value))})
}).sort((a,b)=>((a.date||'9999').localeCompare(b.date||'9999')||a.id.localeCompare(b.id))*(filters.value.sort==='asc'?1:-1)))
const groups = computed(()=>{
  const entries = new Map<string,Card[]>()
  for(const card of results.value){const key=props.mode==='issues'?taskName(card.task):String(card.year??'年份待核实'); if(!entries.has(key))entries.set(key,[]);entries.get(key)!.push(card)}
  return [...entries].map(([title,items])=>({title,items}))
})
const accessLabels:Record<string,string> = {public:'公开入口',restricted:'受限访问',gated:'需同意条款',unverified:'待核对',request:'申请获取',unavailable:'暂不可用',unknown:'待核对'}
const accessOptions = computed(()=>[...new Set(data.datasets.map(d=>d.access.status))])
const formatOptions = computed(()=>[...new Set(data.datasets.flatMap(d=>d.formats))].sort())
const activeCount = computed(()=>Object.entries(filters.value).filter(([key,value])=>key!=='sort'&&value!==''&&value!==false).length)
const summary = computed(()=>[
  filters.value.task?taskName(filters.value.task):'',filters.value.q?'检索：'+filters.value.q:'',
  filters.value.from||filters.value.to?`${filters.value.from||'不限'}—${filters.value.to||'不限'}`:'',
  filters.value.reading?'已有详读':'', ...data.facets.map(f=>filters.value[f.id as keyof typeof filters.value] ? f.title+'：'+filters.value[f.id as keyof typeof filters.value] : ''),
  filters.value.kind,filters.value.status==='supported_scoped_problem'?'原文支持 · 范围限定':filters.value.status?'候选 · 待验证':'',
  filters.value.access?accessLabels[filters.value.access]||filters.value.access:'',filters.value.format
].filter(Boolean).join(' · '))
function reset(){filters.value={q:'',task:props.task,from:'',to:'',sort:'asc',reading:false,kind:'',status:'',access:'',format:'',inputs:'',representations:'',methods:'',objects:'',requirements:''}}
function selectTag(key:string,value:string){filters.value[key as 'inputs']=value;expanded.value=true}
let restoring=false
let timer:ReturnType<typeof setTimeout>|undefined
function readUrl(){
  restoring=true
  reset()
  const params=new URLSearchParams(window.location.search)
  for(const key of Object.keys(filters.value)) {
    if(key==='reading') filters.value.reading=params.get(key)==='1'
    else if(params.has(key)) (filters.value as Record<string,string|boolean>)[key]=params.get(key)!
  }
  if(props.task) filters.value.task=props.task
  if(data.facets.some(f=>filters.value[f.id as 'inputs'])) expanded.value=true
  nextTick(()=>{restoring=false})
}
onMounted(()=>{readUrl();window.addEventListener('popstate',readUrl)})
onUnmounted(()=>{clearTimeout(timer);window.removeEventListener('popstate',readUrl)})
watch(filters,()=>{
  if(restoring||typeof window==='undefined')return
  clearTimeout(timer)
  timer=setTimeout(()=>{
    const url=new URL(window.location.href)
    for(const [key,value] of Object.entries(filters.value)) {
      if(value!==''&&value!==false&&!(key==='sort'&&value==='asc'))url.searchParams.set(key,value===true?'1':String(value))
      else url.searchParams.delete(key)
    }
    if(url.href!==window.location.href)window.history.pushState({},'',url)
  },350)
},{deep:true})
</script>

<template>
  <div class="cad-explorer">
    <template v-if="mode==='overview'">
      <div class="cad-stat-strip"><span><strong>134</strong>论文记录</span><span><strong>4</strong>任务主线</span><span><strong>35</strong>数据资源</span><span><strong>26</strong>具体问题</span></div>
      <div class="cad-task-grid">
        <a v-for="t in data.tasks" :key="t.id" class="cad-task-card" :href="siteLink('/cad/tasks/'+taskSlugs[t.id])"><span class="cad-eyebrow">{{ t.number }} / {{ t.id }}</span><strong>{{ t.title }} <span>↗</span></strong><p>{{ t.question }}</p><small>{{ data.papers.filter(p=>p.classification.primary_task===t.id).length }} 条方法研究</small></a>
      </div>
      <nav class="cad-jump-links" aria-label="CAD 资料入口"><a :href="siteLink('/cad/foundations')">共用基础 →</a><a :href="siteLink('/cad/reading-navigation')">全部论文 →</a><a :href="siteLink('/cad/resources')">数据与评测 →</a><a :href="siteLink('/cad/issues')">问题分析 →</a></nav>
      <h2 id="任务时间树">任务时间树</h2><p class="cad-description">按主要研究交付组织方法工作。时间先后不自动表示继承；点击论文可查看贡献、来源与已记录的发展关系。</p>
    </template>
    <form class="cad-filter-panel" role="search" aria-label="CAD 资料筛选" @submit.prevent>
      <div class="cad-filter-top"><label class="cad-query">搜索当前资料<input v-model="filters.q" type="search" placeholder="论文、问题、关键词或编号" /></label><button type="button" class="cad-control" @click="reset">重置筛选</button></div>
      <div class="cad-filter-row">
        <label v-if="mode!=='foundations'">任务<select aria-label="任务" v-model="filters.task" :disabled="!!props.task"><option value="">全部任务</option><option v-for="t in data.tasks" :key="t.id" :value="t.id">{{ t.title }}</option></select></label>
        <template v-if="mode!=='issues'"><label>起始年份<input v-model="filters.from" inputmode="numeric" type="number" min="1900" max="2100" placeholder="不限" /></label><label>结束年份<input v-model="filters.to" inputmode="numeric" type="number" min="1900" max="2100" placeholder="不限" /></label><label>时间顺序<select aria-label="时间顺序" v-model="filters.sort"><option value="asc">从早到晚</option><option value="desc">从新到旧</option></select></label></template>
        <label v-if="mode==='library'">记录类型<select aria-label="记录类型" v-model="filters.kind"><option value="">全部类型</option><option value="research">方法研究</option><option value="foundation">历史与理论基础</option><option value="resource">资料贡献</option></select></label>
        <label v-if="mode==='issues'">问题证据<select aria-label="问题证据" v-model="filters.status"><option value="">全部状态</option><option value="supported_scoped_problem">原文支持 · 范围限定</option><option value="candidate_needs_validation">候选 · 待验证</option></select></label>
        <template v-if="mode==='resources'"><label>访问状态<select aria-label="访问状态" v-model="filters.access"><option value="">全部状态</option><option v-for="a in accessOptions" :key="a" :value="a">{{ accessLabels[a]||a }}</option></select></label><label>数据格式<select aria-label="数据格式" v-model="filters.format"><option value="">全部格式</option><option v-for="f in formatOptions" :key="f" :value="f">{{ f }}</option></select></label></template>
      </div>
      <div v-if="isPaper" class="cad-filter-footer"><label v-if="mode!=='foundations'" class="cad-checkbox"><input v-model="filters.reading" type="checkbox" />仅看已有九篇详读</label><button class="cad-text-button" type="button" :aria-expanded="expanded" @click="expanded=!expanded">{{ expanded?'收起':'展开' }}五类标签筛选 {{ expanded?'−':'+' }}</button></div>
      <div v-if="isPaper&&expanded" class="cad-facet-row"><label v-for="f in data.facets" :key="f.id">{{ f.title }}<select :aria-label="f.title" v-model="filters[f.id as 'inputs']"><option value="">不限{{ f.title }}</option><option v-for="value in f.values" :key="value" :value="value">{{ value }}</option></select></label></div>
    </form>
    <div class="cad-results-heading"><span role="status" aria-live="polite">找到 <strong>{{ results.length }}</strong> 条{{ mode==='resources'?'资源':mode==='issues'?'问题':'论文' }}</span><small>{{ isPaper?'资料记录 ≠ 全文详读':'来源材料记录 · 待人工复核' }}</small></div>
    <p v-if="activeCount" class="cad-active-filters">当前筛选：{{ summary }}</p>
    <p v-if="filters.from&&filters.to&&Number(filters.from)>Number(filters.to)" class="cad-empty">起始年份大于结束年份，请调整年份范围。</p>
    <p v-else-if="!results.length" class="cad-empty">没有找到匹配资料。可以减少筛选条件，或点击“重置筛选”。</p>
    <div v-for="group in groups" :key="group.title" class="cad-year-group">
      <h3>{{ group.title }} <small>{{ group.items.length }} 条</small></h3>
      <div class="cad-timeline">
        <article v-for="card in group.items" :key="card.id" class="cad-record">
          <div class="cad-record-top"><span>{{ card.id }}<template v-if="card.date"> · {{ card.date }}</template></span><span class="cad-record-state" :class="{'is-reading':card.hasReading}">{{ card.hasReading?'已有详读':card.kind==='issue'?(card.status==='supported_scoped_problem'?'范围限定问题':'候选 · 待验证'):card.kind==='foundation'?'基础记录':card.kind==='resource'?'资源记录':'论文记录' }}</span></div>
          <a class="cad-record-title" :href="siteLink(card.url)">{{ card.title }} <span>↗</span></a>
          <p>{{ card.detail }}</p>
          <div class="cad-tags"><span v-if="card.task" class="cad-task-tag">{{ taskName(card.task) }}</span><span v-if="card.kind==='resource'&&card.access">{{ accessLabels[card.access]||card.access }}</span><template v-for="facet in data.facets" :key="facet.id"><button v-for="value in (card.tags[facet.id]||[]).slice(0,2)" :key="facet.id+value" type="button" :aria-label="'筛选'+facet.title+'：'+value" @click="selectTag(facet.id,value)">{{ value }}</button></template><span v-for="format in card.formats.slice(0,4)" :key="format">{{ format }}</span></div>
        </article>
      </div>
    </div>
  </div>
</template>
