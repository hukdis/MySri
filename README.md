# 学习图谱 · 1.1

VitePress 文档网站，包含基础知识、强化学习、CAD 三个栏目。接入研究写作笔记、source 中的 RL基础课程文档、PPO 与 GRPO 高阶算法和 9 篇 CAD 先读稿；10 篇补读仅保留在资料导航中。内容均待人工复核。

## 启动

安装 Node.js 与 pnpm 后：

```sh
pnpm install
pnpm dev
```

打开 http://127.0.0.1:5173 。`pnpm build` 构建到 `docs/.vitepress/dist`；`pnpm preview` 查看构建版本。

## 整理资料

将原文件放入 sources，执行 `pnpm scan`。结果为 catalog/source-report.json；状态包括新增、变化、未变、缺失。扫描基线每次刷新，只代表检测变化，不代表已整理。source-manifest.json 的 articleIds 可记录来源关联；待处理文件请结合空 articleIds 和报告识别。第一版没有接入模型 API、PDF/Word 提取或自动合并。

复制 templates 新增文章，执行 `pnpm index` 自动生成栏目、导航数据和索引。使用 prompts/organize.md 指导大模型整理资料。个人笔记放 notes，用文章 ID 关联。原始资料和个人笔记默认被 Git 忽略，请另行备份。

GitHub 仓库：`hukdis/MySri`。网站通过 GitHub Actions 部署到 https://hukdis.github.io/MySri/，推送 main 后自动更新。

本地默认路径为 `/`；发布构建通过 `VITEPRESS_BASE=/MySri/` 指定仓库子路径。sources 原始资料、notes 个人笔记、artifacts 本地检查产物不上传。

## 本次整理记录

来源映射与待核对问题记录在 `catalog/first-edition-source-map.json`。原 PDF、原图表和个人笔记保留在本地，没有复制到发布目录。CAD 页面保留图表名称、说明及公开论文入口。

`node scripts/prepare-first-edition.mjs` 可从本次 sources 重新生成相应草稿，**会覆盖这些生成稿的正文**；手工编辑后不要直接重跑。常规阅读和维护只需使用 `pnpm dev`、`pnpm build`。

`artifacts/verification.json` 记录网站功能检查；它不代表学术内容已经验证。

## 1.1 更新

CAD 总览按表示、生成、重建、编辑、反馈与评测组织阅读路线，比较输入输出、表示、模型作用和反馈来源。九篇先读稿增加速读摘要、本站绘制的方法示意及相关阅读；新增 CAD 术语和教学练习。导图支持放大查看与缩放，手机表格支持横向滚动。

1.1 的阅读组织与摘要数据位于 `scripts/cad-guide.mjs`，栏目总览仍由索引脚本生成。`scripts/upgrade-v1.1.mjs` 更新带标记的摘要区域并保留原正文；重新运行会替换该区域，编辑后应先检查。来源关联记录在 `catalog/v1.1-source-map.json`。

## RL基础内容约定 · 2026-10-08

RL基础仅依据 `sources/强化学习算法知识地图.md` 整理；自行生成的“强化学习的基本问题”“MDP 与价值函数”及 TD 手算练习已删除。文章保留 ID `rl-0003` 和原路径。`node scripts/import-rl-basics.mjs` 从原稿重新整理网页，来源映射记录在 `catalog/rl-basics-source-map.json`。

按用户选择，从 [LLM Atlas 的 RLHF 系列](https://zhoujx4.github.io/llm-atlas/rlhf/)接入 PPO（rl-0004）与 GRPO（rl-0005）两篇高阶算法草稿。栏目显示为强化学习，RL基础课程稿保留原名称与路径；新增文章区分原论文定义、公式推导与本站教学示例。
