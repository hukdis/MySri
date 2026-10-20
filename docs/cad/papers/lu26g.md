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
updated: '2026-10-20'
cadRecord: true
---
# CADForge


## 论文信息

- **全名**：CADForge: Agentic Single-View CAD Reconstruction with Explicit Geometry Reasoning
- **作者**：Keyang Lu、Zhifei Yang、Tianao Dong、Mingzhe Xing、Zhen Xiao、Yikai Wang
- **论文时间**：2026-10-03（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

单图目标逐组件重建，记忆及求解器是过程机制。

## 方法与贡献

- 从单张RGB图逐部件生成CadQuery，通过约束观察、参数求解代码和几何审查迭代重建。它结合紧凑记忆和失败经验辅助组件级建模。CAD-Coder等在原文中是比较对象，不能仅凭引用画成其直接方法来源。

## 技术要点

- **输入**：图像

- **表示**：CadQuery

- **方法**：代理 · 约束求解 · 执行反馈 · 记忆

- **对象**：零件

- **要求**：几何

## 相关研究

### R14 · 相关基础

[CADBench](/cad/papers/dor26) → [CADForge](/cad/papers/lu26g)

CADForge沿用CADBench的部分数据处理协议，非继承其模型。

原文位置：Lu26g Appendix B.1，PDF第14页。

### R18 · 比较关系

[CAD-Coder · Doris](/cad/papers/dor25) → [CADForge](/cad/papers/lu26g)

CAD-Coder在CADForge中是比较基线，没有已核实的直接方法采用。

原文位置：Lu26g §4.1，第6页；Appendix C。

## 关联资源与问题

问题：[I-B-03](/cad/issues/i-b-03) · [I-E-03](/cad/issues/i-e-03)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2610.04262)
- [原始来源 2](https://arxiv.org/abs/2610.04262v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
