---
id: cad-ref-bar26
title: CADSmith
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 执行反馈
  - 视觉语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2603.26512'
  - 'https://arxiv.org/abs/2603.26512v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADSmith

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Bar26 · 2026-03-27 · 方法研究

## 论文信息

- **全名**：CADSmith: Multi-Agent CAD Generation with Programmatic Geometric Validation
- **作者**：Jesse Barkley、Rumi Loghmani、Amir Barati Farimani
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

多代理生成新设计，以测量和视图作验证机制。



## 贡献简介

- 设置执行错误与几何要求两个纠正循环，结合CAD内核测量、视觉检查和API文档检索生成代码。它将数值几何反馈与整体形状判断结合。基准规模和复杂度边界应单独核对，不把自定义测试表现推广到全部工业CAD。

## 独立标签

- **输入**：文本

- **表示**：CAD程序

- **方法**：代理 · 执行反馈 · 视觉语言模型

- **对象**：零件

- **要求**：几何 · 规格验证

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-E-01](/cad/issues/i-e-01)。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2603.26512)
- [原始来源 2](https://arxiv.org/abs/2603.26512v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
