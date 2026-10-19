---
id: cad-ref-gua25
title: CAD-Coder · Guan
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 强化学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2505.19713'
  - 'https://arxiv.org/abs/2505.19713v3'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CAD-Coder · Guan

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Gua25 · 2025-05-26 · 方法研究

## 论文信息

- **全名**：CAD-Coder: Text-to-CAD Generation with Chain-of-Thought and Geometric Reward
- **作者**：Yandong Guan、Xilin Wang、Ximing Xing、Jing Zhang、Dong Xu、Qian Yu
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；Advances in Neural Information Processing Systems 38 (NeurIPS 2025), pp. 59765-59789
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

文本需求到程序，并用几何奖励训练。



## 贡献简介

- 以CadQuery脚本表达文本到CAD任务，结合监督学习、几何奖励和规划式推理。它把程序执行和几何相似度纳入后训练信号。几何奖励能改善部分错误，但不能自动覆盖编辑保持或所有设计意图。

## 独立标签

- **输入**：文本

- **表示**：CadQuery

- **方法**：语言模型 · 强化学习

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2505.19713)
- [原始来源 2](https://arxiv.org/abs/2505.19713v3)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
