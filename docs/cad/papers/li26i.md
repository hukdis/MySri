---
id: cad-ref-li26i
title: BrepARG
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2601.16771'
  - 'https://arxiv.org/abs/2601.16771v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# BrepARG


## 论文信息

- **全名**：AutoRegressive Generation with B-rep Holistic Token Sequence Representation
- **作者**：Jiahao Li、Yunpeng Bai、Yongkang Dai、Hao Guo、Hongping Gan、Yilei Shi
- **论文时间**：2026-01-23（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

用统一几何拓扑词元生成新B-Rep。

## 方法与贡献

- 将B-Rep几何与拓扑编码成统一层次词元序列，以自回归Transformer生成边界模型。它探索整体序列建模而非完全解耦的几何拓扑流程。论文的首创表述是作者主张，本树不据此排除更早的相关表示。

## 技术要点

- **表示**：B-Rep

- **方法**：自回归

- **对象**：零件

- **要求**：几何 · 拓扑

## 关联资源与问题

问题：[I-F-03](/cad/issues/i-f-03)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2601.16771)
- [原始来源 2](https://arxiv.org/abs/2601.16771v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
