---
id: cad-ref-wan24b
title: CAD-GPT
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1609/aaai.v39i8.32849'
  - 'https://arxiv.org/abs/2412.19663v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CAD-GPT

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Wan24b · 2024-12-27 · 方法研究

## 论文信息

- **全名**：CAD-GPT: Synthesising CAD Construction Sequence with Spatial Reasoning-Enhanced Multimodal LLMs
- **作者**：Siyu Wang、Cailian Chen、Xinyi Le、Qimin Xu、Lei Xu、Yanzhou Zhang、Jie Yang
- **时间依据**：arXiv首次提交
- **正式发表记录**：2025-04-11；Proceedings of the AAAI Conference on Artificial Intelligence
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

文本条件序列生成为主，图像恢复保留次入口。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 贡献简介

- 针对图像或文本条件生成中空间位置和草图方向难以表达的问题，设计空间展开及离散编码机制辅助多模态模型预测CAD序列。它把三维空间信息与语言特征空间对齐。结果仍受序列表示、量化和支持操作的范围影响。

## 独立标签

- **输入**：文本 · 图像

- **表示**：命令序列

- **方法**：语言模型

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.1609/aaai.v39i8.32849)
- [原始来源 2](https://arxiv.org/abs/2412.19663v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
