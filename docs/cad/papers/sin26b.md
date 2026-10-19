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
updated: '2026-10-19'
cadRecord: true
---
# AgenticCADedit

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Sin26b · 2026-08-28 · 方法研究

## 论文信息

- **全名**：AgenticCADedit: A Stateful, Tool-Mediated Agentic Approach to Multimodal 3D CAD Editing
- **作者**：Saptarshi Neil Sinha、Mika Silvan Goschke、Paul Julius Kühn、Arjan Kuijper、Michael Weinmann
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD编辑](/cad/tasks/editing)。

在持久会话中小步编辑并支持撤销。



## 贡献简介

- 在持久CAD会话中执行小步编辑，允许检查实体、失败恢复和主动撤销，以累积正确进展。它沿用neuralCAD-Edit的基准和协议，比较状态化接口与原无状态重生成接口。该联系是基准复用和接口范式改造，不代表继承前者的模型或训练。

## 独立标签

- **输入**：文本 · 已有CAD

- **表示**：CAD程序

- **方法**：代理 · 工具调用 · 执行反馈

- **对象**：零件

- **要求**：可编辑性 · 内容保持

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R17 · 相关基础

[neuralCAD-Edit](/cad/papers/per26) → [AgenticCADedit](/cad/papers/sin26b)

AgenticCADedit复用neuralCAD-Edit基准和评价协议，并改变交互接口；不声称继承其模型或训练。

证据定位（来源材料记录）：Sin26b §6.1，第7页；§3.2，第5–6页。

## 关联资源与问题

资源：[neuralCAD-Edit](/cad/datasets/ds_neuralcadedit)。

问题：[I-C-01](/cad/issues/i-c-01) · [I-C-02](/cad/issues/i-c-02)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2609.29621)
- [原始来源 2](https://arxiv.org/abs/2609.29621v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
