---
id: cad-ref-liu26b
title: CADIR
category: cad
type: paper
tags:
  - 论文资料记录
  - 程序变换
  - 检索增强
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2608.00891'
  - 'https://arxiv.org/abs/2608.00891v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADIR


## 论文信息

- **全名**：CADIR: A Cross-Backend Editable Intermediate Representation for Agentic CAD Generation
- **作者**：Yu Liu、Jingzhe Ni、Yiming Chen、Junqi Huang、Ruofeng Tong、Min Tang、Peng Du
- **论文时间**：2026-08-01（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

跨后端恢复原生可编辑历史作为主阅读入口；中间表示同时支持生成、编辑与检索，非互斥能力声明。

其他任务：[CAD生成](/cad/tasks/generation) · [CAD编辑](/cad/tasks/editing) · [CAD理解、评估与规划](/cad/tasks/analysis)

## 方法与贡献

- 用可执行中间表示记录构造图、参数依赖、约束和实体选择，并通过几何签名建立跨后端对应。它支持重建原生可编辑历史及整图或子图检索。跨后端可靠性和支持操作有范围，不能假定任何软件与任意拓扑变化都能无损迁移。

## 技术要点

- **输入**：CAD · CAD程序

- **表示**：中间表示 · B-Rep

- **方法**：程序变换 · 检索增强

- **对象**：零件

- **要求**：构造历史 · 可编辑性 · 实体引用

## 关联资源与问题

问题：[I-C-01](/cad/issues/i-c-01) · [I-F-01](/cad/issues/i-f-01) · [I-G-03](/cad/issues/i-g-03)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2608.00891)
- [原始来源 2](https://arxiv.org/abs/2608.00891v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
