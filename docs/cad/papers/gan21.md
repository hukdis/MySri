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
updated: '2026-10-20'
cadRecord: true
---
# CAD as Language


## 论文信息

- **全名**：Computer-Aided Design as Language
- **作者**：Yaroslav Ganin、Sergey Bartunov、Yujia Li、Ethan Keller、Stefano Saliceti
- **论文时间**：2021-05-06（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

以工程草图语言建模和生成为主，并有图像条件恢复任务。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 方法与贡献

- 把二维CAD草图序列化为可由通用语言建模技术处理的记录，探索无条件生成和图像到草图翻译。它表明CAD结构也可以作为一种形式语言学习。这里的语言建模不能直接理解为自然语言指令驱动的三维零件生成。

## 技术要点

- **输入**：图像

- **表示**：命令序列

- **方法**：自回归

- **对象**：草图

- **要求**：几何

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2105.02769)
- [原始来源 2](https://arxiv.org/abs/2105.02769v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
