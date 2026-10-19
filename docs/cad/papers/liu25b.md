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
updated: '2026-10-19'
cadRecord: true
---
# HoLa

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Liu25b · 2025-07-27 · 方法研究

## 论文信息

- **全名**：HoLa: B-Rep Generation using a Holistic Latent Representation
- **作者**：Yilin Liu、Duoteng Xu、Xingyao Yu、Xiang Xu、Daniel Cohen-Or、Hao Zhang、Hui Huang
- **时间依据**：正式/机构年份记录
- **正式发表记录**：2025-07-27；ACM Transactions on Graphics
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

整体B-Rep潜表示的生成方法，保留条件恢复次入口。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 贡献简介

- 把表面几何与其交线关系放进整体潜空间，通过学习交线来连接几何与拓扑。它减少将B-Rep拆成多阶段独立预测带来的不一致，并支持多种条件输入。该路线改善边界生成，参数化历史的可编辑性仍需另外验证。

## 独立标签

- **输入**：图像

- **表示**：B-Rep

- **方法**：潜空间生成

- **对象**：零件

- **要求**：几何 · 拓扑

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-C-02](/cad/issues/i-c-02) · [I-F-03](/cad/issues/i-f-03)。

## 原始来源

- [原始来源 1](https://doi.org/10.1145/3730842)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
