import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import {fileURLToPath} from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = file => fs.readFile(path.join(root, file), 'utf8')
const write = (file, body) => fs.writeFile(path.join(root, file), body)
const mappings = []
async function article(source, target, metadata, transform = body => body) {
  const {content} = matter((await read(source)).replace(/\r\n/g, '\n'))
  const data = { ...metadata, sources: [source], status: 'draft', reviewed: false, created: '2026-10-07', updated: '2026-10-07' }
  const contentWithNotice = transform(content.trim()).replace(/\*\*([^*\n]+)[：:]\*\*/g, '**$1**：').replace(/^(# .+)\n/, '$1\n\n::: info 整理草稿 · 待人工复核\n依据你提供的材料整理；保留来源说明。网页排版检查不代表学术正确性已验证。\n:::\n')
  await write(target, matter.stringify(contentWithNotice + '\n', data))
  mappings.push({source, articleId: data.id, target})
}

await article('sources/科技论文.md', 'docs/basics/research-writing.md', {
  id:'basic-0002', title:'从找方向到讲清楚研究', category:'basics', type:'concept',
  tags:['论文阅读','研究方法','学术写作'], prerequisites:[], related:[], order:10
}, body => body + '\n\n## 参考来源与范围\n\n- 本页根据你提供的《科技论文》笔记整理，笔记标注来源为刘雪峰《科技论文写作指南》（人民邮电出版社，2024 年）。本次未获得该书原文，书中例子及观点归属仍需人工核对。\n- 文中的研究建议是阅读笔记的概括，不作为普遍成立的实验结论。\n')

await import('./import-rl-basics.mjs')
mappings.push({source:'sources/强化学习算法知识地图.md',articleId:'rl-0003',target:'docs/reinforcement-learning/algorithm-map.md'})

const papers = ['DeepCAD','Text2CAD','CAD-Llama','CAD-Recode','CAD-MLLM','CADReview','CADTests','CAD-Editor','CAD-Assistant']
for (const [index, name] of papers.entries()) {
  const source = `sources/论文/先读/${name}.md`
  const original = await read(source)
  const title = original.match(/^# (.+)/m)[1].trim()
  const primary = original.match(/https:\/\/arxiv\.org\/abs\/[\w.]+/)?.[0]
  if (!primary) throw new Error(`缺少论文来源: ${name}`)
  await article(source, `docs/cad/${name.toLowerCase()}.md`, {
    id:`cad-01${String(index+1).padStart(2,'0')}`,title,navTitle:name,category:'cad',type:'paper',
    tags:['先读','论文阅读'],prerequisites:index?['cad-0101']:[],related:['cad-0002'],order:20+index
  }, body => {
    body = body.replace(/^> 阅读状态：.*$/m, '> 阅读状态：依据你提供的阅读稿整理，待人工复核；你的阅读和复现状态尚未记录。')
    body = body.replace(/!\[([^\]]+)\]\([A-Za-z]:\/[^)]+\)/g, (_, caption) => `> **图表定位：${caption}** · [到原论文查看](${primary})。原图保留在本地材料中。`)
    body = body.replace(/\[([^\]]+)\]\([A-Za-z]:\/[^)]+\)/g, (_, label) => label.includes('PDF') ? `[${label.replace('本地', '')}](${primary})` : `${label}（保留在本地 sources）`)
    body = body.replace(/^嵌入图表均.*$/gm, '本网页保留原图表的名称、正文说明与论文出处；原始裁切图和 PDF 保存在本地 sources，未复制到发布目录。')
    body = body.replace(/^核查范围是本版本原文；.*$/gm, '本次完成阅读稿的网页整理，未独立核验原论文结论、运行代码或复现实验。文中数值与版本信息来自所提供的阅读稿，仍需对照原论文人工复核。')
    body = body.replace(/^本笔记依据下列本地原论文及补充材料整理。/gm, '原阅读稿标注依据以下原论文及补充材料整理。')
    return body + `\n\n## 本站阅读来源\n\n本页来自你提供的 \`sources/论文/先读/${name}.md\`。正文的论文主张、解读与推断沿用原稿标记，本次只整理排版、来源入口和阅读状态。\n\n[返回 CAD 资料导航](/cad/reading-navigation)\n`
  })
}

