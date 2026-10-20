---
id: cad-ref-wan24b
title: CAD-GPT
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1609/aaai.v39i8.32849'
  - 'https://arxiv.org/abs/2412.19663v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CAD-GPT


## 论文信息

- **全名**：CAD-GPT: Synthesising CAD Construction Sequence with Spatial Reasoning-Enhanced Multimodal LLMs
- **作者**：Siyu Wang、Cailian Chen、Xinyi Le、Qimin Xu、Lei Xu、Yanzhou Zhang、Jie Yang
- **论文时间**：2024-12-27（arXiv首次提交）
- **正式发表记录**：2025-04-11；Proceedings of the AAAI Conference on Artificial Intelligence

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

文本条件序列生成为主，图像恢复保留次入口。

其他任务：[CAD重建](/cad/tasks/reconstruction)

## 方法与贡献

- 针对图像或文本条件生成中空间位置和草图方向难以表达的问题，设计空间展开及离散编码机制辅助多模态模型预测CAD序列。它把三维空间信息与语言特征空间对齐。结果仍受序列表示、量化和支持操作的范围影响。

## 技术要点

- **输入**：文本 · 图像

- **表示**：命令序列

- **方法**：语言模型

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.1609/aaai.v39i8.32849)
- [原始来源 2](https://arxiv.org/abs/2412.19663v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
