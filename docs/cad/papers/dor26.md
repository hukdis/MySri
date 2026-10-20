---
id: cad-ref-dor26
title: CADBench
category: cad
type: paper
tags:
  - 论文资料记录
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2605.10873'
  - 'https://arxiv.org/abs/2605.10873v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADBench


## 论文信息

- **全名**：CADBench: A Multimodal Benchmark for AI-Assisted CAD Program Generation
- **作者**：Anna C. Doris、Jacob Thomas Sony、Ghadi Nehme、Era Syla、Amin Heyrani Nobari、Faez Ahmed
- **论文时间**：2026-05-11（arXiv首次提交）

## 任务定位

研究任务：共用基础。

多模态程序重建基准，独立于BenchCAD。

## 方法与贡献

- 在多个基准族和输入模态上统一评价CAD程序重建，分别观察几何保真、可执行性和程序紧凑性。它揭示复杂度、模态迁移和不同指标会改变方法表现。它与BenchCAD是不同基准，不能合并样本量或结论。

## 技术要点

- **输入**：文本 · 图像

- **要求**：几何 · 可执行性

## 相关研究

### R14 · 相关基础

[CADBench](/cad/papers/dor26) → [CADForge](/cad/papers/lu26g)

CADForge沿用CADBench的部分数据处理协议，非继承其模型。

原文位置：Lu26g Appendix B.1，PDF第14页。

## 关联资源与问题

资源：[CADBench（DeCoDELab）](/cad/datasets/ds_cadbench)。

问题：[I-G-02](/cad/issues/i-g-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2605.10873)
- [原始来源 2](https://arxiv.org/abs/2605.10873v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
