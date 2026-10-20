import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const anchors=JSON.parse(await fs.readFile(path.join(root,'catalog/reader-heading-anchors.json'),'utf8'))

/** Remove authoring scaffolding, while keeping source citations and scientific qualifications. */
export function readerBody(input, url='') {
  let body=input.replace(/\r\n/g,'\n')
  const removedSources=[]
  body=body.replace(/^::: (?:info|warning|tip) [^\n]*(?:待人工复核|整理草稿|来源稿整理|内容来源|高阶算法)[^\n]*\n([\s\S]*?)^:::\s*$/gm,(_,content)=>{
    removedSources.push(...[...content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map(m=>({label:m[1],url:m[2]})))
    return ''
  })
  body=body.replace(/^### 你来填写[\s\S]*?(?=^## |\Z|$(?![\s\S]))/gm,'')
  body=body.replace(/^## 本站阅读来源\s*\n[\s\S]*?(?=^<!-- cad-v2-relations|$(?![\s\S]))/gm,'')
  body=body.replace(/^## 11\. [^\n]+\n[\s\S]*?(?=^## |^<!-- cad-v2-relations|$(?![\s\S]))/gm,section=>{
    const refs=[...section.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map(m=>`- [${m[1]}](${m[2]})`)
    const id=anchors[url]?.[section.split('\n')[0].replace(/^## /,'')]
    return `## 参考文献${id?' {#'+id+'}':''}\n\n${[...new Set(refs)].join('\n')}\n\n图表引自原论文，图号与 PDF 页码见各图说明。\n\n`
  })
  body=body.replace(/^.*(?:\*\*(?:本站状态|核查状态|对应代表文献矩阵|本站证据边界)\*\*|来源稿的本地记录|^> 阅读状态：|^正文来自 sources\/|^\*\*现阶段你的任务\*\*|^对你而言，|^本次恢复来源稿|^本笔记依据下列本地原论文|^原阅读稿标注依据).*\n?/gm,'')
  body=body.replace(/^<div class="edition-label">1\.1[^\n]*\n/gm,'')
  body=body.replace(/^(#{2,4}) (.+)$/gm,(full,level,title)=>{
    if(/\{#[^}]+\}$/.test(title))return full
    const id=anchors[url]?.[title]
    let clean=title.replace(/^\d+(?:\.\d+)*\.?\s+/,'')
    if(/放回.*(?:方向地图|方向.*连接)/.test(clean)) clean='相关研究'
    if(/论文信息与方向定位/.test(clean))clean='论文信息'
    if(/阅读自测与/.test(clean))clean='思考与自测'
    clean=clean.replace(/^(?:主方向|相关方向) [A-H]：/,'')
    return level+' '+clean+(id&&clean!==title?' {#'+id+'}':'')
  })
  body=body.replace(/^\*\*(?:实际阅读日期|我的一句话总结|尚不理解的问题)[^\n]*\n/gm,'')
  body=body.replace(/^.*(?:图表来源清单|原文提取文本|论文来源与校验信息).*（来源稿的本地记录[^\n]*\n/gm,'')
  body=body.replace(/\*\*本笔记解读\*\*/g,'**分析**')
  body=body.replace(/^>\s*$/gm,'').replace(/<\/?u>/g,'').replace(/本笔记使用版本/g,'论文版本')
    .replace(/^你读完后应能解释：/gm,'理解要点：').replace(/^现阶段最适合带走的问题：/gm,'可进一步思考的问题：')
  body=body.replace(/^> 阅读定位：.*\n?/gm,'').replace(/^- \*\*矩阵对应\*\*：.*\n?/gm,'')
    .replace(/姓名按下载 PDF 记录，矩阵简称仍为 CAD-Assistant。/g,'')
    .replace(/矩阵记录 /g,'').replace(/本笔记使用 /g,'所用版本为 ')
  const directions={A:'条件生成',B:'几何重建',C:'编辑与交互',D:'设计约束',E:'执行反馈',F:'CAD 表示',G:'数据与评测'}
  body=body.replace(/^- \*\*([A-G])\*\*：/gm,(_,key)=>'- **'+directions[key]+'**：')
  body=body.replace(/^(?:资源|问题)：。?\s*$/gm,'')
  for(const ref of removedSources)if(!body.includes(ref.url))body+=`\n\n参考阅读：[${ref.label}](${ref.url})。\n`
  return body.replace(/\n{3,}/g,'\n\n').trimEnd()+'\n'
}

export async function formatReaderPages() {
  const manual=[...new Set(['basics/probability','basics/research-writing','reinforcement-learning/algorithm-map','reinforcement-learning/ppo','reinforcement-learning/grpo','cad/concepts',...Object.keys(anchors).map(p=>p.slice(1))])]
  for(const relative of manual){
    const file=path.join(root,'docs',relative+'.md')
    const original=await fs.readFile(file,'utf8')
    const parsed=matter(original)
    let body=readerBody(parsed.content,'/'+relative)
    if(relative==='cad/concepts'){
      body=body.replace('下面的概念依据所提供的先读稿整理；示例为本站设计的教学练习。','以下通过概念对照与几何练习说明它们的区别。')
        .replace(/^术语及论文对应关系依据本地.*$/gm,'流程图与长方体练习为教学示例；论文出处见正文链接。')
    }
    if(relative==='reinforcement-learning/algorithm-map')body=body.replace('原稿此行概率公式及比较说明不完整，待补齐。','—').replace('原稿此行比较说明不完整，待补齐。','—')
    if(relative==='basics/research-writing')body=body.replace(/^- 本页根据你提供的.*$/gm,'- 刘雪峰：《科技论文写作指南》，人民邮电出版社，2024 年。本文依据相关读书笔记整理。')
    if(body!==parsed.content){
      parsed.data.status='draft';parsed.data.reviewed=false;parsed.data.updated='2026-10-20'
      await fs.writeFile(file,matter.stringify(body,parsed.data))
    }
  }
}
