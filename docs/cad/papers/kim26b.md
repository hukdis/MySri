---
id: cad-ref-kim26b
title: BrepCoder
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2602.22284'
  - 'https://arxiv.org/abs/2602.22284v3'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# BrepCoder


## 论文信息

- **全名**：BrepCoder: A Unified Multimodal Large Language Model for Multi-task B-rep Reasoning
- **作者**：Mingi Kim、Yongjun Kim、Jungwoo Kang、Hyungki Kim
- **论文时间**：2026-02-25（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

先由B-Rep学习逆向建模，并扩展补全、纠正与问答。

其他任务：[CAD编辑](/cad/tasks/editing) · [CAD理解、评估与规划](/cad/tasks/analysis)

## 方法与贡献

- 把B-Rep输入对齐到Python式建模代码，先学习逆向建模，再扩展到补全、错误纠正和问答。它尝试在一个多模态模型中共享多种CAD任务能力。任务统一仍需检查数据和支持操作，不能自动解释为通用工业设计代理。

## 技术要点

- **输入**：B-Rep

- **表示**：CAD程序

- **方法**：视觉语言模型

- **对象**：零件

- **要求**：构造历史 · 可编辑性

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2602.22284)
- [原始来源 2](https://arxiv.org/abs/2602.22284v3)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
