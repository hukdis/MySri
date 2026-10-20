---
id: cad-ref-don26b
title: AssemCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2607.05123'
  - 'https://arxiv.org/abs/2607.05123v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# AssemCAD


## 论文信息

- **全名**：ASSEMCAD: Production-Ready CAD Assembly Generation from Natural Language
- **作者**：Yurui Dong、Shu Zou、Siqi Li、Nianchen Deng、Hongbin Zhou、Xuemeng Yang、Pinlong Cai、Licheng Wen、Xinyu Cai、Botian Shi
- **论文时间**：2026-07-06（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

由结构化文本规格构造带可执行配合的装配。

## 方法与贡献

- 将文本装配需求表达成带类型零件、几何接口和可执行配合的规格，再由确定性装配库实现。它把装配从单段代码生成推进到结构化工程关系和几何证据。生产可用性的主张仍需按具体基准、工程公理和支持接口判断。

## 技术要点

- **输入**：文本

- **表示**：DSL · B-Rep

- **方法**：语言模型 · 约束求解

- **对象**：装配

- **要求**：装配 · 约束

## 关联资源与问题

问题：[I-H-02](/cad/issues/i-h-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2607.05123)
- [原始来源 2](https://arxiv.org/abs/2607.05123v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
