---
id: cad-ref-sun26
title: LLM4CAD-Editor
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 监督微调
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2606.20607'
  - 'https://arxiv.org/abs/2606.20607v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# LLM4CAD-Editor


## 论文信息

- **全名**：LLM4CAD-Editor: An Intent-Aware Large Language Model Framework for Multi-Level Computer-Aided Design Editing
- **作者**：Yuewan Sun、Zhenghui Sha
- **论文时间**：2026-05-21（arXiv首次提交）

## 任务定位

研究任务：[CAD编辑](/cad/tasks/editing)。

给定已有特征程序执行多层次指令编辑。

## 方法与贡献

- 通过带名称的特征级DSL表达CAD，并构造原程序、指令与修改后程序的编辑数据。它区分参数、操作和功能层次的修改，减少纯坐标定位的脆弱性。复杂增删组合和连续多轮编辑仍是论文提出的后续问题。

## 技术要点

- **输入**：文本 · 已有CAD

- **表示**：DSL

- **方法**：语言模型 · 监督微调

- **对象**：零件

- **要求**：可编辑性 · 内容保持

## 关联资源与问题

问题：[I-C-01](/cad/issues/i-c-01)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2606.20607)
- [原始来源 2](https://arxiv.org/abs/2606.20607v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
