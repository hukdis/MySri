---
id: cad-ref-par21
title: SketchGen
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2106.02711'
  - 'https://arxiv.org/abs/2106.02711v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# SketchGen


## 论文信息

- **全名**：SketchGen: Generating Constrained CAD Sketches
- **作者**：Wamiq Reyaz Para、Shariq Farooq Bhat、Paul Guerrero、Tom Kelly、Niloy Mitra、Leonidas Guibas、Peter Wonka
- **论文时间**：2021-06-04（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

联合生成草图基元和约束。

## 方法与贡献

- 设计用于异质几何基元和约束的序列语言，使Transformer能够联合生成草图及几何关系。生成的约束可交给求解器进一步规范草图。主要任务为二维草图与约束，不是完整三维工业建模。

## 技术要点

- **表示**：约束图

- **方法**：自回归

- **对象**：草图

- **要求**：约束

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2106.02711)
- [原始来源 2](https://arxiv.org/abs/2106.02711v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
