---
id: cad-ref-sef20
title: SketchGraphs
category: cad
type: paper
tags:
  - 论文资料记录
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2007.08506'
  - 'https://arxiv.org/abs/2007.08506v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# SketchGraphs


## 论文信息

- **全名**：SketchGraphs: A Large-Scale Dataset for Modeling Relational Geometry in Computer-Aided Design
- **作者**：Ari Seff、Yaniv Ovadia、Wenda Zhou、Ryan P. Adams
- **论文时间**：2020-07-16（arXiv首次提交）

## 任务定位

研究任务：共用基础。

真实草图和几何关系数据是多任务基础资源。

## 方法与贡献

- 从真实CAD中收集二维草图及设计者施加的几何约束，并以图组织基元和关系。它使约束预测和草图生成能够使用真实关系监督。任务覆盖二维草图，不能替代完整三维构造历史数据。

## 技术要点

- **输入**：草图

- **表示**：约束图

- **对象**：草图

- **要求**：约束

## 相关研究

### R04 · 相关基础

[SketchGraphs](/cad/papers/sef20) → [Vitruvion](/cad/papers/sef21)

Vitruvion使用SketchGraphs数据和约束监督，并适配其基线进行比较；这条线记录数据基础。

原文位置：Sef21 §§4.1–4.2，PDF第7页。

### R06 · 相关基础

[SketchGraphs](/cad/papers/sef20) → [Design Alignment](/cad/papers/cas25)

Design Alignment的训练数据来自SketchGraphs。

原文位置：Cas25 §5.1，第6页。

## 关联资源与问题

资源：[SketchGraphs](/cad/datasets/ds_sketchgraphs)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2007.08506)
- [原始来源 2](https://arxiv.org/abs/2007.08506v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