const navigation = await read('sources/论文/00_阅读导航.md')
const groups = [{title:'一、先读材料', folder:'先读'}, {title:'二、补读材料', folder:'补读'}]
let body = '# CAD 论文资料导航\n\n> **一句话**：沿用现有阅读材料的优先级，将 19 篇论文按“名称、原始来源、阅读问题”组织起来。\n\n> **怎么用**：先阅读本站的 9 篇先读草稿，再按问题选择补读。以下清单沿用材料的阅读优先级，不代表已确定你的 CAD 研究方向。\n\n::: info 导航草稿 · 待人工复核\n按照你的选择，已接入“先读”的 9 篇正文，10 篇补读仅保留导航。原始 PDF 和图表保留在本地。来源链接提取自现有阅读稿，本次未逐篇核验论文。\n:::\n'
for (const group of groups) {
  body += `\n## ${group.title}\n\n| 论文 | 原始来源 | 优先理解的问题 |\n| --- | --- | --- |\n`
  const lines = navigation.split(/\r?\n/).filter(line => line.includes(`/论文/${group.folder}/`) && line.startsWith('|'))
  for (const line of lines) {
    const cells = line.split('|')
    const match = cells[2].match(/\[([^\]]+)\]\([^)]*\/([^/]+\.md)\)/)
    if (!match) throw new Error('无法识别导航行: ' + line)
    const [ , name, filename ] = match
    const source = `sources/论文/${group.folder}/${filename}`
    const text = await read(source)
    const links = [...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)]
      .filter(item => /arxiv\.org\/abs|doi\.org|openaccess\.thecvf|openreview\.net/.test(item[2]))
    const unique = [...new Map(links.map(item => [item[2], item])).values()].slice(0,2)
    const displayName = group.folder === '先读' ? `[${name}](/cad/${filename.replace('.md','').toLowerCase()})` : name
    body += `| ${displayName} | ${unique.map(item => `[${item[2].includes('arxiv')?'arXiv':item[2].includes('doi')?'DOI':'论文页面'}](${item[2]})`).join(' · ') || '原材料未提供公开链接'} | ${cells[5].trim()} |\n`
    mappings.push({source, articleId:'cad-0002', target:'docs/cad/reading-navigation.md', relationship:'navigation-only'})
  }
}
body += '\n## 三、阅读与证据\n\n1. 确认论文版本，再记录任务、输入输出、表示和反馈来源。\n2. 将论文中的主张、图表支持的结论和自己的推断分别记录。\n3. 指标比较需要同时核对评价子集、分母、缩放和有效样本比例。\n4. 两篇 IterCAD 在导航中保留不同名称，避免合并引用。\n\n## 四、接着阅读\n\n- [论文解读模板](/cad/paper-reading)：记录研究问题、方法、证据与疑问。\n- [研究与写作笔记](/basics/research-writing)：从问题和洞见组织阅读。\n\n## 参考来源与范围\n\n依据本地 `sources/论文/00_阅读导航.md` 及“先读”“补读”目录中的 19 篇阅读稿整理。未将原 PDF、图表或个人笔记复制到发布目录；原导航指向旧电脑的路径已从网页入口移除。\n'
await write('docs/cad/reading-navigation.md', matter.stringify(body, {
  id:'cad-0002',title:'CAD 论文资料导航',category:'cad',type:'concept',tags:['资料导航','先读','补读'],
  prerequisites:[],related:['cad-0001','basic-0002'],sources:['sources/论文/00_阅读导航.md'],
  status:'draft',reviewed:false,order:12,created:'2026-10-07',updated:'2026-10-07'
}))
mappings.push({source:'sources/论文/00_阅读导航.md',articleId:'cad-0002',target:'docs/cad/reading-navigation.md'})
await write('catalog/first-edition-source-map.json', JSON.stringify({date:'2026-10-07',mappings,issues:[
  '原导航中的 Windows 绝对路径不适合作为网页链接，已改用稿件中记录的原始论文链接。',
  '强化学习课件与原分类图未在 sources 中找到，已标记来源缺失。',
  'DPG 公式的表格分隔符已恢复为独立公式，未宣称核验原课件。',
  '书籍原文未提供，写作材料保留笔记中的来源归属，待人工核对。'
]},null,2)+'\n')
console.log('已整理两篇笔记、9 篇 CAD 先读草稿与 19 篇资料导航；原文件未修改。')
