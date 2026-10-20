---
id: cad-ref-col22
title: Hierarchical CADNet · 加工特征识别
category: cad
type: paper
tags:
  - 论文资料记录
  - 图网络
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1016/j.cad.2022.103226'
  - 'https://api.crossref.org/works/10.1016%2Fj.cad.2022.103226'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Hierarchical CADNet · 加工特征识别


## 论文信息

- **全名**：Hierarchical CADNet: Learning from B-Reps for Machining Feature Recognition
- **作者**：Andrew R. Colligan、Trevor T. Robinson、Declan C. Nolan、Yang Hua、Weijuan Cao
- **论文时间**：2022-06（正式/机构年份记录）
- **正式发表记录**：2022-06；Computer-Aided Design

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

目标为加工特征识别，数据集贡献另关联。

## 方法与贡献

- 针对相交加工特征难以识别的问题，以层级B-Rep图同时编码曲面几何和面拓扑，再用层级图卷积识别加工特征。该工作及MFCAD++资源为从CAD边界几何预测制造语义提供非LLM基础，官方数据页列出面级标签与固定划分。识别特征不等于输出可执行加工计划，合成零件上的识别结果也不能直接代表真实工业零件表现。

## 技术要点

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：图网络

- **对象**：零件

- **要求**：识别 · 制造

## 关联资源与问题

资源：[MFCAD](/cad/datasets/ds_mfcad) · [MFCAD++](/cad/datasets/ds_mfcadpp)。

问题：[I-G-04](/cad/issues/i-g-04) · [I-H-04](/cad/issues/i-h-04)。

## 参考文献

- [原始来源 1](https://doi.org/10.1016/j.cad.2022.103226)
- [原始来源 2](https://api.crossref.org/works/10.1016%2Fj.cad.2022.103226)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
