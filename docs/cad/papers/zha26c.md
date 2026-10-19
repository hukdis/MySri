---
id: cad-ref-zha26c
title: MIRAGE-CAD · 共享构造计划
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2608.28669'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# MIRAGE-CAD · 共享构造计划

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Zha26c · 2026-08-24 · 方法研究

## 论文信息

- **全名**：MIRAGE-CAD: Construction-Mediated Multimodal Generation of Executable CAD Programs
- **作者**：Zhan, Jizong
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

共享构造表示支持多模态恢复，文本生成保留次入口。

其他任务：[CAD生成](/cad/tasks/generation)

## 贡献简介

- 针对同一外形可能对应多种构造程序的问题，将文本、图像、点云和B-Rep输入映射到共享构造表示，再借助可读计划生成可执行CAD代码。它比较显式计划与连续表示条件，分别测量程序构建、STEP导出、几何保真与参数响应。结果支持把这些能力分开评价，而不是以某一个成功率代表全部编辑质量；本节点未进行独立复现。

## 独立标签

- **输入**：文本 · 图像 · 点云 · B-Rep

- **表示**：中间表示 · CAD程序

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

- [原始来源 1](https://arxiv.org/abs/2608.28669)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
