---
id: cad-ref-per26
title: neuralCAD-Edit
category: cad
type: paper
tags:
  - 论文资料记录
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2604.16170'
  - 'https://arxiv.org/abs/2604.16170v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# neuralCAD-Edit


## 论文信息

- **全名**：neuralCAD-Edit: An Expert Benchmark for Multimodal-Instructed 3D CAD Model Editing
- **作者**：Toby Perrett、Matthew Bouchard、William McCarthy
- **论文时间**：2026-04-17（arXiv首次提交）

## 任务定位

研究任务：共用基础。

专家真实多模态编辑基准，主要贡献为任务资源。

## 方法与贡献

- 从专家在CAD软件中的说话、指点和绘制视频收集真实编辑请求，建立多模态编辑基准。它把评价从合成文本三元组推进到专业工作流，并与人类编辑表现比较。基准和基线接口是两层内容，后续可以改变接口而沿用同一基准。

## 技术要点

- **输入**：文本 · 图像 · 视频 · 已有CAD

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

- [原始来源 1](https://doi.org/10.48550/arXiv.2604.16170)
- [原始来源 2](https://arxiv.org/abs/2604.16170v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
