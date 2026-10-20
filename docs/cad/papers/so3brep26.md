---
id: cad-ref-so3brep26
title: SO3brep
category: cad
type: paper
tags:
  - 论文资料记录
  - 图网络
  - 等变学习
prerequisites: []
related: []
sources:
  - 'https://neurips.cc/virtual/2026/poster/148985'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# SO3brep


## 论文信息

- **全名**：SO(3)-Equivariant Learning on CAD Boundary Representations
- **作者**：Matteo Ballegeer、Dries Benoit
- **论文时间**：2026（官方会议年份；首次公开日期未核实，不参与精确月份先后判断）
- **正式发表记录**：2026；NeurIPS 2026

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

旋转等变表示的主要任务是分类与面分割。

## 方法与贡献

- 在面间共享参考系中组织标量、向量和张量特征，并进行旋转等变消息传递。它兼顾旋转变化与面间方向关系来学习B-Rep表征。论文任务是分类和面分割，不是LLM生成或编辑。

## 技术要点

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：图网络 · 等变学习

- **对象**：零件

- **要求**：识别 · 分割

## 关联资源与问题

问题：[I-F-02](/cad/issues/i-f-02)。

## 参考文献

- [原始来源 1](https://neurips.cc/virtual/2026/poster/148985)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
