---
id: cad-ref-gan21
title: CAD as Language
category: cad
type: paper
tags:
  - 论文资料记录
  - 自回归
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2105.02769'
  - 'https://arxiv.org/abs/2105.02769v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CAD as Language

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Gan21 · 2021-05-06 · 方法研究

## 论文信息

- **全名**：Computer-Aided Design as Language
- **作者**：Yaroslav Ganin、Sergey Bartunov、Yujia Li、Ethan Keller、Stefano Saliceti
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

以工程草图语言建模和生成为主，并有图像条件恢复任务。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 贡献简介

- 把二维CAD草图序列化为可由通用语言建模技术处理的记录，探索无条件生成和图像到草图翻译。它表明CAD结构也可以作为一种形式语言学习。这里的语言建模不能直接理解为自然语言指令驱动的三维零件生成。

## 独立标签

- **输入**：图像

- **表示**：命令序列

- **方法**：自回归

- **对象**：草图

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2105.02769)
- [原始来源 2](https://arxiv.org/abs/2105.02769v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
