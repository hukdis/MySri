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
updated: '2026-10-20'
cadRecord: true
---
# BRepNet


## 论文信息

- **全名**：BRepNet: A topological message passing system for solid models
- **作者**：Joseph G. Lambourne、Karl D. D. Willis、Pradeep Kumar Jayaraman、Aditya Sanghi、Peter Meltzer、Hooman Shayani
- **论文时间**：2021-06（正式/机构年份记录）
- **正式发表记录**：2021-06；2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

拓扑消息传递服务于实体理解，而非直接生成。

## 方法与贡献

- 沿B-Rep中的共边等拓扑连接定义消息传递，学习实体中面和边的结构特征。它利用CAD内核已有连接关系组织卷积，而不只依赖离散点云。论文主要面向实体理解，不能把它标成自然语言建模系统。

## 技术要点

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：图网络

- **对象**：零件

- **要求**：分割

## 关联资源与问题

资源：[Fusion 360 Gallery · Segmentation](/cad/datasets/ds_f360_segmentation)。

问题：[I-F-02](/cad/issues/i-f-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.1109/CVPR46437.2021.01258)
- [原始来源 2](https://doi.org/10.1109/cvpr46437.2021.01258)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
