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
updated: '2026-10-20'
cadRecord: true
---
# ConCAD


## 论文信息

- **全名**：ConCAD: Constraint-Aware Image-to-CAD Generation with Dual-Granularity Rewards
- **作者**：Chenxi Zhai、Xi Cheng、Hang Cheng、Zhicheng Guan、Mingyu Fan、Yanzhe Tang、Pingfa Feng、Long Zeng
- **论文时间**：2026-09-28（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

面向图像目标恢复的约束和执行奖励后训练。

## 方法与贡献

- 在图像到CAD后训练中结合代码层约束奖励与执行层几何奖励，并从B-Rep解析几何约束进行评价。它针对外形相似但构造关系不同的情况增加约束信号。约束集合与提取器能覆盖的范围仍决定意图评价的边界。

## 技术要点

- **输入**：图像

- **表示**：CAD程序

- **方法**：强化学习 · 约束求解

- **对象**：零件

- **要求**：几何 · 约束

## 关联资源与问题

问题：[I-C-02](/cad/issues/i-c-02) · [I-D-02](/cad/issues/i-d-02)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.34494)
- [原始来源 2](https://arxiv.org/abs/2609.34494v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
