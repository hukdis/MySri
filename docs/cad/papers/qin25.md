---
id: cad-ref-qin25
title: Drawing2CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3746027.3755782'
  - 'https://arxiv.org/abs/2508.18733v5'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Drawing2CAD


## 论文信息

- **全名**：Drawing2CAD: Sequence-to-Sequence Learning for CAD Generation from Vector Drawings
- **作者**：Feiwei Qin、Shichao Lu、Junhao Hou、Changmiao Wang、Meie Fang、Ligang Liu
- **论文时间**：2025-08-26（arXiv首次提交）
- **正式发表记录**：2025-10-27；Proceedings of the 33rd ACM International Conference on Multimedia

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

向量工程图描述指定对象，任务是恢复其CAD。

## 方法与贡献

- 直接将矢量工程图基元翻译为参数化CAD操作，分开解码命令类型与参数，并建立图纸与模型配对数据。它保留矢量输入的精度，区别于先将图纸当成普通照片的路线。矢量工程图、手绘草图和栅格正投影图的输入假设不能混用。

## 技术要点

- **输入**：图纸

- **表示**：命令序列

- **方法**：监督学习

- **对象**：零件

- **要求**：几何

## 关联资源与问题

资源：[CAD-VGDrawing / Drawing2CAD](/cad/datasets/ds_drawing2cad)。

问题：[I-B-01](/cad/issues/i-b-01)。

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3746027.3755782)
- [原始来源 2](https://arxiv.org/abs/2508.18733v5)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
