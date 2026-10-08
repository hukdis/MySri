import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import {fileURLToPath} from 'node:url'
import {papers} from './cad-guide.mjs'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const byId=new Map(papers.map(p=>[p.id,p]))
const link=p=>`[${p.name}](/cad/${p.slug})`
for(const paper of papers){
  const file=path.join(root,'docs/cad',paper.slug+'.md')
  const {data,content}=matter(await fs.readFile(file,'utf8'))
  let body=content.replace(/\r\n/g,'\n').replace(/\n<!-- v1\.1:start -->[\s\S]*?<!-- v1\.1:end -->\n/g,'\n')
  const summary=`\n<!-- v1.1:start -->\n<div class="edition-label">先读 · ${paper.name} · 速读入口</div>\n\n## 速读摘要\n\n| 要抓住的问题 | 本篇要点 |\n| --- | --- |\n| 研究问题 | ${paper.question} |\n| 输入 → 输出 | ${paper.input} → ${paper.output} |\n| 核心方法 | ${paper.method} |\n| 关键证据怎么读 | ${paper.evidence} |\n| 适用边界 | ${paper.limit} |\n\n**来源与范围**：摘要依据本页原有阅读稿中的方法、实验和局限整理。论文事实请对照 [原论文](${paper.source})；本次未独立核验实验。\n\n**前置阅读**：[CAD 术语与小练习](/cad/concepts) · [横向比较](/cad/#横向比较-输入、输出与表示)。\n\n## 方法示意\n\n<MermaidDiagram title="${paper.name} 方法流程" caption="本站依据阅读稿绘制的流程示意；省略实现细节，原论文图表另见来源。" code='${paper.diagram}' />\n\n## 接着读什么\n\n${paper.next.map(id=>link(byId.get(id))).join(' · ')}\n\n${paper.reason}\n\n::: tip 本篇阅读练习\n用自己的话写出输入、输出和反馈来源。${paper.evidence}分别记录一项可支持的结论和一项不能据此推出的结论。完成标准：说明任务设置，并留下原表位置。\n:::\n<!-- v1.1:end -->\n`
  body=body.replace(/^(# .+)\n/m,'$1\n'+summary)
  // 删除第一版遗漏的自动核验状态声明，保留论文证据与原稿中的推断标记。
  body=body.replace(/^- 本次由矩阵中的元数据认识.*AI 核查状态更新.*\n/gm,'')
  body=body.replace(/^- \*\*核查状态\*\*：已核对原论文全文及图表。.*\n/gm,'- **本站状态**：依据所提供的阅读稿整理，待人工复核；原稿中的资料核查标记不作为本站的独立核验结论。\n')
  body=body.replace(/^本笔记嵌入的.*11 张图表.*$/gm,'原阅读稿包含 11 张原论文裁切图表。本网页保留名称、说明与论文出处，原图保存在本地；新增流程示意为本站派生教学图。')
  body=body.replace(/^\*\*本笔记证据边界\*\*：核查了.*$/gm,'**本站证据边界**：本次依据所提供的阅读稿组织内容，未独立核验原论文、运行代码、复现实验或确认最新文献中的研究空白。')
  data.prerequisites=[...new Set([...(data.prerequisites??[]),'cad-0003'])]
  data.related=[...new Set([...(data.related??[]),...paper.next])]
  data.tags=[...new Set([...(data.tags??[]),paper.group==='representation'?'表示基础':paper.group==='generation'?'条件生成':paper.group==='reconstruction'?'几何重建':paper.group==='editing'?'指令编辑':'反馈与评测'])]
  data.sources=[...new Set([...data.sources,paper.source])]
  data.status='draft';data.reviewed=false;data.updated='2026-10-07'
  await fs.writeFile(file,matter.stringify(body,data))
}
await fs.writeFile(path.join(root,'catalog/v1.1-source-map.json'),JSON.stringify({version:'1.1',date:'2026-10-07',scope:'九篇先读稿的摘要、关系和派生方法示意；不修改原文件',mappings:papers.map(p=>({articleId:p.id,source:`sources/论文/先读/${p.name}.md`,original:p.source,derived:['速读摘要','方法示意','阅读关联'],reviewed:false}))},null,2)+'\n')
console.log('已为 9 篇 CAD 先读稿添加 1.1 速读摘要、派生流程与阅读关联。')
