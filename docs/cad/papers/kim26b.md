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
updated: '2026-10-19'
cadRecord: true
---
# BrepCoder

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Kim26b · 2026-02-25 · 方法研究

## 论文信息

- **全名**：BrepCoder: A Unified Multimodal Large Language Model for Multi-task B-rep Reasoning
- **作者**：Mingi Kim、Yongjun Kim、Jungwoo Kang、Hyungki Kim
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

先由B-Rep学习逆向建模，并扩展补全、纠正与问答。

其他任务：[CAD编辑](/cad/tasks/editing) · [CAD理解、评估与规划](/cad/tasks/analysis)

## 贡献简介

- 把B-Rep输入对齐到Python式建模代码，先学习逆向建模，再扩展到补全、错误纠正和问答。它尝试在一个多模态模型中共享多种CAD任务能力。任务统一仍需检查数据和支持操作，不能自动解释为通用工业设计代理。

## 独立标签

- **输入**：B-Rep

- **表示**：CAD程序

- **方法**：视觉语言模型

- **对象**：零件

- **要求**：构造历史 · 可编辑性

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2602.22284)
- [原始来源 2](https://arxiv.org/abs/2602.22284v3)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
