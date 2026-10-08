---
id: cad-0002
title: CAD 论文资料导航
category: cad
type: concept
tags:
  - 资料导航
  - 先读
  - 补读
prerequisites: []
related:
  - cad-0001
  - basic-0002
sources:
  - sources/论文/00_阅读导航.md
status: draft
reviewed: false
order: 12
created: '2026-10-07'
updated: '2026-10-07'
---
# CAD 论文资料导航

> **一句话**：沿用现有阅读材料的优先级，将 19 篇论文按“名称、原始来源、阅读问题”组织起来。

> **怎么用**：先阅读本站的 9 篇先读草稿，再按问题选择补读。以下清单沿用材料的阅读优先级，不代表已确定你的 CAD 研究方向。

::: info 导航草稿 · 待人工复核
按照你的选择，已接入“先读”的 9 篇正文，10 篇补读仅保留导航。原始 PDF 和图表保留在本地。来源链接提取自现有阅读稿，本次未逐篇核验论文。
:::

## 一、先读材料

1.1 新增 [按问题组织的 CAD 总览](/cad/)、[术语与小练习](/cad/concepts)。下面保留原材料的优先级；每篇先读稿可先看速读摘要和方法示意，再进入实验与局限。

| 论文 | 原始来源 | 优先理解的问题 |
| --- | --- | --- |
| [DeepCAD](/cad/deepcad) | [arXiv](https://arxiv.org/abs/2105.09492) · [DOI](https://doi.org/10.1109/ICCV48922.2021.00670) | CAD 操作怎样编码为序列？ |
| [Text2CAD](/cad/text2cad) | [arXiv](https://arxiv.org/abs/2409.17106) · [DOI](https://doi.org/10.52202/079017-0242) | 文本标注与生成网络分别做什么？ |
| [CAD-Llama](/cad/cad-llama) | [arXiv](https://arxiv.org/abs/2505.04481) · [DOI](https://doi.org/10.1109/CVPR52734.2025.01730) | SPCC 怎样连接部件语义和参数代码？ |
| [CAD-Recode](/cad/cad-recode) | [arXiv](https://arxiv.org/abs/2412.14042) · [DOI](https://doi.org/10.1109/ICCV51701.2025.00914) | 点云怎样变成可执行代码？ |
| [CAD-MLLM](/cad/cad-mllm) | [arXiv](https://arxiv.org/abs/2411.04954) | 如何统一文本、图像与点云条件？ |
| [CADReview](/cad/cadreview) | [arXiv](https://arxiv.org/abs/2505.22304) | 如何检测错误并给出修正？ |
| [CADTests](/cad/cadtests) | [arXiv](https://arxiv.org/abs/2605.07807) | 用户要求怎样成为可执行测试？ |
| [CAD-Editor](/cad/cad-editor) | [arXiv](https://arxiv.org/abs/2502.03997) | 怎样定位需要修改的序列部分？ |
| [CAD-Assistant](/cad/cad-assistant) | [arXiv](https://arxiv.org/abs/2412.13810) · [DOI](https://doi.org/10.1109/ICCV51701.2025.00684) | 工具代理怎样执行、观察和调整？ |

## 二、补读材料

| 论文 | 原始来源 | 优先理解的问题 |
| --- | --- | --- |
| SketchGraphs | [arXiv](https://arxiv.org/abs/2007.08506v1) | 草图位置与显式约束有什么不同？ |
| CAD-GPT | [arXiv](https://arxiv.org/abs/2412.19663v2) · [DOI](https://doi.org/10.1609/aaai.v39i8.32849) | 专用空间 token 怎样帮助参数预测？ |
| CADmium | [arXiv](https://arxiv.org/abs/2507.09792v3) · [论文页面](https://openreview.net/forum?id=lExqWvQht8) | 数据描述风格怎样影响生成和评测？ |
| LLM4CAD-Editor | [arXiv](https://arxiv.org/abs/2606.20607v1) | 不同抽象层级的编辑意图怎样处理？ |
| IterCAD：正投影修复 | [arXiv](https://arxiv.org/abs/2608.24020v2) | 怎样学习 REVISE/STOP 策略？ |
| CIT-CAD | [arXiv](https://arxiv.org/abs/2609.07434v2) | 意图树怎样指导验证与局部修复？ |
| BenchCAD | [arXiv](https://arxiv.org/abs/2605.10865v2) | 怎样拆分工业 CAD 能力并测族外泛化？ |
| HistCAD | [arXiv](https://arxiv.org/abs/2602.19171v2) | 历史中的约束在尺寸编辑后是否保持？ |
| IterCAD：多模态代理 | [arXiv](https://arxiv.org/abs/2606.13368v2) | 训练代理怎样利用外部沙箱反馈？ |
| Pointer-CAD | [arXiv](https://arxiv.org/abs/2603.04337v1) | 如何在当前 B-rep 中选择面和边？ |

## 三、阅读与证据

1. 确认论文版本，再记录任务、输入输出、表示和反馈来源。
2. 将论文中的主张、图表支持的结论和自己的推断分别记录。
3. 指标比较需要同时核对评价子集、分母、缩放和有效样本比例。
4. 两篇 IterCAD 在导航中保留不同名称，避免合并引用。

## 四、接着阅读

- [论文解读模板](/cad/paper-reading)：记录研究问题、方法、证据与疑问。
- [研究与写作笔记](/basics/research-writing)：从问题和洞见组织阅读。

## 参考来源与范围

依据本地 `sources/论文/00_阅读导航.md` 及“先读”“补读”目录中的 19 篇阅读稿整理。未将原 PDF、图表或个人笔记复制到发布目录；原导航指向旧电脑的路径已从网页入口移除。
