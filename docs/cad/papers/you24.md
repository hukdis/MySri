---
id: cad-ref-you24
title: Img2CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3757377.3763891'
  - 'https://arxiv.org/abs/2408.01437v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Img2CAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · You24 · 2024-07-19 · 方法研究

## 论文信息

- **全名**：Img2CAD: Reverse Engineering 3D CAD Models from Images through VLM-Assisted Conditional Factorization
- **作者**：Yang You、Mikaela Angelina Uy、Jiaqi Han、Rahul Thomas、Haotong Zhang、Yi Du、Hansheng Chen、Francis Engelmann、Suya You、Leonidas Guibas
- **时间依据**：arXiv首次提交
- **正式发表记录**：2025-12-14；Proceedings of the SIGGRAPH Asia 2025 Conference Papers
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

图像提供待恢复对象的观测。



## 贡献简介

- 将图像反演分成离散基础结构预测和连续属性装配，用VLM的语义能力引导前一阶段。它构建常见物体的CAD标注来连接野外图像与程序化形状。该因子化路线与直接逐词生成完整代码属于不同方法范式。

## 独立标签

- **输入**：图像

- **表示**：CAD程序

- **方法**：视觉语言模型

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.1145/3757377.3763891)
- [原始来源 2](https://arxiv.org/abs/2408.01437v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
