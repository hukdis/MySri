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
updated: '2026-10-19'
cadRecord: true
---
# SketchGen

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Par21 · 2021-06-04 · 方法研究

## 论文信息

- **全名**：SketchGen: Generating Constrained CAD Sketches
- **作者**：Wamiq Reyaz Para、Shariq Farooq Bhat、Paul Guerrero、Tom Kelly、Niloy Mitra、Leonidas Guibas、Peter Wonka
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

联合生成草图基元和约束。



## 贡献简介

- 设计用于异质几何基元和约束的序列语言，使Transformer能够联合生成草图及几何关系。生成的约束可交给求解器进一步规范草图。主要任务为二维草图与约束，不是完整三维工业建模。

## 独立标签

- **输入**：未标注

- **表示**：约束图

- **方法**：自回归

- **对象**：草图

- **要求**：约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2106.02711)
- [原始来源 2](https://arxiv.org/abs/2106.02711v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
