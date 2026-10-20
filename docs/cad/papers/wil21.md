---
id: cad-ref-wil21
title: CurveGen / TurtleGen
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPRW53098.2021.00239'
  - 'https://arxiv.org/abs/2104.09621v1'
  - 'https://doi.org/10.1109/cvprw53098.2021.00239'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CurveGen / TurtleGen


## 论文信息

- **全名**：Engineering Sketch Generation for Computer-Aided Design
- **作者**：Karl D. D. Willis、Pradeep Kumar Jayaraman、Joseph G. Lambourne、Hang Chu、Yewen Pu
- **论文时间**：2021-04-19（arXiv首次提交）
- **正式发表记录**：2021-06；2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops (CVPRW)

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

CurveGen与TurtleGen生成工程草图。

## 方法与贡献

- 提出两种工程草图生成方式，以曲线或构造序列表示图元，并显式考虑下游拓扑使用。它提供不依赖草图约束求解器的生成路线。SkexGen原文明确借鉴TurtleGen表示，但其他草图模型与它可能只是比较关系。

## 技术要点

- **表示**：曲线 · 命令序列

- **方法**：自回归

- **对象**：草图

- **要求**：几何

## 相关研究

### R02 · 相关基础

[CurveGen / TurtleGen](/cad/papers/wil21) → [SkexGen](/cad/papers/xu22)

SkexGen明确借鉴TurtleGen的表示，再做表达与学习方面的调整。

原文位置：Xu22 §3，PDF第2页。

## 参考文献

- [原始来源 1](https://doi.org/10.1109/CVPRW53098.2021.00239)
- [原始来源 2](https://arxiv.org/abs/2104.09621v1)
- [原始来源 3](https://doi.org/10.1109/cvprw53098.2021.00239)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
