---
id: cad-ref-liu23
title: Point2CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 几何拟合
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR52733.2024.00361'
  - 'https://arxiv.org/abs/2312.04962v1'
  - 'https://doi.org/10.1109/cvpr52733.2024.00361'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Point2CAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Liu23 · 2023-12-07 · 方法研究

## 论文信息

- **全名**：Point2CAD: Reverse Engineering CAD Models from 3D Point Clouds
- **作者**：Yujia Liu、Anton Obukhov、Jan Dirk Wegner、Konrad Schindler
- **时间依据**：arXiv首次提交
- **正式发表记录**：2024-06-16；2024 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

分割拟合并求交以恢复目标B-Rep。



## 贡献简介

- 从点云进行曲面分割与拟合，再恢复面之间的交线等结构以构建CAD模型。它强化了逆向工程中精确几何和边界结构的恢复。生成B-Rep不等于识别原设计者使用的唯一构造顺序。

## 独立标签

- **输入**：点云

- **表示**：B-Rep

- **方法**：几何拟合

- **对象**：零件

- **要求**：几何 · 拓扑

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-B-02](/cad/issues/i-b-02)。

## 原始来源

- [原始来源 1](https://doi.org/10.1109/CVPR52733.2024.00361)
- [原始来源 2](https://arxiv.org/abs/2312.04962v1)
- [原始来源 3](https://doi.org/10.1109/cvpr52733.2024.00361)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
