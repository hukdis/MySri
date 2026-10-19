---
id: cad-ref-zha26g
title: ConCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 强化学习
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.34494'
  - 'https://arxiv.org/abs/2609.34494v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# ConCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Zha26g · 2026-09-28 · 方法研究

## 论文信息

- **全名**：ConCAD: Constraint-Aware Image-to-CAD Generation with Dual-Granularity Rewards
- **作者**：Chenxi Zhai、Xi Cheng、Hang Cheng、Zhicheng Guan、Mingyu Fan、Yanzhe Tang、Pingfa Feng、Long Zeng
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

面向图像目标恢复的约束和执行奖励后训练。



## 贡献简介

- 在图像到CAD后训练中结合代码层约束奖励与执行层几何奖励，并从B-Rep解析几何约束进行评价。它针对外形相似但构造关系不同的情况增加约束信号。约束集合与提取器能覆盖的范围仍决定意图评价的边界。

## 独立标签

- **输入**：图像

- **表示**：CAD程序

- **方法**：强化学习 · 约束求解

- **对象**：零件

- **要求**：几何 · 约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-C-02](/cad/issues/i-c-02) · [I-D-02](/cad/issues/i-d-02)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2609.34494)
- [原始来源 2](https://arxiv.org/abs/2609.34494v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
