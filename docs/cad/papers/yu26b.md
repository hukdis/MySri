---
id: cad-ref-yu26b
title: VGGT-CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 多视图融合
  - 主动观察
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.21225'
  - 'https://arxiv.org/abs/2609.21225v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# VGGT-CAD


## 论文信息

- **全名**：VGGT-CAD: Reconstructing Parametric CAD 3D Model with Geometric Grounding
- **作者**：Chunan Yu、Tianrun Chen、Fu Shen、Cheng Chen、Lanyun Zhu、Yang Yang
- **论文时间**：2026-09-18（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

跨视图几何先验服务于指定对象恢复。

## 方法与贡献

- 把预训练三维几何先验、相机信息和跨视图聚合带入CAD序列重建，并在推理时选择互补视角。它用VideoCAD组织不同观察配置下的评价。可选择的视角范围和真实场景遮挡条件仍需与主动观察任务区分。

## 技术要点

- **输入**：图像

- **表示**：命令序列

- **方法**：多视图融合 · 主动观察

- **对象**：零件

- **要求**：几何

## 关联资源与问题

问题：[I-B-03](/cad/issues/i-b-03)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.21225)
- [原始来源 2](https://arxiv.org/abs/2609.21225v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
