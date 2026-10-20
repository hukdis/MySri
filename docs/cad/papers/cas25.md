---
id: cad-ref-cas25
title: Design Alignment
category: cad
type: paper
tags:
  - 论文资料记录
  - 强化学习
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/ICCV51701.2025.00806'
  - 'https://arxiv.org/abs/2504.13178v2'
  - 'https://doi.org/10.1109/iccv51701.2025.00806'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Design Alignment


## 论文信息

- **全名**：Aligning Constraint Generation with Design Intent in Parametric CAD
- **作者**：Evan Casey、Tianyu Zhang、Shu Ishida、William P. McCarthy、John Roger Thompson、Amir Khasahmadi、Joseph George Lambourne、Pradeep Kumar Jayaraman、Karl D. D. Willis
- **论文时间**：2025-04-17（arXiv首次提交）
- **正式发表记录**：2025-10-19；2025 IEEE/CVF International Conference on Computer Vision (ICCV)

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

给定草图几何推断约束并与求解状态对齐，主交付为关系推断而非新几何。

其他任务：[CAD生成](/cad/tasks/generation)

## 方法与贡献

- 在Vitruvion及SketchGraphs基础上，用CAD约束求解器状态反馈进行对齐训练。它把可求解、约束充分和几何稳定等条件纳入训练目标。全约束并不等于完整设计意图，过多尺寸也可能提高奖励而降低参数变化灵活性。

## 技术要点

- **输入**：草图

- **表示**：约束图

- **方法**：强化学习 · 约束求解

- **对象**：草图

- **要求**：约束 · 可编辑性

## 相关研究

### R05 · 直接改进

[Vitruvion](/cad/papers/sef21) → [Design Alignment](/cad/papers/cas25)

Design Alignment采用Vitruvion作为基础模型，在其上加入求解器反馈的对齐训练。

原文位置：Cas25 §4.2，第4页；§§4.3–4.4。

### R06 · 相关基础

[SketchGraphs](/cad/papers/sef20) → [Design Alignment](/cad/papers/cas25)

Design Alignment的训练数据来自SketchGraphs。

原文位置：Cas25 §5.1，第6页。

## 关联资源与问题

资源：[SketchGraphs](/cad/datasets/ds_sketchgraphs)。

问题：[I-D-01](/cad/issues/i-d-01)。

## 参考文献

- [原始来源 1](https://doi.org/10.1109/ICCV51701.2025.00806)
- [原始来源 2](https://arxiv.org/abs/2504.13178v2)
- [原始来源 3](https://doi.org/10.1109/iccv51701.2025.00806)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
