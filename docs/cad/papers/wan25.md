---
id: cad-ref-wan25
title: CADFusion · 序列学习与视觉反馈
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督微调
  - 强化学习
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2501.19054'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADFusion · 序列学习与视觉反馈

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Wan25 · 2025-01-31 · 方法研究

## 论文信息

- **全名**：Text-to-CAD Generation Through Infusing Visual Feedback in Large Language Models
- **作者**：Wang, Ruiyu、Yuan, Yu、Sun, Shizhao、Bian, Jiang
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

文本生成以视觉偏好后训练改善结果；不把训练反馈写成推理执行闭环。



## 贡献简介

- 针对正确命令序列与视觉上合适的设计不完全一致的问题，交替进行序列监督学习和视觉反馈训练。它让LLM学习可执行的CAD序列，并利用视觉偏好信号调整生成；官方仓库同时提供文本标注、数据转换及视觉反馈样例。该路线的视觉反馈属于训练机制，不等同于推理时逐步执行修复，复用其数据还需要对齐SkexGen/DeepCAD模型标识。

## 独立标签

- **输入**：文本

- **表示**：命令序列

- **方法**：监督微调 · 强化学习

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：[CADFusion文本标注与视觉反馈样例](/cad/datasets/ds_cadfusion)。

问题：未单列。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2501.19054)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
