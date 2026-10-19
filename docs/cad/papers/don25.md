---
id: cad-ref-don25
title: HistCAD · v4
category: cad
type: paper
tags:
  - 论文资料记录
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2602.19171'
  - 'https://arxiv.org/abs/2602.19171v4'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# HistCAD · v4

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Don25 · 2025-12-08 · 资料贡献

## 论文信息

- **全名**：HistCAD: Constraint-Aware Parametric CAD Histories for Evaluating Editability
- **作者**：Xintong Dong、Chuanyang Li、Peng Zheng、Chuqi Han、Jiaxin Jing、Hailong Shen、Yanzhi Song、Zhouwang Yang
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：采用2026-10-08更新的v4标题、任务与摘要；现有旧笔记为v3，旧数据规模及任务表述不用于本节点。 索引题名与当前原文题名不同，保留索引题名供检索。

## 研究交付与任务

主入口：共用基础或资料。

HistCAD评价给定历史的约束预测与编辑行为，不把基线写成读取编辑请求的编辑算法。



## 贡献简介

- 最新v4研究为给定构造历史预测草图约束，并在初始几何和指定尺寸编辑下检查这些约束是否有用。它保留几何与特征定义，移除约束作为预测任务，且模型生成约束时不见编辑请求。编辑必须同时满足初始几何、目标值、保持关系及完整历史重建，和旧版本的任务及数据表述不能混用。

## 独立标签

- **输入**：草图 · 构造历史

- **表示**：约束图

- **方法**：未标注

- **对象**：草图

- **要求**：约束 · 可编辑性

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：[HistCAD（当前v4）](/cad/datasets/ds_histcad)。

问题：[I-D-01](/cad/issues/i-d-01)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2602.19171)
- [原始来源 2](https://arxiv.org/abs/2602.19171v4)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
