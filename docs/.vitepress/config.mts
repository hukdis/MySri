import { defineConfig } from 'vitepress'
import catalog from '../../catalog/content-index.json'
import { groups, papers } from '../../scripts/cad-guide.mjs'
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
      {text:'开始学习',items:[{text:'学习地图',link:'/'},{text:'文章索引',link:'/library'},{text:'资料整理指南',link:'/guide'}]},
      ...sections.map(([key,title])=>({ text:title, collapsed:false, items:key==='cad'?
        [{text:'从表示到验证',link:'/cad/'},{text:'术语与小练习',link:'/cad/concepts'},
          ...groups.map(group=>({text:group.title,collapsed:false,items:papers.filter(p=>p.group===group.key).map(p=>({text:p.name,link:`/cad/${p.slug}`}))})),
          {text:'资料与模板',collapsed:true,items:[{text:'19 篇资料导航',link:'/cad/reading-navigation'},{text:'论文解读模板',link:'/cad/paper-reading'}]}]:
        key==='reinforcement-learning'?
        [{text:'栏目总览',link:`/${key}/`},
          {text:'RL基础',collapsed:false,items:catalog.filter(p=>p.category===key&&p.id==='rl-0003').map(p=>({text:p.navTitle??p.title,link:p.url}))},
          {text:'高阶算法 · PPO / GRPO',collapsed:false,items:catalog.filter(p=>p.category===key&&p.id!=='rl-0003').map(p=>({text:p.navTitle??p.title,link:p.url}))}]:
        [{text:'栏目总览',link:`/${key}/`},...catalog.filter(p=>p.category===key).map(p=>({text:p.navTitle??p.title,link:p.url}))] }))
    ],
    search: { provider:'local', options:{locales:{root:{translations:{button:{buttonText:'搜索笔记',buttonAriaLabel:'搜索笔记'},modal:{noResultsText:'没有找到相关笔记',resetButtonTitle:'清空',footer:{selectText:'选择',navigateText:'切换',closeText:'关闭'}}}}}} },
    outline: {level:[2,3],label:'本页目录'},
    darkModeSwitchTitle:'切换到深色主题',lightModeSwitchTitle:'切换到浅色主题',
    docFooter:{prev:'上一篇',next:'下一篇'}, sidebarMenuLabel:'文章目录', returnToTopLabel:'回到顶部', darkModeSwitchLabel:'切换主题',
    footer:{message:'基础知识 · 强化学习 · CAD',copyright:'学习图谱 1.1 · 内容待人工复核'}
  }
})
