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
updated: '2026-10-20'
cadRecord: true
---
# HierCAD · 层级结构与参数对应


## 论文信息

- **全名**：HierCAD: Hierarchical Text-to-CAD Design via Structure Alignment and Parameter Grounding
- **作者**：Xu, Jimin、Wang, Tianbao、Jin, Tao、Zhao, Zhou
- **论文时间**：2026-07-13（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

文本需求经结构对齐和参数对应产生新设计。

## 方法与贡献

- 针对文本生成复杂CAD时结构不一致、参数对应不准确的问题，将构造树分解为物体级过程和零件级拓扑推理轨迹。它用结构对齐以及保持结构的参数扰动和排序监督，共同学习结构与几何参数对应。所报告提升依赖其任务和数据协议，不能据此推断对任意CAD后端、真实编辑或工业公差均有效。

## 技术要点

- **输入**：文本

- **表示**：命令序列

- **方法**：语言模型 · 监督学习

- **对象**：零件

- **要求**：尺寸 · 约束

## 关联资源与问题

问题：[I-A-01](/cad/issues/i-a-01)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2607.11339)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
