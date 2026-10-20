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
updated: '2026-10-20'
cadRecord: true
---
# CADSmith


## 论文信息

- **全名**：CADSmith: Multi-Agent CAD Generation with Programmatic Geometric Validation
- **作者**：Jesse Barkley、Rumi Loghmani、Amir Barati Farimani
- **论文时间**：2026-03-27（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

多代理生成新设计，以测量和视图作验证机制。

## 方法与贡献

- 设置执行错误与几何要求两个纠正循环，结合CAD内核测量、视觉检查和API文档检索生成代码。它将数值几何反馈与整体形状判断结合。基准规模和复杂度边界应单独核对，不把自定义测试表现推广到全部工业CAD。

## 技术要点

- **输入**：文本

- **表示**：CAD程序

- **方法**：代理 · 执行反馈 · 视觉语言模型

- **对象**：零件

- **要求**：几何 · 规格验证

## 关联资源与问题

问题：[I-E-01](/cad/issues/i-e-01)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2603.26512)
- [原始来源 2](https://arxiv.org/abs/2603.26512v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
