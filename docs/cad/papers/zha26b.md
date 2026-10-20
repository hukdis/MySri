---
id: cad-ref-zha26b
title: FllumaOne · 程序与特征树配对
category: cad
type: paper
tags:
  - 论文资料记录
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2606.17696'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# FllumaOne · 程序与特征树配对


## 论文信息

- **全名**：FllumaOne: A Code-Native Multimodal CAD Dataset with Executable Programs and Kernel-Validated Feature Histories
- **作者**：Zhan, Jizong
- **论文时间**：2026-06-16（arXiv首次提交）

## 任务定位

研究任务：共用基础。

程序、特征树和多模态配对数据；数据可用状态沿用核查记录。

## 方法与贡献

- 针对最终几何不足以描述编辑过程的问题，把可执行Python CAD程序与特征树、中间表示、STEP、点云、文本及多视图渲染配对。论文介绍经内核和导出检查接受的10万样本，并分别报告语法、构建、导出与几何指标。其可编辑性与几何指标不能互相替代，且本次尚未核实完整发布包，所以不能将论文中的发布表述直接当作已成功取数。

## 技术要点

- **输入**：文本 · 图像 · 点云 · CAD

- **表示**：CAD程序 · B-Rep

- **对象**：零件

- **要求**：构造历史 · 可执行性

## 关联资源与问题

资源：[FllumaOne-100K](/cad/datasets/ds_fllumaone)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2606.17696)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
