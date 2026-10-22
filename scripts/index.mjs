import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { buildCadV2, renderCadV2Overview } from './build-cad-v2.mjs'
import { formatReaderPages } from './reader-format.mjs'
import { buildPracticeAssets } from './build-practice-assets.mjs'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const categories={basics:'基础知识','reinforcement-learning':'强化学习',cad:'CAD'}
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});let files=[];for(const e of entries){if(e.name.startsWith('.'))continue;const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else if(e.name.endsWith('.md'))files.push(p)}return files}
const docs=path.join(root,'docs'), rows=[], ids=new Set()
await buildPracticeAssets()
await buildCadV2()
await formatReaderPages()
for(const file of await walk(docs)){
  const {data}=matter(await fs.readFile(file,'utf8'))
  if(!data.id)continue
  if(ids.has(data.id))throw new Error(`重复文章 ID: ${data.id}`)
  ids.add(data.id)
  if(data.unlisted)continue
  if(!data.title||!categories[data.category])throw new Error(`缺少标题或栏目: ${file}`)
  if(!['draft','ready','template'].includes(data.status))throw new Error(`无效文章状态: ${file}`)
  if(!Array.isArray(data.tags)||!Array.isArray(data.sources)||typeof data.reviewed!=='boolean')throw new Error(`请检查 tags / sources / reviewed: ${file}`)
  const rel=path.relative(docs,file).split(path.sep).join('/')
  rows.push({...data,file:rel,url:'/'+rel.replace(/\.md$/,'')})
}
rows.sort((a,b)=>(a.order??999)-(b.order??999)||a.title.localeCompare(b.title,'zh-CN'))
for(const row of rows)for(const id of [...(row.prerequisites??[]),...(row.related??[])])if(!ids.has(id))throw new Error(`${row.id} 关联了不存在的文章 ${id}`)
await fs.mkdir(path.join(root,'catalog'),{recursive:true})
await fs.writeFile(path.join(root,'catalog/content-index.json'),JSON.stringify(rows,null,2)+'\n')
function table(items){return '| 文章 | 主题 | 更新日期 |\n| --- | --- | --- |\n'+items.map(r=>`| [${r.title}](${r.url}) | ${r.tags.join(' · ')} | ${r.updated} |`).join('\n')+'\n'}
let library='# 文章索引\n\n按栏目浏览文章，或使用搜索查找概念、论文与研究问题。\n'
for(const [key,label] of Object.entries(categories)){
  const items=rows.filter(r=>r.category===key)
  library+=`\n## ${label}\n\n${table(items)}`
  await fs.mkdir(path.join(docs,key),{recursive:true})
  const descriptions={basics:'从信息论基础、研究写作到技术实践，连接概念、训练代码与结果检查。', 'reinforcement-learning':'从 Bellman 方程与价值估计开始，理解策略梯度，再深入 PPO 与 GRPO。',cad:'按照你的选择，第一版接入 9 篇先读草稿，另外 10 篇补读保留在资料导航中。第二版按四任务、时间和独立标签浏览研究资料。'}
  const readingPath=key==='reinforcement-learning'?'\n\n## 建议阅读路线\n\n[信息论基础](/basics/probability) → [RL基础](/reinforcement-learning/algorithm-map) → [PPO](/reinforcement-learning/ppo) → [GRPO](/reinforcement-learning/grpo)。先理解优势与策略梯度，再比较 Critic 和组内奖励统计。\n\n## PPO 与 GRPO 的关键区别\n\n| 对比项 | PPO 的常见 Actor–Critic 实现 | 结果奖励 GRPO |\n| --- | --- | --- |\n| 优势来源 | 价值估计与 GAE | 同题多回答的组内奖励统计 |\n| 价值网络 | 训练 Critic | 无需单独 Critic |\n| 共同机制 | 新旧概率比、裁剪目标 | 新旧概率比、裁剪目标 |\n\n此表概括本站两篇文章的教学配置，公式、适用条件和原始来源见各篇正文。\n':''
  await fs.writeFile(path.join(docs,key,'index.md'),key==='cad'?renderCadV2Overview():`# ${label}\n\n> ${descriptions[key]}\n${readingPath}\n## 阅读目录\n\n${table(items)}`)
}
await fs.writeFile(path.join(docs,'library.md'),library)
await fs.writeFile(path.join(docs,'recent.md'),`# 最近更新\n\n${table([...rows].sort((a,b)=>String(b.updated).localeCompare(String(a.updated))).slice(0,10))}`)
console.log(`已索引 ${rows.length} 篇文章，生成栏目页和文章索引。`)
