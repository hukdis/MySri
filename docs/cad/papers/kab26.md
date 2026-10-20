---
id: cad-ref-kab26
title: CADENA · 逐步重建与中间观察
category: cad
type: paper
tags:
  - 论文资料记录
  - 执行反馈
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2608.00799'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADENA · 逐步重建与中间观察


## 论文信息

- **全名**：CADENA: Stepwise CAD Reverse Engineering
- **作者**：Kabisov, Soslan、Savrasov, Gennadiy、Elistratov, Maksim、Rodriguez, Antonio、Ignatiev, Daniil、Gavrilov, Nikita、Uzdenov, Rustam、Boyko, Alexey I.、Pasechnik, Igor、Konushin, Anton、Kuznetsov, Andrey、Zhemchuzhnikov, Dmitrii
- **论文时间**：2026-08-01（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

以目标和中间几何为条件逐步恢复零件，另有基准贡献。

## 方法与贡献

- 针对一次性生成整段CAD程序难以观察中间几何的问题，按建模操作逐步构造，并比较目标与当前形状。它同时发布机械零件反向工程评测CADENA-Bench，按零件家族报告结果，补充草图拉伸数据之外的几何。当前公开卡片保留3,396个去重评测零件，名为train的Hub划分不应被误当作可用于方法训练的标准训练集。

## 技术要点

- **输入**：图像 · 目标几何

- **表示**：CAD程序

- **方法**：执行反馈

- **对象**：零件

- **要求**：几何

## 关联资源与问题

资源：[CADENA-Bench](/cad/datasets/ds_cadenabench)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2608.00799)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
