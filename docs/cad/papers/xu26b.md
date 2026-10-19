---
id: cad-ref-xu26b
title: HierCAD · 层级结构与参数对应
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2607.11339'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# HierCAD · 层级结构与参数对应

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Xu26b · 2026-07-13 · 方法研究

## 论文信息

- **全名**：HierCAD: Hierarchical Text-to-CAD Design via Structure Alignment and Parameter Grounding
- **作者**：Xu, Jimin、Wang, Tianbao、Jin, Tao、Zhao, Zhou
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

文本需求经结构对齐和参数对应产生新设计。



## 贡献简介

- 针对文本生成复杂CAD时结构不一致、参数对应不准确的问题，将构造树分解为物体级过程和零件级拓扑推理轨迹。它用结构对齐以及保持结构的参数扰动和排序监督，共同学习结构与几何参数对应。所报告提升依赖其任务和数据协议，不能据此推断对任意CAD后端、真实编辑或工业公差均有效。

## 独立标签

- **输入**：文本

- **表示**：命令序列

- **方法**：语言模型 · 监督学习

- **对象**：零件

- **要求**：尺寸 · 约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-A-01](/cad/issues/i-a-01)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2607.11339)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
