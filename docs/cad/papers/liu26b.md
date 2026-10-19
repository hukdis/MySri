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
updated: '2026-10-19'
cadRecord: true
---
# CADIR

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Liu26b · 2026-08-01 · 方法研究

## 论文信息

- **全名**：CADIR: A Cross-Backend Editable Intermediate Representation for Agentic CAD Generation
- **作者**：Yu Liu、Jingzhe Ni、Yiming Chen、Junqi Huang、Ruofeng Tong、Min Tang、Peng Du
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

跨后端恢复原生可编辑历史作为主阅读入口；中间表示同时支持生成、编辑与检索，非互斥能力声明。

其他任务：[CAD生成](/cad/tasks/generation) · [CAD编辑](/cad/tasks/editing) · [CAD理解、评估与规划](/cad/tasks/analysis)

## 贡献简介

- 用可执行中间表示记录构造图、参数依赖、约束和实体选择，并通过几何签名建立跨后端对应。它支持重建原生可编辑历史及整图或子图检索。跨后端可靠性和支持操作有范围，不能假定任何软件与任意拓扑变化都能无损迁移。

## 独立标签

- **输入**：CAD · CAD程序

- **表示**：中间表示 · B-Rep

- **方法**：程序变换 · 检索增强

- **对象**：零件

- **要求**：构造历史 · 可编辑性 · 实体引用

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-C-01](/cad/issues/i-c-01) · [I-F-01](/cad/issues/i-f-01) · [I-G-03](/cad/issues/i-g-03)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2608.00891)
- [原始来源 2](https://arxiv.org/abs/2608.00891v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
