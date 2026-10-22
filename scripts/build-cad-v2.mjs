import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { readerBody } from './reader-format.mjs'
import { insertFigureTranslations } from './figure-translations.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(await fs.readFile(path.join(root, 'catalog/cad-research.json'), 'utf8'))
const papers = new Map(data.papers.map(p => [p.id, p]))
const external = new Map(data.externalPapers.map(p => [p.id, p]))
const concepts = new Map(data.concepts.map(p => [p.id, p]))
const tasks = new Map(data.tasks.map(t => [t.id, t]))
const taskSlugs = {GEN:'generation', REC:'reconstruction', EDIT:'editing', ANALYZE:'analysis'}
const labels = {
  inputs:'输入', representations:'表示', methods:'方法', objects:'对象', requirements:'要求',
  data:'数据许可', code:'代码许可', caveat:'使用条件', official:'官方划分', group_unit:'分组单位', leakage_note:'泄漏检查',
  parents:'上游来源', note:'说明', steps:'使用步骤', backend:'执行后端', expected:'预期产物',
  datasets:'数据安排', missing_labels:'所需标注', construction:'构造方式', license:'许可说明', leakage_control:'来源与泄漏控制',
  hypothesis:'可证伪假设', baselines:'比较基线', split:'数据划分', metrics:'指标', ablations:'消融',
  support_criterion:'预设支持判据', rejection_criterion:'否定或收缩条件', minimal_scale:'最小起步规模',
  established:'来源材料中的机制解释', hypotheses:'待验证的原因假设',
}
const text = value => String(value ?? '').replace(/(?:[；，]\s*)?(?:sources|catalog)[\\/][^；，。\s]+/g,'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('{','&#123;').replaceAll('}','&#125;').replaceAll('|','&#124;')
const safeUrl = value => /^https?:\/\//i.test(value ?? '') ? String(value).replaceAll(' ', '%20').replaceAll(')', '%29') : ''
const paperLink = id => { const p=papers.get(id); const e=external.get(id); return p ? `[${text(p.short)}](${p.urlLocal})` : e && safeUrl(e.url) ? `[${text(e.title)}](${safeUrl(e.url)})` : text(concepts.get(id)?.title??id) }
const datasetLink = id => data.datasets.some(d=>d.id===id) ? `[${text(data.datasets.find(d=>d.id===id).name)}](/cad/datasets/${id.toLowerCase()})` : text(id)
const issueLink = id => data.issues.some(d=>d.id===id) ? `[${text(id)}](/cad/issues/${id.toLowerCase()})` : text(id)
const taskLink = id => tasks.has(id) ? `[${tasks.get(id).title}](/cad/tasks/${taskSlugs[id]})` : '共用基础'
const list = values => (values ?? []).map(v=>`- ${text(v)}`).join('\n') || ''
function fields(value) {
  if (value == null) return ''
  if (Array.isArray(value)) return value.some(v=>v&&typeof v==='object') ? value.map(fields).join('\n') : list(value) + '\n'
  if (typeof value !== 'object') return text(value) + '\n'
  return Object.entries(value).filter(([,item])=>item!=null&&item!==''&&(!Array.isArray(item)||item.length)).map(([key,item])=>`\n**${labels[key] ?? key}**\n\n${fields(item)}`).join('\n')
}
const warning = ''

function sourceList(refs, fallback) {
  const urls = [...new Set([...(refs ?? []).map(r=>r.url), fallback].filter(u=>safeUrl(u)))]
  return urls.map((url,i)=>`- [原始来源 ${i+1}](${safeUrl(url)})`).join('\n') || ''
}
async function write(file, id, title, body, sources = [], extra = {}) {
  const target = path.join(root, 'docs/cad', file + '.md')
  await fs.mkdir(path.dirname(target), {recursive:true})
  const meta={id,title,category:'cad',type:'concept',tags:['研究树第二版'],prerequisites:[],related:[],sources:[...new Set(sources.filter(Boolean))],status:'draft',reviewed:false,order:60,created:'2026-10-19',updated:'2026-10-20',...extra}
  body=readerBody(body).replace(/^.*(?:未标注仅表示资料|来源材料没有为此记录|此页为资料卡片|原 19 篇资料|资料记录与详读深度|原始链接待补充).*\n?/gm,'').replace(/^> (?:资料记录[^\n]*|资源记录[^\n]*)\n/gm,'').replace(/^.*source 详读.*\n/gm,'').replace(/^- \*\*[^*]+\*\*：[；\s]*$/gm,'').replace(/^(?:资源|问题)：(?:未单列)?。?\n/gm,'').replace(/^- \*\*[^*]+\*\*：未标注\n/gm,'').replace(/\n{3,}/g,'\n\n')
  body=body.replace(/^## [^\n]+\n\s*(?=^## |$(?![\s\S]))/gm,'')
  await fs.writeFile(target, matter.stringify(`# ${text(title)}\n${body.trimEnd()}\n`,meta))
}
function relationsFor(id) {
  const rows=data.relations.filter(r=>r.from===id||r.to===id)
  return rows.map(r=>`\n### ${text(r.id)} · ${text(r.type)}\n\n${paperLink(r.from)} → ${paperLink(r.to)}\n\n${text(r.description)}\n\n原文位置：${text(r.evidence?.locator ?? '')}。`).join('\n') || ''
}
export async function buildCadV2() {
  for (const p of data.papers) {
    if (p.hasReading) {
      const filename=path.join(root,'docs',p.urlLocal+'.md')
      const existing=matter(await fs.readFile(filename,'utf8'))
      let content=existing.content.replace(/\n+<!-- cad-v2-context -->[\s\S]*?<!-- \/cad-v2-context -->\n+/g,'\n').replace(/\n<!-- cad-v2-relations -->[\s\S]*?<!-- \/cad-v2-relations -->\n/g,'\n')
      content=content.replace(/^(# .+)\n+/m,`$1\n\n<!-- cad-v2-context -->\n> **研究任务 · ${tasks.get(p.classification.primary_task)?.title ?? ''}** · [研究总览](/cad/) · [九篇详读](/cad/reading-navigation?reading=1)\n<!-- /cad-v2-context -->\n\n`)
      content=content.trimEnd()+`\n\n<!-- cad-v2-relations -->\n::: details 研究树关联：发展关系、资源与问题\n\n${relationsFor(p.id)}\n\n资源：${p.dataset_ids.map(datasetLink).join(' · ')||''}。\n\n问题：${p.issue_ids.map(issueLink).join(' · ')||''}。\n\n${taskLink(p.classification.primary_task)} · [发展关系](/cad/relationships)\n:::\n<!-- /cad-v2-relations -->\n`
      existing.data.updated=existing.data.updated || '2026-10-20';existing.data.status='draft';existing.data.reviewed=false
      existing.data.tags=existing.data.tags.filter(tag=>tag!=='先读')
      await fs.writeFile(filename,matter.stringify(insertFigureTranslations(readerBody(content,p.urlLocal)),existing.data))
      continue
    }
    const c=p.classification
    let body=warning+`\n> 资料记录 · ${p.id} · ${text(p.timeline_date ?? p.year)} · ${text(c.entry_type==='research'?'方法研究':c.entry_type==='foundation'?'历史与理论基础':'资料贡献')}\n\n## 论文信息\n\n- **全名**：${text(p.title)}\n- **作者**：${text((p.authors??[]).join('、'))}\n- **论文时间**：${text(p.timeline_date ?? p.year)}（${text(p.timeline_basis)}）\n- **正式发表记录**：${text(p.dates?.formal_publication)}；${text(p.dates?.formal_venue)}\n- **版本说明**：${text(p.version_note)}\n\n## 任务定位\n\n研究任务：${taskLink(c.primary_task)}。\n\n${text(c.rationale)}\n\n${c.secondary_tasks?.length?'其他任务：'+c.secondary_tasks.map(taskLink).join(' · '):''}\n\n## 方法与贡献\n\n${list(p.contribution)}\n\n## 技术要点\n`
    for (const f of data.facets) body+=`\n- **${f.title}**：${text((c.tags[f.id]??[]).join(' · ')||'')}\n`
    body+=`\n未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。\n\n## 相关研究\n\n${relationsFor(p.id)}\n\n## 关联资源与问题\n\n资源：${p.dataset_ids?.map(datasetLink).join(' · ')||''}。\n\n问题：${p.issue_ids?.map(issueLink).join(' · ')||''}。\n\n## 参考文献\n\n${sourceList(p.source_refs,p.url)}\n\n[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)\n`
    await write('papers/'+p.id.toLowerCase(),p.articleId,p.short,body,(p.source_refs??[]).map(r=>r.url).concat(p.url),{type:'paper',tags:['论文资料记录',...(c.tags.methods??[]).slice(0,3)],cadRecord:true})
  }
  for (const d of data.datasets) {
    let body=warning+`\n> 资源记录 · ${d.id} · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。\n\n## 任务、格式与版本\n\n- **任务入口**：${(d.task_ids??[]).map(taskLink).join(' · ')}\n- **格式**：${text(d.formats.join(' · '))}\n- **规模**：${text(d.scale)}\n- **年份依据**：${text(d.year_basis)}\n- **版本**：${text((d.versions??[]).join(' · '))}\n\n## 官方入口与获取记录\n\n${sourceList(d.source_refs,d.access?.entry_url)}\n\n- **记录状态**：${text(d.access?.label ?? d.access?.status)}\n- **资料核查日期**：${text(d.access?.checked_on)}\n- **核查范围**：${text(d.access?.verification)}\n- **存储与获取**：${text(d.storage)}\n\n${text(d.availability_note)}\n\n## 许可、划分与来源\n\n${fields(d.license)}\n${fields(d.split)}\n${fields(d.provenance)}\n\n## 最小使用方式\n\n${fields(d.first_use)}\n\n## 已知限制\n\n${list(d.limitations)}\n\n## 样例检查范围\n\n`
    for(const check of d.sample_checks??[]) body+=`- ${text(check.id)}：${text(check.checked_on)}；${text(check.format_check??check.status)}${check.geometry_execution?'；几何执行：'+text(check.geometry_execution)+'。':''}\n`
    body+=`\n样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。\n\n## 关联论文与问题\n\n${(d.paper_links??[]).map(p=>paperLink(p.paper_id)).join(' · ')||''}\n\n${(d.issue_ids??[]).map(issueLink).join(' · ')}\n\n[返回数据与评测资源](/cad/resources)\n`
    await write('datasets/'+d.id.toLowerCase(),'cad-data-'+d.id.toLowerCase(),d.name,body,(d.source_refs??[]).map(r=>r.url),{tags:['数据资源',...d.formats.slice(0,2)],cadRecord:true})
  }
  for (const i of data.issues) {
    const supported=i.status==='supported_scoped_problem'
    let body=warning+`\n> ${text(i.id)} · ${supported?'研究问题':'候选问题 · 尚需验证'} · ${taskLink(i.primary_task)}\n\n## 实际场景与失败条件\n\n**场景**：${text(i.scenario)}\n\n**失败条件**：${text(i.failure)}\n\n**后果**：${text(i.consequence)}\n\n## 原论文证据\n`
    for (const e of i.evidence??[]) body+=`\n### ${text(e.paper_id)} · ${text(e.locator)}\n\n${text(e.finding)}\n\n${paperLink(e.paper_id)}${safeUrl(e.url)?` · [证据来源](${safeUrl(e.url)})`:''}\n`
    body+='\n## 已有方案与剩余边界\n'
    for(const n of i.nearest_solutions??[]) body+=`\n### ${text(n.paper_id)}\n\n${paperLink(n.paper_id)}\n\n**已经解决**：${text(n.solved)}\n\n**边界**：${text(n.remaining_boundary)}\n`
    body+=`\n${text(i.remaining_gap)}\n\n## 原因解释与待验证方法\n\n${fields(i.causes)}\n`
    for(const m of i.methods??[]) body+=`\n### ${text(m.name)}\n\n**实施机制**：${text(m.mechanism)}\n\n**相对近邻的拟议变化**：${text(m.difference)}\n\n**成立条件**：${text(m.assumptions)}\n\n**失败风险**：${text(m.failure_risk)}\n`
    body+=`\n## 数据与标注安排\n\n${fields(i.data_plan)}\n\n## 最小验证与否定条件\n\n以下为验证方案，所列阈值是预设判据。\n\n${fields(i.experiment)}\n\n## 关联记录\n\n${(i.paper_ids??[]).map(paperLink).join(' · ')}\n\n${(i.dataset_ids??[]).map(datasetLink).join(' · ')}\n\n[返回问题库](/cad/issues) · ${taskLink(i.primary_task)}\n`
    await write('issues/'+i.id.toLowerCase(),'cad-issue-'+i.id.toLowerCase(),i.title,body,(i.evidence??[]).map(e=>e.url),{tags:[supported?'范围限定问题':'候选问题','待验证方法'],cadRecord:true})
  }
  for (const t of data.tasks) {
    await write('tasks/'+taskSlugs[t.id],'cad-task-'+t.id.toLowerCase(),t.title,`\n> ${t.question}\n\n${t.boundary}\n\n<CadExplorer mode="tree" task="${t.id}" />\n\n## 相关资源与问题\n\n[数据与评测资源](/cad/resources?task=${t.id}) · [问题分析](/cad/issues?task=${t.id}) · [发展关系](/cad/relationships)\n\n主树仅展示方法研究；基础与资料贡献独立收录。次任务通过标签和交叉引用保留。\n`)
  }
  const legacyIds=['Wu21','Kha24b','Li25','Ruk24','Xu24','Che25','Mal26','Yua25','Mal24','Sef20','Wan24b','Gov25','Sun26','Wu26','Du26','Zha26','Don25','Hu26','Qi26b']
  await write('reading-navigation','cad-0002','CAD 论文资料导航',`\n按任务、年份与技术标签查找论文，也可筛选带有图表与方法讲解的详读文章。\n\n<CadExplorer mode="library" />\n\n## 延伸阅读\n\n原 19 篇资料均保留对应入口。两篇 IterCAD 与 Pointer-CAD 的不同版本分别记录，避免按短名误合并。\n\n${legacyIds.map(id=>'- '+paperLink(id)).join('\n')}\n\n[术语与小练习](/cad/concepts)\n`,['sources/论文/00_阅读导航.md'],{order:12,created:'2026-10-07'})
  await write('foundations','cad-v2-foundations','共用基础',`\n几何表示、草图约束、参数依赖、实体选择与交互建模构成不同任务的共同语言。历史记录提供背景，不标成现代大模型方法。\n\n[术语与小练习](/cad/concepts)\n\n<CadExplorer mode="foundations" />\n`)
  let resources='\n按研究任务、数据格式和访问方式查找资源。各条目列出官方入口、许可条件与数据划分。\n\n<CadExplorer mode="resources" />\n\n## 评测、数据与综述论文\n\n纯资源论文与方法研究分开，资源条目与介绍它的论文也分别保留。\n\n'
  resources+=data.papers.filter(p=>p.classification.entry_type==='resource').map(p=>`- ${paperLink(p.id)}：${text(p.contribution?.[0])}`).join('\n')
  await write('resources','cad-v2-resources','数据与评测资源',resources)
  await write('issues','cad-v2-issues','具体问题与待验证方法',`\n从具体失败条件出发，对照已有方案、适用边界与可验证的方法假设。\n\n<CadExplorer mode="issues" />\n\n## 如何使用证据\n\n先核对失败条件、论文版本与已经存在的解决方案，再评估拟议方法的独立增量。AI 原因解释、计划阈值和候选方法均须验证。\n`)
  let relationships='\n从方法改进、数据来源和共用表示三个角度阅读论文间的联系。时间先后不自动表示继承，具体关系附有原文位置。\n\n## 局部关系图\n\n<CadRelations />\n\n## 基础概念节点\n\n'+data.concepts.map(c=>`- **${text(c.title)}**：${c.task_ids.map(taskLink).join(' · ')}`).join('\n')+'\n\n## 有来源的发展关系\n'
  for(const r of data.relations) relationships+=`\n### ${text(r.id)} · ${text(r.type)}\n\n${paperLink(r.from)} → ${paperLink(r.to)}\n\n${text(r.description)}\n\n原文位置：${text(r.evidence?.locator??'')}。\n`
  await write('relationships','cad-v2-relationships','发展关系与技术联系',relationships)
  await write('about','cad-v2-about','CAD 研究导航','\n[研究发展树](/cad/) · [论文资料库](/cad/reading-navigation) · [数据与评测资源](/cad/resources) · [研究问题](/cad/issues)\n',[],{unlisted:true,search:false,outline:false})
}

export function renderCadV2Overview() {
  return `---\ncategory: cad\n---\n# CAD · 研究发展树\n\n<div class="edition-label">第二版 · 四任务与独立标签</div>\n\n> 从任务出发看贡献，沿时间与来源寻找联系，再回到论文和具体问题。\n\n<CadExplorer mode="overview" />\n\n## 文献范围\n\n完整检索截止 **2026-10-14**；分类更新 **2026-10-15**。134 条论文记录、35 项数据资源、26 项问题分析。\n\n[发展关系](/cad/relationships) · [九篇论文详读](/cad/reading-navigation?reading=1)\n`
}
