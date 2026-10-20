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
updated: '2026-10-20'
cadRecord: true
---
# MIRAGE-CAD · 共享构造计划


## 论文信息

- **全名**：MIRAGE-CAD: Construction-Mediated Multimodal Generation of Executable CAD Programs
- **作者**：Zhan, Jizong
- **论文时间**：2026-08-24（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

共享构造表示支持多模态恢复，文本生成保留次入口。

其他任务：[CAD生成](/cad/tasks/generation)

## 方法与贡献

- 针对同一外形可能对应多种构造程序的问题，将文本、图像、点云和B-Rep输入映射到共享构造表示，再借助可读计划生成可执行CAD代码。它比较显式计划与连续表示条件，分别测量程序构建、STEP导出、几何保真与参数响应。结果支持把这些能力分开评价，而不是以某一个成功率代表全部编辑质量；本节点未进行独立复现。

## 技术要点

- **输入**：文本 · 图像 · 点云 · B-Rep

- **表示**：中间表示 · CAD程序

- **方法**：视觉语言模型

- **对象**：零件

- **要求**：构造历史 · 可编辑性

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2608.28669)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
