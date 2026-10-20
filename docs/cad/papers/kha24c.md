---
id: cad-ref-kha24c
title: CAD-SIGNet
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR52733.2024.00451'
  - 'https://doi.org/10.1109/cvpr52733.2024.00451'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CAD-SIGNet


## 论文信息

- **全名**：CAD-SIGNet: CAD Language Inference from Point Clouds Using Layer-Wise Sketch Instance Guided Attention
- **作者**：Mohammad Sadil Khan、Elona Dupont、Sk Aziz Ali、Kseniya Cherenkova、Anis Kacem、Djamila Aouada
- **论文时间**：2024-06-16（正式/机构年份记录）
- **正式发表记录**：2024-06-16；2024 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

点云到历史的恢复，支持交互选择不改变其主要目标。

## 方法与贡献

- 通过点云与CAD语言的层间交互以及草图实例引导注意力，恢复草图拉伸设计历史。自回归解码还允许提供多种下一步设计选择。它的语言表示是CAD形式序列，不自动等于预训练自然语言LLM。

## 技术要点

- **输入**：点云

- **表示**：命令序列

- **方法**：监督学习

- **对象**：零件

- **要求**：构造历史

## 参考文献

- [原始来源 1](https://doi.org/10.1109/CVPR52733.2024.00451)
- [原始来源 2](https://doi.org/10.1109/cvpr52733.2024.00451)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
