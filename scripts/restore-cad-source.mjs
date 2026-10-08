import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import matter from 'gray-matter'
import { fileURLToPath } from 'node:url'
import { papers } from './cad-guide.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mappings = []
const escape = text => String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')
for (const paper of papers) {
  const source = 'sources/论文/先读/' + paper.name + '.md'
  const target = 'docs/cad/' + paper.slug + '.md'
  const assets = path.join(root, 'sources/论文/assets', paper.name)
  const { data } = matter(await fs.readFile(path.join(root,target),'utf8'))
  let body = (await fs.readFile(path.join(root,source),'utf8')).replace(/\r\n/g,'\n')
  // Keep source numbering so references to its sections remain valid.
  body = body.replace(/^## 2\. (?:首次阅读顺序|第一次怎么读？)[\s\S]*?(?=^## )/m,'')
    .replace(/^> 建议首次阅读：.*\n/gm,'')
    .replace(/^> 阅读状态：.*$/m,'> 阅读状态：依据所提供的 source 阅读稿整理，待人工复核。')
    .replace(/^- \*\*核查状态\*\*：.*$/gm,'- **本站状态**：原稿的核查记录不代表本站独立验证；内容待人工复核。')
    .replace(/^本笔记依据下列本地原论文及补充材料整理。/gm,'原阅读稿标注依据以下原论文及补充材料整理。')
    .replace(/^核查范围是本版本原文；.*$/gm,'本次恢复来源稿的正文结构与原论文截图，未独立核验论文结论、运行代码或复现实验。')
    .replace(/^\*\*本笔记证据边界\*\*：核查了.*$/gm,'**本站证据边界**：沿用来源稿的事实、解释与推断标记；论文结论及实验仍待人工核对。')
  const figureData = JSON.parse(await fs.readFile(path.join(assets,'figure_sources.json'),'utf8'))
  const figures = figureData.assets || figureData.figures
  const figureByFile = new Map(figures.map(item=>[item.file,item]))
  const imageEntries = [...body.matchAll(/!\[([^\]]+)\]\(([^)]+)\)/g)]
  body = body.replace(/本笔记嵌入的 \*\*\d+ 张图表/g, '本页嵌入的 **' + imageEntries.length + ' 张图表')
  const destination = path.join(root,'docs/public/papers',paper.slug)
  await fs.mkdir(destination,{recursive:true})
  for (const [full,title,originalPath] of imageEntries) {
    const filename = originalPath.split(/[\\/]/).at(-1)
    const original = path.join(assets,filename)
    const imageBytes = await fs.readFile(original)
    const info = figureByFile.get(filename)
    if (!info) throw new Error('缺少截图来源记录: ' + original)
    await fs.writeFile(path.join(destination,filename),imageBytes)
    const url = '/papers/' + paper.slug + '/' + filename
    body = body.replace(full, '<PaperFigure src="' + url + '" title="' + escape(title) + '" source="' + paper.source + '" :page="' + info.pdf_page + '" />')
    mappings.push({ articleId:paper.id,source,originalImage:path.relative(root,original).split(path.sep).join('/'),publishedImage:'docs/public'+url,title,pdfPage:info.pdf_page,originalPaper:paper.source,sha256:crypto.createHash('sha256').update(imageBytes).digest('hex') })
  }
  body = body.replace(/\[([^\]]+)\]\(([A-Za-z]:\/[^)]+)\)/g, (_,title,localPath)=> {
    if (!/\.pdf$/i.test(localPath)) return title + '（来源稿的本地记录，未发布）'
    const url = paper.source.replace('arxiv.org/abs/','arxiv.org/pdf/')
    return '[' + title.replace('本地','') + '](' + url + ')'
  })
  body = body.replace(/^- 本次由矩阵中的元数据认识.*AI 核查状态更新.*\n/gm,'')
  body = body.replace(/^(# .+)\n/m,'$1\n\n::: info 来源稿整理 · 待人工复核\n按你提供的 source 阅读稿保留章节与图表位置，去除首次阅读安排；原章节编号保留，截图可点击放大。原 PDF 与个人笔记不发布。\n:::\n')
  body += '\n\n## 本站阅读来源\n\n正文来自 '+source+'；图表从同一论文的原 PDF 裁切图恢复，保留原图注。截图映射和页码记录在 catalog/cad-figure-source-map.json，原始资料保持不变。\n\n[返回 CAD 总览](/cad/)\n'
  data.status='draft'; data.reviewed=false; data.updated='2026-10-08'
  data.sources=[...new Set([...(data.sources||[]),source,paper.source])]
  await fs.writeFile(path.join(root,target),matter.stringify(body.trimEnd()+'\n',data))
}
await fs.writeFile(path.join(root,'catalog/cad-figure-source-map.json'),JSON.stringify({date:'2026-10-08',authorization:'用户明确要求将 source 中的论文截图加入网站',scope:'仅发布九篇已接入论文正文引用的截图；不发布原 PDF 或个人笔记',mappings,reviewed:false},null,2)+'\n')
console.log('已恢复 9 篇 CAD 来源稿结构与 '+mappings.length+' 张原论文截图。')
