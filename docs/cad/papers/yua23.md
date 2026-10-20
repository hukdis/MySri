---
id: cad-ref-yua23
title: CADTalk
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 视觉语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR52733.2024.00360'
  - 'https://doi.org/10.1109/cvpr52733.2024.00360'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADTalk


## 论文信息

- **全名**：CADTalk: An Algorithm and Benchmark for Semantic Commenting of CAD Programs
- **作者**：Haocheng Yuan、Jing Xu、Hao Pan、Adrien Bousseau、Niloy J. Mitra、Changjian Li
- **论文时间**：2024-06-16（正式/机构年份记录）
- **正式发表记录**：2024-06-16；2024 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

对已有程序的部件赋予语义注释。

## 方法与贡献

- 给CAD程序划分具有语义意义的代码块并赋予部件标签，结合程序执行与视觉语义分析。它补充裸程序缺少注释和可理解结构的问题。语义标注有助于编辑定位，但论文任务本身不是完整语言编辑。

## 技术要点

- **输入**：CAD程序 · 图像

- **表示**：CAD程序

- **方法**：语言模型 · 视觉语言模型

- **对象**：零件

- **要求**：语义理解

## 相关研究

### R11 · 相关基础

[CADTalk](/cad/papers/yua23) → [CADReview / ReCAD](/cad/cadreview)

CADReview的辅助学习数据使用CADTalk来源；这里只记录数据关系。

原文位置：Che25 §4.1.1，第5页；附录B。

## 关联资源与问题

资源：[CADTalk语义注释数据](/cad/datasets/ds_cadtalk)。

## 参考文献

- [原始来源 1](https://doi.org/10.1109/CVPR52733.2024.00360)
- [原始来源 2](https://doi.org/10.1109/cvpr52733.2024.00360)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
