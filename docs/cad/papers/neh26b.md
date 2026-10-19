---
id: cad-ref-neh26b
title: StepCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 搜索
  - 几何反馈
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2610.03799'
  - 'https://arxiv.org/abs/2610.03799v1'
  - 'https://neurips.cc/virtual/2026/poster/149665'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# StepCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Neh26b · 2026-10-01 · 方法研究

## 论文信息

- **全名**：StepCAD: Mesh-to-CAD Code Generation via LLM Policy and Geometry-Guided Search
- **作者**：Ghadi Nehme、Faez Ahmed
- **时间依据**：arXiv首次提交
- **正式发表记录**：2026；NeurIPS 2026
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

由目标网格和中间几何逐步恢复CAD。



## 贡献简介

- 观察目标网格与中间几何逐步预测CAD操作，再以几何引导搜索修订程序。它同时提供包含多样操作和中间状态转换的数据。检验时允许读取的目标几何信息和搜索预算必须与其他方法对齐，不能和单次图像输入直接比较。

## 独立标签

- **输入**：目标几何

- **表示**：命令序列

- **方法**：搜索 · 几何反馈

- **对象**：零件

- **要求**：几何 · 构造历史

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2610.03799)
- [原始来源 2](https://arxiv.org/abs/2610.03799v1)
- [原始来源 3](https://neurips.cc/virtual/2026/poster/149665)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
