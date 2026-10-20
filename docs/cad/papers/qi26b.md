---
id: cad-ref-qi26b
title: Pointer-CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 指针选择
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2603.04337'
  - 'https://arxiv.org/abs/2603.04337v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Pointer-CAD


## 论文信息

- **全名**：Pointer-CAD: Unifying B-Rep and Command Sequences via Pointer-based Edges &amp; Faces Selection
- **作者**：Dacheng Qi、Chenyu Wang、Jingwei Xu、Tianzhe Chu、Zibo Zhao、Wen Liu、Wenrui Ding、Yi Ma、Shenghua Gao
- **论文时间**：2026-03-04（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

在生成中引用当前边面实体，主交付是构造模型。

## 方法与贡献

- 让后续操作观察当前B-Rep，并通过指针选择需要引用的边或面。它把命令序列与已生成几何实体连接起来，支持需要实体选择的建模操作。选对实体与跨修改稳定维持引用和约束仍是不同问题。

## 技术要点

- **输入**：文本 · B-Rep

- **表示**：命令序列

- **方法**：指针选择

- **对象**：零件

- **要求**：实体引用

## 相关研究

### R19 · 比较关系

[Pointer-CAD](/cad/papers/qi26b) → [Vision2CAD](/cad/papers/che26e)

Vision2CAD讨论Pointer-CAD实体选择能力作为背景；不能把引用当成继承其实现。

原文位置：Che26e §2.3，PDF第5页。

### R22 · 学习归类

[持久拓扑命名](/cad/papers/kri95) → [Pointer-CAD](/cad/papers/qi26b)

阅读实体指针前先理解持久引用问题；不表示Pointer-CAD采用1995的命名算法。

原文位置：持久命名期刊摘要与Pointer-CAD摘要；仅学习联系。

### R30 · 直接改进

[Pointer-CAD](/cad/papers/qi26b) → [Pointer-CAD v2 · 先规划再构造](/cad/papers/qi26)

Pointer-CAD v2摘要明确与v1比较，改为计划先行和连续参数引用以避免量化误差；这条关系不扩展为所有模块、权重或数据均直接复用。

原文位置：arXiv摘要：Compared with v1 (arXiv:2603.04337)。

## 关联资源与问题

问题：[I-F-01](/cad/issues/i-f-01) · [I-F-02](/cad/issues/i-f-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2603.04337)
- [原始来源 2](https://arxiv.org/abs/2603.04337v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
