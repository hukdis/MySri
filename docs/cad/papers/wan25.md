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
updated: '2026-10-20'
cadRecord: true
---
# CADFusion · 序列学习与视觉反馈


## 论文信息

- **全名**：Text-to-CAD Generation Through Infusing Visual Feedback in Large Language Models
- **作者**：Wang, Ruiyu、Yuan, Yu、Sun, Shizhao、Bian, Jiang
- **论文时间**：2025-01-31（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

文本生成以视觉偏好后训练改善结果；不把训练反馈写成推理执行闭环。

## 方法与贡献

- 针对正确命令序列与视觉上合适的设计不完全一致的问题，交替进行序列监督学习和视觉反馈训练。它让LLM学习可执行的CAD序列，并利用视觉偏好信号调整生成；官方仓库同时提供文本标注、数据转换及视觉反馈样例。该路线的视觉反馈属于训练机制，不等同于推理时逐步执行修复，复用其数据还需要对齐SkexGen/DeepCAD模型标识。

## 技术要点

- **输入**：文本

- **表示**：命令序列

- **方法**：监督微调 · 强化学习

- **对象**：零件

- **要求**：几何

## 关联资源与问题

资源：[CADFusion文本标注与视觉反馈样例](/cad/datasets/ds_cadfusion)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2501.19054)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
