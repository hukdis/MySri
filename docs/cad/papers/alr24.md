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
updated: '2026-10-20'
cadRecord: true
---
# CADCodeVerify


## 论文信息

- **全名**：Generating CAD Code with Vision-Language Models for 3D Designs
- **作者**：Kamel Alrashedy、Pradyumna Tambwekar、Zulfiqar Zaidi、Megan Langwasser、Wei Xu、Matthew Gombolay
- **论文时间**：2024-10-07（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

文本建模并核验生成代码，内部纠错属于生成流程。

## 方法与贡献

- 建立文本到CAD代码的提示基准，并让视觉语言模型提出和回答验证问题来修订生成结果。它把可视化反馈接入代码生成循环。视觉自检的正确性不能独立取代数值几何或可执行要求测试。

## 技术要点

- **输入**：文本

- **表示**：CAD程序

- **方法**：语言模型 · 视觉语言模型 · 执行反馈

- **对象**：零件

- **要求**：几何 · 规格验证

## 相关研究

### R13 · 相关基础

[CADCodeVerify](/cad/papers/alr24) → [CADTests](/cad/cadtests)

CADTestBench基于CADPrompt设计要求测试与评价；这条线区分数据/任务基础和方法继承。

原文位置：Mal26 §5，第6页。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2410.05340)
- [原始来源 2](https://arxiv.org/abs/2410.05340v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
