---
id: cad-ref-liu25b
title: HoLa
category: cad
type: paper
tags:
  - 论文资料记录
  - 潜空间生成
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3730842'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# HoLa


## 论文信息

- **全名**：HoLa: B-Rep Generation using a Holistic Latent Representation
- **作者**：Yilin Liu、Duoteng Xu、Xingyao Yu、Xiang Xu、Daniel Cohen-Or、Hao Zhang、Hui Huang
- **论文时间**：2025-07-27（正式/机构年份记录）
- **正式发表记录**：2025-07-27；ACM Transactions on Graphics

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

整体B-Rep潜表示的生成方法，保留条件恢复次入口。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 方法与贡献

- 把表面几何与其交线关系放进整体潜空间，通过学习交线来连接几何与拓扑。它减少将B-Rep拆成多阶段独立预测带来的不一致，并支持多种条件输入。该路线改善边界生成，参数化历史的可编辑性仍需另外验证。

## 技术要点

- **输入**：图像

- **表示**：B-Rep

- **方法**：潜空间生成

- **对象**：零件

- **要求**：几何 · 拓扑

## 关联资源与问题

问题：[I-C-02](/cad/issues/i-c-02) · [I-F-03](/cad/issues/i-f-03)。

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3730842)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
