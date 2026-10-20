---
id: cad-ref-kim26
title: Drawing-Recode · 标注到几何的对应
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2607.27558'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Drawing-Recode · 标注到几何的对应


## 论文信息

- **全名**：Drawing-Recode: Annotation Grounding for Parametric CAD Code Generation from Raster 2D CAD Drawings
- **作者**：Kim, Mingi、Kim, Yongjun、Kim, Hyungki
- **论文时间**：2026-07-30（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

从指定扫描工程图恢复参数化代码，标注对应服务于重建。

## 方法与贡献

- 针对扫描栅格工程图中的尺寸标注难以约束三维重建的问题，分别提取图形特征和文字标注，再用跨注意力与标注对应损失连接二者。系统把这些特征交给LLM生成SPCC形式的参数化CAD代码，扩展了只输入向量图纸的路线。论文报告扫描条件下的鲁棒性，但其数据获取、标注识别误差和实际尺寸容差仍需独立核查。

## 技术要点

- **输入**：图纸

- **表示**：SPCC

- **方法**：视觉语言模型 · 监督学习

- **对象**：零件

- **要求**：尺寸

## 关联资源与问题

问题：[I-B-01](/cad/issues/i-b-01)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2607.27558)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
