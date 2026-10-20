---
id: cad-ref-wel26
title: DFM-Redesign
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 执行反馈
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.05559'
  - 'https://arxiv.org/abs/2609.05559v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# DFM-Redesign


## 论文信息

- **全名**：LLM-Aided Design for Manufacturing: A Multi-Agent System for Intent-Preserving Redesign of CAD for Improved Manufacturability
- **作者**：Kojo Welbeck、Xiangyu Shi、Zahra Sadeghi、Qi Zhu、Ping Guo
- **论文时间**：2026-09-03（arXiv首次提交）

## 任务定位

研究任务：[CAD编辑](/cad/tasks/editing)。

针对已有CAD作制造性审查和重设计。

其他任务：[CAD理解、评估与规划](/cad/tasks/analysis)

## 方法与贡献

- 把可制造性审查与CAD修改分成两个代理，通过小步编译和视觉验证累积设计变更。它强调每次修改应保留设计意图而非一次生成整个复杂零件。论文明确完整审查重设计回路及意图保持的操作性评价仍在进行，不能提前写成已经证实。

## 技术要点

- **输入**：已有CAD

- **表示**：CAD程序

- **方法**：代理 · 执行反馈

- **对象**：零件

- **要求**：制造 · 内容保持

## 关联资源与问题

问题：[I-H-03](/cad/issues/i-h-03)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.05559)
- [原始来源 2](https://arxiv.org/abs/2609.05559v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
