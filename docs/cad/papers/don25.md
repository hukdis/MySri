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
updated: '2026-10-20'
cadRecord: true
---
# HistCAD · v4


## 论文信息

- **全名**：HistCAD: Constraint-Aware Parametric CAD Histories for Evaluating Editability
- **作者**：Xintong Dong、Chuanyang Li、Peng Zheng、Chuqi Han、Jiaxin Jing、Hailong Shen、Yanzhi Song、Zhouwang Yang
- **论文时间**：2025-12-08（arXiv首次提交）

- **版本说明**：采用2026-10-08更新的v4标题、任务与摘要；现有旧笔记为v3，旧数据规模及任务表述不用于本节点。 索引题名与当前原文题名不同，保留索引题名供检索。

## 任务定位

研究任务：共用基础。

HistCAD评价给定历史的约束预测与编辑行为，不把基线写成读取编辑请求的编辑算法。

## 方法与贡献

- 最新v4研究为给定构造历史预测草图约束，并在初始几何和指定尺寸编辑下检查这些约束是否有用。它保留几何与特征定义，移除约束作为预测任务，且模型生成约束时不见编辑请求。编辑必须同时满足初始几何、目标值、保持关系及完整历史重建，和旧版本的任务及数据表述不能混用。

## 技术要点

- **输入**：草图 · 构造历史

- **表示**：约束图

- **对象**：草图

- **要求**：约束 · 可编辑性

## 关联资源与问题

资源：[HistCAD（当前v4）](/cad/datasets/ds_histcad)。

问题：[I-D-01](/cad/issues/i-d-01)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2602.19171)
- [原始来源 2](https://arxiv.org/abs/2602.19171v4)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
