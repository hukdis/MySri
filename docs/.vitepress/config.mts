import { defineConfig } from 'vitepress'
import catalog from '../../catalog/content-index.json'
import research from '../../catalog/cad-research.json'
const sections = [ ['basics', '基础知识'], ['reinforcement-learning', '强化学习'], ['cad', 'CAD'] ]
const base = process.env.VITEPRESS_BASE || '/'
export default defineConfig({
  base,
  lang: 'zh-CN', title: '学习图谱', description: '基础知识、强化学习与 CAD 论文阅读笔记',
  head: [['link', { rel: 'icon', href: `${base}favicon.svg` }]],
  markdown: { math: true },
  themeConfig: {
    nav: [{text:'速览',link:'/'},...sections.map(([key,text])=>({text,link:`/${key}/`})),{text:'文章索引',link:'/library'}],
    sidebar: [
      {text:'开始学习',items:[{text:'学习地图',link:'/'},{text:'文章索引',link:'/library'}]},
      ...sections.map(([key,title])=>({ text:title, collapsed:false, items:key==='cad'?
        [{text:'第二版 · 研究发展树',link:'/cad/'},
          {text:'四任务主线',collapsed:false,items:[{text:'CAD 生成',link:'/cad/tasks/generation'},{text:'CAD 重建',link:'/cad/tasks/reconstruction'},{text:'CAD 编辑',link:'/cad/tasks/editing'},{text:'理解、评估与规划',link:'/cad/tasks/analysis'}]},
          {text:'资料与问题',collapsed:false,items:[{text:'CAD 基础',link:'/cad/foundations'},{text:'论文资料库',link:'/cad/reading-navigation'},{text:'数据与评测资源',link:'/cad/resources'},{text:'发展关系',link:'/cad/relationships'},{text:'具体问题与待验证方法',link:'/cad/issues'}]},
          {text:'九篇论文详读',collapsed:true,items:research.papers.filter(p=>p.hasReading).map(p=>({text:p.short,link:p.urlLocal}))}]:
        key==='reinforcement-learning'?
        [{text:'栏目总览',link:`/${key}/`},
          {text:'RL基础',collapsed:false,items:catalog.filter(p=>p.category===key&&p.id==='rl-0003').map(p=>({text:p.navTitle??p.title,link:p.url}))},
          {text:'高阶算法 · PPO / GRPO',collapsed:false,items:catalog.filter(p=>p.category===key&&p.id!=='rl-0003').map(p=>({text:p.navTitle??p.title,link:p.url}))}]:
        [{text:'栏目总览',link:`/${key}/`},...catalog.filter(p=>p.category===key&&!p.id.startsWith('basic-practice-')).map(p=>({text:p.navTitle??p.title,link:p.url})),
          {text:'技术实践',collapsed:false,items:catalog.filter(p=>p.id.startsWith('basic-practice-')).map(p=>({text:p.navTitle??p.title,link:p.url.endsWith('/practice/index')?'/basics/practice/':p.url}))}] }))
    ],
    search: { provider:'local', options:{locales:{root:{translations:{button:{buttonText:'搜索笔记',buttonAriaLabel:'搜索笔记'},modal:{noResultsText:'没有找到相关笔记',resetButtonTitle:'清空',footer:{selectText:'选择',navigateText:'切换',closeText:'关闭'}}}}}} },
    outline: {level:[2,3],label:'本页目录'},
    darkModeSwitchTitle:'切换到深色主题',lightModeSwitchTitle:'切换到浅色主题',
    docFooter:{prev:'上一篇',next:'下一篇'}, sidebarMenuLabel:'文章目录', returnToTopLabel:'回到顶部', darkModeSwitchLabel:'切换主题',
    footer:{message:'基础知识 · 强化学习 · CAD',copyright:'学习图谱 · 基础、算法与研究'}
  }
})
