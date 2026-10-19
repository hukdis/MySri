---
id: cad-ref-dor25
title: CAD-Coder · Doris
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2505.14646'
  - 'https://arxiv.org/abs/2505.14646v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CAD-Coder · Doris

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Dor25 · 2025-05-20 · 方法研究

## 论文信息

- **全名**：CAD-Coder: An Open-Source Vision-Language Model for Computer-Aided Design Code Generation
- **作者**：Anna C. Doris、Md Ferdous Alam、Amin Heyrani Nobari、Faez Ahmed
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

图像到CadQuery的目标恢复；与同名文本生成论文分开。



## 贡献简介

- 微调视觉语言模型从图像生成CadQuery代码，并构建图像和可执行代码配对数据。它将代码模型的输出与可执行CAD几何相结合。现实照片迁移的展示应与严格跨分布评价区分，也不能和Guan等的同名文本方法混为一篇。

## 独立标签

- **输入**：图像

- **表示**：CadQuery

- **方法**：视觉语言模型

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R18 · 比较关系

[CAD-Coder · Doris](/cad/papers/dor25) → [CADForge](/cad/papers/lu26g)

CAD-Coder在CADForge中是比较基线，没有已核实的直接方法采用。

证据定位（来源材料记录）：Lu26g §4.1，第6页；Appendix C。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2505.14646)
- [原始来源 2](https://arxiv.org/abs/2505.14646v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
