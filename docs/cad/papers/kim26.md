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
updated: '2026-10-19'
cadRecord: true
---
# Drawing-Recode · 标注到几何的对应

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Kim26 · 2026-07-30 · 方法研究

## 论文信息

- **全名**：Drawing-Recode: Annotation Grounding for Parametric CAD Code Generation from Raster 2D CAD Drawings
- **作者**：Kim, Mingi、Kim, Yongjun、Kim, Hyungki
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

从指定扫描工程图恢复参数化代码，标注对应服务于重建。



## 贡献简介

- 针对扫描栅格工程图中的尺寸标注难以约束三维重建的问题，分别提取图形特征和文字标注，再用跨注意力与标注对应损失连接二者。系统把这些特征交给LLM生成SPCC形式的参数化CAD代码，扩展了只输入向量图纸的路线。论文报告扫描条件下的鲁棒性，但其数据获取、标注识别误差和实际尺寸容差仍需独立核查。

## 独立标签

- **输入**：图纸

- **表示**：SPCC

- **方法**：视觉语言模型 · 监督学习

- **对象**：零件

- **要求**：尺寸

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-B-01](/cad/issues/i-b-01)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2607.27558)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
