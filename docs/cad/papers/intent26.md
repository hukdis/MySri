---
id: cad-ref-intent26
title: Intent2CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://neurips.cc/virtual/2026/poster/155244'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Intent2CAD


## 论文信息

- **全名**：Intent2CAD: How Semantic-Parametric Supervision Shapes Text-to-CAD Generation
- **作者**：Jinbo Yang、Shikai Jing、Mingyue Yuan
- **论文时间**：2026（官方会议年份；首次公开日期未核实，不参与精确月份先后判断）
- **正式发表记录**：2026；NeurIPS 2026

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

研究语义参数监督对文本生成的影响，编辑为对应次任务。

其他任务：[CAD编辑](/cad/tasks/editing)

## 方法与贡献

- 保守地将低层构造记录提升为语义特征、可复用参数和轻量关系，研究监督表示对生成及后续编辑的影响。它建立生成与意图保持编辑数据，并在控制训练条件下比较语义提升和参数提升。官方已列为NeurIPS2026条目，首次公开日期尚未核实，不能把未来会期当成首次发表日。

## 技术要点

- **输入**：文本 · 已有CAD

- **表示**：DSL

- **方法**：监督学习

- **对象**：零件

- **要求**：可编辑性 · 约束

## 参考文献

- [原始来源 1](https://neurips.cc/virtual/2026/poster/155244)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
