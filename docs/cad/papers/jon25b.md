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
updated: '2026-10-20'
cadRecord: true
---
# AIDL


## 论文信息

- **全名**：A Solver-Aided Hierarchical Language for LLM-Driven CAD Design
- **作者**：Benjamin T. Jones、Felix Hähnlein、Zihan Zhang、Maaz Ahmad、Vladimir Kim、Adriana Schulz
- **论文时间**：2025-02-13（arXiv首次提交）
- **正式发表记录**：2025-10；Computer Graphics Forum

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

求解器辅助语言支持层次设计，当前主要为二维设计。

## 方法与贡献

- 设计分层且有求解器辅助的CAD语言，将高层组件关系交给LLM表达、低层几何关系交给求解器处理。它把语言设计作为模型训练之外的一条改进路径。现有主要实验的二维范围与复杂三维迁移需要分开看待。

## 技术要点

- **输入**：文本

- **表示**：DSL

- **方法**：语言模型 · 约束求解

- **对象**：草图

- **要求**：约束

## 关联资源与问题

问题：[I-D-02](/cad/issues/i-d-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2502.09819)
- [原始来源 2](https://arxiv.org/abs/2502.09819v1)
- [原始来源 3](https://doi.org/10.1111/cgf.70250)
- [原始来源 4](https://api.crossref.org/works/10.1111%2Fcgf.70250)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
