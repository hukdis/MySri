---
id: cad-ref-dup24
title: TransCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
  - 几何拟合
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2407.12702'
  - 'https://arxiv.org/abs/2407.12702v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# TransCAD


## 论文信息

- **全名**：TransCAD: A Hierarchical Transformer for CAD Sequence Inference from Point Clouds
- **作者**：Elona Dupont、Kseniya Cherenkova、Dimitrios Mallis、Gleb Gusev、Anis Kacem、Djamila Aouada
- **论文时间**：2024-07-17（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

点云到CAD序列及轮廓细化。

## 方法与贡献

- 利用CAD序列层次从点云预测构造过程，并用轮廓修正器恢复草图参数。它同时提出序列层面的评价来补充纯几何距离。分层预测的结构需要与具体数据和操作范围共同理解。

## 技术要点

- **输入**：点云

- **表示**：命令序列

- **方法**：监督学习 · 几何拟合

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2407.12702)
- [原始来源 2](https://arxiv.org/abs/2407.12702v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
