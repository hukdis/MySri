import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const source='sources/强化学习算法知识地图.md'
const target='docs/reinforcement-learning/algorithm-map.md'
const {content}=matter((await fs.readFile(path.join(root,source),'utf8')).replace(/\r\n/g,'\n'))
let body=content.trim()
  .replace(/^# .+\n/, '# RL基础：从 Bellman 方程到 Actor–Critic\n\n::: info 来源稿整理 · 待人工复核\n正文依据你提供的《强化学习算法知识地图》整理，沿用课件第 2—10 章的内容与顺序。本次仅调整网页排版、显示记号和缺失来源提示，未新增教学例子或练习。原稿的缺失内容仍待补齐。\n:::\n')
  .replace(/\*\*([^*\n]+)[：:]\*\*/g,'**$1**：')
  .replaceAll('TD零步','TD(0)')
  .replace('> 导图中的“TD 零步”指 **TD(0)** 的零步自举记法，并非不观察环境转移。','> 原稿导图中的“TD 零步”在网页中显示为 **TD(0)**，便于与下文记号一致；原稿的“零步自举”措辞待人工核对。')
  .replace('[原始英文课件](../reinforce-learning/slidesForMyLectureVideos_2024.12.pdf)', '**原始英文课件**：Shiyu Zhao，`slidesForMyLectureVideos_2024.12.pdf`（当前 sources 中未提供，章节与公式归属待核对）')
body=body.replace(/```mermaid\n([\s\S]*?)```/g,(_,diagram)=>`<MermaidDiagram title="RL基础算法地图" caption="依据 source 原稿的思维导图显示；本页正文沿用原稿章节。" code='${diagram.trim().replace(/'/g,'&#39;')}' />`)
// 修复原稿缺失的显示公式结束标记；不改变公式内容。
body=body.replace('$$Q(s,a)\\leftarrow Q(s,a)+\\alpha\\,[G_t-Q(s,a)].$', '$$\nQ(s,a)\\leftarrow Q(s,a)+\\alpha\\,[G_t-Q(s,a)].\n$$')
body=body.replace(/^\| \*\*MC \$\\varepsilon\$-Greedy\*\*.*$/m, '| **MC $\\varepsilon$-Greedy** | 用持续的动作探索替代难以实现的探索性起点假设。 | 原稿此行概率公式及比较说明不完整，待补齐。 |')
const dpg='\\nabla_\\theta J\\propto\\mathbb E_{S\\sim d}\\bigl[\\nabla_\\theta\\mu_\\theta(S)\\,\\left.\\nabla_a q^{\\mu}(S,a)\\right\\vert_{a=\\mu_\\theta(S)}\\bigr]'
body=body.replace(/^\| \*\*DPG.*$/m, '| **DPG（确定性策略梯度）** | 连续动作下直接学习 $a=\\mu_\\theta(s)$；原稿公式整理为下方独立公式。 | 原稿此行比较说明不完整，待补齐。 |')
body=body.replace('## 十一、', `$$\n${dpg}\n$$\n\n> 排版说明：上式由原稿 DPG 行被表格分隔符拆开的公式拼接整理；公式正确性仍待对照课件人工核对。\n\n## 十一、`)
await fs.writeFile(path.join(root,target),matter.stringify(body+'\n',{
  id:'rl-0003',title:'RL基础',navTitle:'RL基础：课程知识地图',category:'reinforcement-learning',type:'concept',
  tags:['RL基础','课程笔记','算法地图'],prerequisites:[],related:[],sources:[source],
  status:'draft',reviewed:false,order:11,created:'2026-10-07',updated:'2026-10-08'
}))
await fs.writeFile(path.join(root,'catalog/rl-basics-source-map.json'),JSON.stringify({
  date:'2026-10-08',source,articleId:'rl-0003',target,
  removed:['docs/reinforcement-learning/introduction.md','docs/reinforcement-learning/mdp.md','非来源稿的 TD 手算练习及 CAD 阅读关联'],
  adjustments:['标题与栏目命名为 RL基础','网页公式与导图排版','原稿缺失公式和课件链接的提示'],
  future:'按用户后续选择整理 LLM Atlas 高阶算法，当前尚未引入',reviewed:false
},null,2)+'\n')
console.log('已按 sources 原稿生成 RL基础，保留文章 ID 与路径。')
