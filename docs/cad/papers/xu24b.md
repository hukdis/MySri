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
updated: '2026-10-20'
cadRecord: true
---
# BrepGen


## 论文信息

- **全名**：BrepGen: A B-rep Generative Diffusion Model with Structured Latent Geometry
- **作者**：Xiang Xu、Joseph Lambourne、Pradeep Jayaraman、Zhengqing Wang、Karl Willis、Yasutaka Furukawa
- **论文时间**：2024-07-19（正式/机构年份记录）
- **正式发表记录**：2024-07-19；ACM Transactions on Graphics

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

从潜空间采样生成边界表示。

## 方法与贡献

- 用结构化潜在几何表示配合扩散模型，生成B-Rep几何与拓扑。它提供不同于自回归顶点边面预测的直接边界生成路线。其结果是边界模型，不能自动解释为完整可复用建模历史。

## 技术要点

- **表示**：B-Rep

- **方法**：扩散

- **对象**：零件

- **要求**：几何 · 拓扑

## 相关研究

### R21 · 学习归类

[SolidGen](/cad/papers/jay22) → [BrepGen](/cad/papers/xu24b)

直接B-Rep生成中自回归与扩散的代表分支；没有核实直接继承，按方法范式并列。

原文位置：Jay22、Xu24b摘要。

## 关联资源与问题

问题：[I-F-03](/cad/issues/i-f-03)。

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3658129)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
