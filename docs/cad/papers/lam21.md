---
id: cad-ref-lam21
title: BRepNet
category: cad
type: paper
tags:
  - 论文资料记录
  - 图网络
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR46437.2021.01258'
  - 'https://doi.org/10.1109/cvpr46437.2021.01258'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# BRepNet

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Lam21 · 2021-06 · 方法研究

## 论文信息

- **全名**：BRepNet: A topological message passing system for solid models
- **作者**：Joseph G. Lambourne、Karl D. D. Willis、Pradeep Kumar Jayaraman、Aditya Sanghi、Peter Meltzer、Hooman Shayani
- **时间依据**：正式/机构年份记录
- **正式发表记录**：2021-06；2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD理解、评估与规划](/cad/tasks/analysis)。

拓扑消息传递服务于实体理解，而非直接生成。



## 贡献简介

- 沿B-Rep中的共边等拓扑连接定义消息传递，学习实体中面和边的结构特征。它利用CAD内核已有连接关系组织卷积，而不只依赖离散点云。论文主要面向实体理解，不能把它标成自然语言建模系统。

## 独立标签

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：图网络

- **对象**：零件

- **要求**：分割

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：[Fusion 360 Gallery · Segmentation](/cad/datasets/ds_f360_segmentation)。

问题：[I-F-02](/cad/issues/i-f-02)。

## 原始来源

- [原始来源 1](https://doi.org/10.1109/CVPR46437.2021.01258)
- [原始来源 2](https://doi.org/10.1109/cvpr46437.2021.01258)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
