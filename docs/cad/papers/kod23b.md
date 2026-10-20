---
id: cad-ref-kod23b
title: ReparamCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 程序变换
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3610548.3618219'
  - 'https://arxiv.org/abs/2306.03217v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# ReparamCAD


## 论文信息

- **全名**：Zero-shot CAD Program Re-Parameterization for Interactive Manipulation
- **作者**：Milin Kodnongbua、Benjamin T. Jones、Maaz Bin Safeer Ahmad、Vladimir G. Kim、Adriana Schulz
- **论文时间**：2023-06-05（arXiv首次提交）
- **正式发表记录**：2023-12-10；SIGGRAPH Asia 2023 Conference Papers
- **版本说明**：索引题名与当前原文题名不同，保留索引题名供检索。

## 任务定位

研究任务：[CAD编辑](/cad/tasks/editing)。

重新参数化已有程序以支持有意义的交互修改。

## 方法与贡献

- 利用预训练语言和图像模型推断有意义的设计变化轴，再把这些变化写成受约束的重新参数化程序。它从理解现有程序的设计空间切入语言辅助编辑。所推断的语义约束需要验证，不能认为任何模型的原设计意图都能唯一恢复。

## 技术要点

- **输入**：已有CAD · 文本

- **表示**：CAD程序

- **方法**：程序变换

- **对象**：零件

- **要求**：可编辑性

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3610548.3618219)
- [原始来源 2](https://arxiv.org/abs/2306.03217v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
