---
id: cad-ref-xu24b
title: BrepGen
category: cad
type: paper
tags:
  - 论文资料记录
  - 扩散
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3658129'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# BrepGen

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Xu24b · 2024-07-19 · 方法研究

## 论文信息

- **全名**：BrepGen: A B-rep Generative Diffusion Model with Structured Latent Geometry
- **作者**：Xiang Xu、Joseph Lambourne、Pradeep Jayaraman、Zhengqing Wang、Karl Willis、Yasutaka Furukawa
- **时间依据**：正式/机构年份记录
- **正式发表记录**：2024-07-19；ACM Transactions on Graphics
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

从潜空间采样生成边界表示。



## 贡献简介

- 用结构化潜在几何表示配合扩散模型，生成B-Rep几何与拓扑。它提供不同于自回归顶点边面预测的直接边界生成路线。其结果是边界模型，不能自动解释为完整可复用建模历史。

## 独立标签

- **输入**：未标注

- **表示**：B-Rep

- **方法**：扩散

- **对象**：零件

- **要求**：几何 · 拓扑

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R21 · 学习归类

[SolidGen](/cad/papers/jay22) → [BrepGen](/cad/papers/xu24b)

直接B-Rep生成中自回归与扩散的代表分支；没有核实直接继承，按方法范式并列。

证据定位（来源材料记录）：Jay22、Xu24b摘要。

## 关联资源与问题

资源：未单列。

问题：[I-F-03](/cad/issues/i-f-03)。

## 原始来源

- [原始来源 1](https://doi.org/10.1145/3658129)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
