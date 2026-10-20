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
updated: '2026-10-20'
cadRecord: true
---
# DrawingsDreamer


## 论文信息

- **全名**：DrawingsDreamer: A Unified Multi-View Engineering Drawings Generation Model
- **作者**：Shurui Liu、Weide Chen、Changwang Yi、Ancong Wu
- **论文时间**：2026（官方会议年份；首次公开日期未核实，不参与精确月份先后判断）
- **正式发表记录**：2026；NeurIPS 2026

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

生成多视图矢量工程图并研究结构修复；对象标签明确为工程图。

其他任务：[CAD编辑](/cad/tasks/editing)

## 方法与贡献

- 把多视图矢量工程图编码成精简序列，以层次后缀表示和课程训练维护局部几何及视图对应。它同时研究结构修复与生成。输出是矢量工程图而不是三维CAD程序，属于表示与绘图扩展分支。

## 技术要点

- **输入**：图纸

- **表示**：矢量图纸

- **方法**：自回归

- **对象**：工程图

- **要求**：跨视图一致性

## 参考文献

- [原始来源 1](https://neurips.cc/virtual/2026/poster/149006)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
