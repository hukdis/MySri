---
id: cad-ref-jon25b
title: AIDL
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2502.09819'
  - 'https://arxiv.org/abs/2502.09819v1'
  - 'https://doi.org/10.1111/cgf.70250'
  - 'https://api.crossref.org/works/10.1111%2Fcgf.70250'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# AIDL

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Jon25b · 2025-02-13 · 方法研究

## 论文信息

- **全名**：A Solver-Aided Hierarchical Language for LLM-Driven CAD Design
- **作者**：Benjamin T. Jones、Felix Hähnlein、Zihan Zhang、Maaz Ahmad、Vladimir Kim、Adriana Schulz
- **时间依据**：arXiv首次提交
- **正式发表记录**：2025-10；Computer Graphics Forum
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

求解器辅助语言支持层次设计，当前主要为二维设计。



## 贡献简介

- 设计分层且有求解器辅助的CAD语言，将高层组件关系交给LLM表达、低层几何关系交给求解器处理。它把语言设计作为模型训练之外的一条改进路径。现有主要实验的二维范围与复杂三维迁移需要分开看待。

## 独立标签

- **输入**：文本

- **表示**：DSL

- **方法**：语言模型 · 约束求解

- **对象**：草图

- **要求**：约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-D-02](/cad/issues/i-d-02)。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2502.09819)
- [原始来源 2](https://arxiv.org/abs/2502.09819v1)
- [原始来源 3](https://doi.org/10.1111/cgf.70250)
- [原始来源 4](https://api.crossref.org/works/10.1111%2Fcgf.70250)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
