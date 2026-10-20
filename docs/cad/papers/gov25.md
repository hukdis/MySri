---
id: cad-ref-gov25
title: CADmium
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2507.09792'
  - 'https://arxiv.org/abs/2507.09792v3'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADmium


## 论文信息

- **全名**：CADmium: Fine-Tuning Code Language Models for Text-Driven Sequential CAD Design
- **作者**：Prashant Govindarajan、Davide Baldelli、Jay Pathak、Quentin Fournier、Sarath Chandar
- **论文时间**：2025-07-13（arXiv首次提交）
- **正式发表记录**：；Transactions on Machine Learning Research (TMLR) 01/2026; https://openreview.net/forum?id=lExqWvQht8

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

从文本创建JSON式建模序列。

## 方法与贡献

- 构建文本描述与CAD序列配对，并微调代码语言模型生成JSON形式的建模序列。它同时补充几何与拓扑评价，以更细地观察生成质量。合成描述质量和跨数据泛化仍需结合具体划分判断。

## 技术要点

- **输入**：文本

- **表示**：命令序列

- **方法**：语言模型

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2507.09792)
- [原始来源 2](https://arxiv.org/abs/2507.09792v3)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
