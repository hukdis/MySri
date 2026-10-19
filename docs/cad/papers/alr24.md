---
id: cad-ref-alr24
title: CADCodeVerify
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 视觉语言模型
  - 执行反馈
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2410.05340'
  - 'https://arxiv.org/abs/2410.05340v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADCodeVerify

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Alr24 · 2024-10-07 · 方法研究

## 论文信息

- **全名**：Generating CAD Code with Vision-Language Models for 3D Designs
- **作者**：Kamel Alrashedy、Pradyumna Tambwekar、Zulfiqar Zaidi、Megan Langwasser、Wei Xu、Matthew Gombolay
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

文本建模并核验生成代码，内部纠错属于生成流程。



## 贡献简介

- 建立文本到CAD代码的提示基准，并让视觉语言模型提出和回答验证问题来修订生成结果。它把可视化反馈接入代码生成循环。视觉自检的正确性不能独立取代数值几何或可执行要求测试。

## 独立标签

- **输入**：文本

- **表示**：CAD程序

- **方法**：语言模型 · 视觉语言模型 · 执行反馈

- **对象**：零件

- **要求**：几何 · 规格验证

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R13 · 相关基础

[CADCodeVerify](/cad/papers/alr24) → [CADTests](/cad/cadtests)

CADTestBench基于CADPrompt设计要求测试与评价；这条线区分数据/任务基础和方法继承。

证据定位（来源材料记录）：Mal26 §5，第6页。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2410.05340)
- [原始来源 2](https://arxiv.org/abs/2410.05340v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
