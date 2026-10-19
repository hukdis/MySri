---
id: cad-ref-drawings26
title: DrawingsDreamer
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
prerequisites: []
related: []
sources:
  - 'https://neurips.cc/virtual/2026/poster/149006'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# DrawingsDreamer

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Drawings26 · 2026 · 方法研究

## 论文信息

- **全名**：DrawingsDreamer: A Unified Multi-View Engineering Drawings Generation Model
- **作者**：Shurui Liu、Weide Chen、Changwang Yi、Ancong Wu
- **时间依据**：官方会议年份；首次公开日期未核实，不参与精确月份先后判断
- **正式发表记录**：2026；NeurIPS 2026
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

生成多视图矢量工程图并研究结构修复；对象标签明确为工程图。

其他任务：[CAD编辑](/cad/tasks/editing)

## 贡献简介

- 把多视图矢量工程图编码成精简序列，以层次后缀表示和课程训练维护局部几何及视图对应。它同时研究结构修复与生成。输出是矢量工程图而不是三维CAD程序，属于表示与绘图扩展分支。

## 独立标签

- **输入**：图纸

- **表示**：矢量图纸

- **方法**：自回归

- **对象**：工程图

- **要求**：跨视图一致性

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://neurips.cc/virtual/2026/poster/149006)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
