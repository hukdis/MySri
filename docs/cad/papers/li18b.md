---
id: cad-ref-li18b
title: 监督几何基元拟合
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR.2019.00276'
  - 'https://doi.org/10.1109/cvpr.2019.00276'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# 监督几何基元拟合


## 论文信息

- **全名**：Supervised Fitting of Geometric Primitives to 3D Point Clouds
- **作者**：Lingxiao Li、Minhyuk Sung、Anastasia Dubrovina、Li Yi、Leonidas J. Guibas
- **论文时间**：2019-06（正式/机构年份记录）
- **正式发表记录**：2019-06；2019 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

从点云拟合目标解析基元。

## 方法与贡献

- 联合学习点云分割和几何基元参数，为平面、圆柱等结构的精确拟合建立可训练流程。它把逆向CAD的一部分拆成基元识别和参数恢复。拟合出的曲面或基元还需要额外步骤才能形成完整可编辑历史。

## 技术要点

- **输入**：点云

- **表示**：参数曲面

- **方法**：监督学习

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.1109/CVPR.2019.00276)
- [原始来源 2](https://doi.org/10.1109/cvpr.2019.00276)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
