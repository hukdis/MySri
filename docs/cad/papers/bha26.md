---
id: cad-ref-bha26
title: MM-CAD · 跨模态几何检索
category: cad
type: paper
tags:
  - 论文资料记录
  - 表示学习
  - 检索增强
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1111/cgf.70523'
  - 'https://api.crossref.org/works/10.1111%2Fcgf.70523'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# MM-CAD · 跨模态几何检索


## 论文信息

- **全名**：MM‐CAD: A Multi‐Modal CAD Dataset and Benchmark for Cross‐Modal Geometric Learning
- **作者**：Anush Bharathi、Ananthakrishnan A、Ramanathan Muthuganapathy
- **论文时间**：2026-08-13（正式/机构年份记录）
- **正式发表记录**：2026-08-13；Computer Graphics Forum

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

主要任务是跨模态几何检索，并贡献组织后的数据。

## 方法与贡献

- 针对CAD模型检索缺少统一多模态组织的问题，汇总多个基准并构造来自ABC的语义组织子集，配对文本、草图、图像、点云等信号。它将去重之外的语义邻域与难负例用于跨模态检索，并通过共享表征连接多种几何输入。该论文主要研究检索与检索增强基础，不能把检索分数当作CAD生成质量；截至本次核查尚未确认完整数据下载入口。

## 技术要点

- **输入**：文本 · 草图 · 图像 · 点云

- **表示**：B-Rep

- **方法**：表示学习 · 检索增强

- **对象**：零件

- **要求**：检索

## 关联资源与问题

资源：[MM-CAD](/cad/datasets/ds_mmcad)。

问题：[I-G-03](/cad/issues/i-g-03)。

## 参考文献

- [原始来源 1](https://doi.org/10.1111/cgf.70523)
- [原始来源 2](https://api.crossref.org/works/10.1111%2Fcgf.70523)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
