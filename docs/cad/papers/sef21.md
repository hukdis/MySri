---
id: cad-ref-sef21
title: Vitruvion
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2109.14124'
  - 'https://arxiv.org/abs/2109.14124v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Vitruvion

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Sef21 · 2021-09-29 · 方法研究

## 论文信息

- **全名**：Vitruvion: A Generative Model of Parametric CAD Sketches
- **作者**：Ari Seff、Wenda Zhou、Nick Richardson、Ryan P. Adams
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；ICLR 2022
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

生成及补全参数草图，求解器是实现机制。



## 贡献简介

- 分开生成几何基元序列与引用这些基元的约束序列，并将结果交给CAD求解器。相比仅生成图元，它显式学习图元位置与关系，还支持部分草图和手绘条件。论文中的约束及图元范围有限，数值尺寸约束并未全部覆盖。

## 独立标签

- **输入**：未标注

- **表示**：约束图

- **方法**：自回归 · 约束求解

- **对象**：草图

- **要求**：约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R04 · 相关基础

[SketchGraphs](/cad/papers/sef20) → [Vitruvion](/cad/papers/sef21)

Vitruvion使用SketchGraphs数据和约束监督，并适配其基线进行比较；这条线记录数据基础。

证据定位（来源材料记录）：Sef21 §§4.1–4.2，PDF第7页。

### R05 · 直接改进

[Vitruvion](/cad/papers/sef21) → [Design Alignment](/cad/papers/cas25)

Design Alignment采用Vitruvion作为基础模型，在其上加入求解器反馈的对齐训练。

证据定位（来源材料记录）：Cas25 §4.2，第4页；§§4.3–4.4。

## 关联资源与问题

资源：[SketchGraphs](/cad/datasets/ds_sketchgraphs)。

问题：[I-D-01](/cad/issues/i-d-01)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2109.14124)
- [原始来源 2](https://arxiv.org/abs/2109.14124v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
