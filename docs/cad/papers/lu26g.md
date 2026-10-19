---
id: cad-ref-lu26g
title: CADForge
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 约束求解
  - 执行反馈
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2610.04262'
  - 'https://arxiv.org/abs/2610.04262v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADForge

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Lu26g · 2026-10-03 · 方法研究

## 论文信息

- **全名**：CADForge: Agentic Single-View CAD Reconstruction with Explicit Geometry Reasoning
- **作者**：Keyang Lu、Zhifei Yang、Tianao Dong、Mingzhe Xing、Zhen Xiao、Yikai Wang
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

单图目标逐组件重建，记忆及求解器是过程机制。



## 贡献简介

- 从单张RGB图逐部件生成CadQuery，通过约束观察、参数求解代码和几何审查迭代重建。它结合紧凑记忆和失败经验辅助组件级建模。CAD-Coder等在原文中是比较对象，不能仅凭引用画成其直接方法来源。

## 独立标签

- **输入**：图像

- **表示**：CadQuery

- **方法**：代理 · 约束求解 · 执行反馈 · 记忆

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R14 · 相关基础

[CADBench](/cad/papers/dor26) → [CADForge](/cad/papers/lu26g)

CADForge沿用CADBench的部分数据处理协议，非继承其模型。

证据定位（来源材料记录）：Lu26g Appendix B.1，PDF第14页。

### R18 · 比较关系

[CAD-Coder · Doris](/cad/papers/dor25) → [CADForge](/cad/papers/lu26g)

CAD-Coder在CADForge中是比较基线，没有已核实的直接方法采用。

证据定位（来源材料记录）：Lu26g §4.1，第6页；Appendix C。

## 关联资源与问题

资源：未单列。

问题：[I-B-03](/cad/issues/i-b-03) · [I-E-03](/cad/issues/i-e-03)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2610.04262)
- [原始来源 2](https://arxiv.org/abs/2610.04262v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
