---
id: cad-ref-jay22
title: SolidGen
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2203.13944'
  - 'https://arxiv.org/abs/2203.13944v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# SolidGen


## 论文信息

- **全名**：SolidGen: An Autoregressive Model for Direct B-rep Synthesis
- **作者**：Pradeep Kumar Jayaraman、Joseph G. Lambourne、Nishkrit Desai、Karl D. D. Willis、Aditya Sanghi、Nigel J. W. Morris
- **论文时间**：2022-03-26（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

直接生成B-Rep几何与拓扑。

## 方法与贡献

- 建立索引化B-Rep表示，用自回归模型逐步预测顶点、边和面，直接合成边界模型。相较依赖草图拉伸历史的生成方法，它可以不以历史序列为监督。直接生成几何拓扑与恢复参数化特征历史仍需分开评价。

## 技术要点

- **表示**：B-Rep

- **方法**：自回归

- **对象**：零件

- **要求**：几何 · 拓扑

## 相关研究

### R21 · 学习归类

[SolidGen](/cad/papers/jay22) → [BrepGen](/cad/papers/xu24b)

直接B-Rep生成中自回归与扩散的代表分支；没有核实直接继承，按方法范式并列。

原文位置：Jay22、Xu24b摘要。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2203.13944)
- [原始来源 2](https://arxiv.org/abs/2203.13944v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
