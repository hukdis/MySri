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
updated: '2026-10-20'
cadRecord: true
---
# Img2CAD


## 论文信息

- **全名**：Img2CAD: Reverse Engineering 3D CAD Models from Images through VLM-Assisted Conditional Factorization
- **作者**：Yang You、Mikaela Angelina Uy、Jiaqi Han、Rahul Thomas、Haotong Zhang、Yi Du、Hansheng Chen、Francis Engelmann、Suya You、Leonidas Guibas
- **论文时间**：2024-07-19（arXiv首次提交）
- **正式发表记录**：2025-12-14；Proceedings of the SIGGRAPH Asia 2025 Conference Papers

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

图像提供待恢复对象的观测。

## 方法与贡献

- 将图像反演分成离散基础结构预测和连续属性装配，用VLM的语义能力引导前一阶段。它构建常见物体的CAD标注来连接野外图像与程序化形状。该因子化路线与直接逐词生成完整代码属于不同方法范式。

## 技术要点

- **输入**：图像

- **表示**：CAD程序

- **方法**：视觉语言模型

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3757377.3763891)
- [原始来源 2](https://arxiv.org/abs/2408.01437v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
