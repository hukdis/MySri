---
id: cad-ref-ata26
title: Zero-to-CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 执行反馈
  - 数据合成
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2604.24479'
  - 'https://arxiv.org/abs/2604.24479v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Zero-to-CAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Ata26 · 2026-04-27 · 方法研究

## 论文信息

- **全名**：Zero-to-CAD: Agentic Synthesis of Interpretable CAD Programs at Million-Scale Without Real Data
- **作者**：Mohammadmehdi Ataei、Farzaneh Askari、Kamal Rahimi Malekshan、Pradeep Kumar Jayaraman
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

合成可执行CAD程序数据是核心方法，生成数据用于后续视觉重建。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 贡献简介

- 把CAD程序合成组织为生成、执行、验证和文档查询的代理搜索，生产可执行构造历史数据。它扩展了历史序列与操作类型的数据来源，并用合成数据支持后续视觉重建。合成数据的可执行性不能独立证明对真实工业设计的泛化。

## 独立标签

- **输入**：文本

- **表示**：CAD程序

- **方法**：代理 · 执行反馈 · 数据合成

- **对象**：零件

- **要求**：构造历史

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：[Zero-to-CAD 1M](/cad/datasets/ds_zerocad_1m) · [Zero-to-CAD 100K](/cad/datasets/ds_zerocad_100k)。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2604.24479)
- [原始来源 2](https://arxiv.org/abs/2604.24479v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
