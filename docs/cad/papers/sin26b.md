---
id: cad-ref-sin26b
title: AgenticCADedit
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 工具调用
  - 执行反馈
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.29621'
  - 'https://arxiv.org/abs/2609.29621v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# AgenticCADedit


## 论文信息

- **全名**：AgenticCADedit: A Stateful, Tool-Mediated Agentic Approach to Multimodal 3D CAD Editing
- **作者**：Saptarshi Neil Sinha、Mika Silvan Goschke、Paul Julius Kühn、Arjan Kuijper、Michael Weinmann
- **论文时间**：2026-08-28（arXiv首次提交）

## 任务定位

研究任务：[CAD编辑](/cad/tasks/editing)。

在持久会话中小步编辑并支持撤销。

## 方法与贡献

- 在持久CAD会话中执行小步编辑，允许检查实体、失败恢复和主动撤销，以累积正确进展。它沿用neuralCAD-Edit的基准和协议，比较状态化接口与原无状态重生成接口。该联系是基准复用和接口范式改造，不代表继承前者的模型或训练。

## 技术要点

- **输入**：文本 · 已有CAD

- **表示**：CAD程序

- **方法**：代理 · 工具调用 · 执行反馈

- **对象**：零件

- **要求**：可编辑性 · 内容保持

## 相关研究

### R17 · 相关基础

[neuralCAD-Edit](/cad/papers/per26) → [AgenticCADedit](/cad/papers/sin26b)

AgenticCADedit复用neuralCAD-Edit基准和评价协议，并改变交互接口；不声称继承其模型或训练。

原文位置：Sin26b §6.1，第7页；§3.2，第5–6页。

## 关联资源与问题

资源：[neuralCAD-Edit](/cad/datasets/ds_neuralcadedit)。

问题：[I-C-01](/cad/issues/i-c-01) · [I-C-02](/cad/issues/i-c-02)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.29621)
- [原始来源 2](https://arxiv.org/abs/2609.29621v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
