---
id: cad-ref-jia26b
title: Canonical Region Graph
category: cad
type: paper
tags:
  - 论文资料记录
  - 表示学习
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.11573v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Canonical Region Graph


## 论文信息

- **全名**：Learn the Solid, Not the File: Canonical Inputs for Neural Networks on CAD Boundary Representations
- **作者**：Heinrich Jiang、Hager Yasser Mohamed、Alexander Hitt、Valeriia Lomakina、Henning Jiang、Jennifer Jang
- **论文时间**：2026-09-10（arXiv首次提交）

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

规范输入改善CAD表征理解的稳健性，不恢复历史。

## 方法与贡献

- 指出同一实体可能因建模、重建或导出得到不同B-Rep，导致现有编码器对文件表示变化不稳。它用来自实体本身的规范区域图和坐标系减少这种变化影响，并讨论不变性。该工作主要处理表示学习可靠性，不恢复参数化构造历史。

## 技术要点

- **输入**：B-Rep

- **表示**：规范区域图

- **方法**：表示学习

- **对象**：零件

- **要求**：表示不变性

## 关联资源与问题

问题：[I-F-02](/cad/issues/i-f-02) · [I-G-04](/cad/issues/i-g-04)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.11573v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
