---
id: cad-ref-guo22
title: ComplexGen
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3528223.3530078'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# ComplexGen


## 论文信息

- **全名**：ComplexGen
- **作者**：Haoxiang Guo、Shilin Liu、Hao Pan、Yang Liu、Xin Tong、Baining Guo
- **论文时间**：2022-07（正式/机构年份记录）
- **正式发表记录**：2022-07；ACM Transactions on Graphics

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

从点云联合恢复曲面、边和拓扑。

## 方法与贡献

- 从点云预测CAD边界的点、曲线、曲面及其拓扑联系，用结构化方式组织B-Rep恢复。它将几何拟合与拓扑关系同时纳入重建。输出为边界表示，恢复原始建模历史仍是另一项任务。

## 技术要点

- **输入**：点云

- **表示**：B-Rep

- **方法**：监督学习

- **对象**：零件

- **要求**：几何 · 拓扑

## 关联资源与问题

问题：[I-B-02](/cad/issues/i-b-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3528223.3530078)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
