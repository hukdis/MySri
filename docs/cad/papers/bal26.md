---
id: cad-ref-bal26
title: GReFEM
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
  - 仿真反馈
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2607.08798'
  - 'https://arxiv.org/abs/2607.08798v2'
  - 'https://neurips.cc/virtual/2026/poster/154294'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# GReFEM


## 论文信息

- **全名**：GReFEM: Multimodal LLMs as Zero-Shot Semantic Assistants for Physics-Guided 3D Mesh Refinement
- **作者**：Kartik Bali、Mahish K. Guru、Christian J Cyron、Roland Aydin
- **论文时间**：2026-07-08（arXiv首次提交）
- **正式发表记录**：2026；NeurIPS 2026

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

为已有几何选择物理相关网格细化区域。

## 方法与贡献

- 让多模态模型根据物理提示和视图定位应力相关几何区域，以指导有限元网格细化。它把语义空间理解接入CAE资源分配，而非生成CAD程序。效果受视图、载荷和细化预算协议影响，属于工程分析邻接路线。

## 技术要点

- **输入**：图像 · 几何

- **方法**：视觉语言模型 · 仿真反馈

- **对象**：有限元网格

- **要求**：物理功能

## 关联资源与问题

问题：[I-H-06](/cad/issues/i-h-06)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2607.08798)
- [原始来源 2](https://arxiv.org/abs/2607.08798v2)
- [原始来源 3](https://neurips.cc/virtual/2026/poster/154294)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
