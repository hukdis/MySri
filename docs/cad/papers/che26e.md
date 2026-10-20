---
id: cad-ref-che26e
title: Vision2CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 工具调用
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.22688'
  - 'https://arxiv.org/abs/2609.22688v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Vision2CAD


## 论文信息

- **全名**：Vision2CAD: A Visual Agent Harness for Explicit Geometry Referencing and Localization in Parametric CAD Modeling
- **作者**：Xi Cheng、Chenxi Zhai、Hang Cheng、Mingyu Fan、Pingfa Feng、Long Zeng
- **论文时间**：2026-09-19（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

视觉定位与确定性操作支持参数化建模；实体ID是实现机制。

## 方法与贡献

- 用明确实体ID、视口到草图坐标转换和外部几何投影约束，把视觉推理与确定性CAD操作连接起来。它提供命令、几何状态和ID对齐的数据来检查特征依赖。Pointer-CAD和CAD-Assistant在原文中主要是上下文或对照，没有已核实的方法继承证据。

## 技术要点

- **输入**：图像 · 文本

- **表示**：CAD程序

- **方法**：代理 · 工具调用 · 约束求解

- **对象**：零件

- **要求**：实体引用 · 约束

## 相关研究

### R19 · 比较关系

[Pointer-CAD](/cad/papers/qi26b) → [Vision2CAD](/cad/papers/che26e)

Vision2CAD讨论Pointer-CAD实体选择能力作为背景；不能把引用当成继承其实现。

原文位置：Che26e §2.3，PDF第5页。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.22688)
- [原始来源 2](https://arxiv.org/abs/2609.22688v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
