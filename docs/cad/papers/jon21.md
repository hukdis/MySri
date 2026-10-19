---
id: cad-ref-jon21
title: AutoMate
category: cad
type: paper
tags:
  - 论文资料记录
  - 图网络
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3478513.3480562'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# AutoMate

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Jon21 · 2021-12 · 方法研究

## 论文信息

- **全名**：AutoMate
- **作者**：Benjamin Jones、Dalton Hildreth、Duowen Chen、Ilya Baran、Vladimir G. Kim、Adriana Schulz
- **时间依据**：正式/机构年份记录
- **正式发表记录**：2021-12；ACM Transactions on Graphics
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD理解、评估与规划](/cad/tasks/analysis)。

预测已有零件上的配合候选；包含配合数据资源贡献。



## 贡献简介

- 基于B-Rep拓扑和几何学习装配配合候选，并提供大规模真实装配数据。它把装配联系落实到CAD实体而非仅世界坐标中的粗位置。JoinABLe原文将它作为同期独立工作讨论，不能据时间顺序画成后者的祖先。

## 独立标签

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：图网络

- **对象**：装配

- **要求**：装配

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R15 · 独立路线

[AutoMate](/cad/papers/jon21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe称AutoMate为同期工作，比较用户指定区域的推荐与自动联合轴预测；没有方法或数据继承证据。

证据定位（来源材料记录）：JoinABLe §2，第3页；Appendix A.1.1。

## 关联资源与问题

资源：[AutoMate](/cad/datasets/ds_automate)。

问题：[I-H-01](/cad/issues/i-h-01)。

## 原始来源

- [原始来源 1](https://doi.org/10.1145/3478513.3480562)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
