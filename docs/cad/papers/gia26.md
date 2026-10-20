---
id: cad-ref-gia26
title: GIFT
category: cad
type: paper
tags:
  - 论文资料记录
  - 搜索
  - 几何反馈
  - 数据自举
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2603.27448'
  - 'https://arxiv.org/abs/2603.27448v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# GIFT


## 论文信息

- **全名**：GIFT: Bootstrapping Image-to-CAD Program Synthesis via Geometric Feedback
- **作者**：Giorgio Giannone、Anna Clare Doris、Amin Heyrani Nobari、Kai Xu、Akash Srivastava、Faez Ahmed
- **论文时间**：2026-03-28（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

用几何反馈自举训练样本以改善图像到CAD恢复。

## 方法与贡献

- 把几何反馈的推理搜索结果转成训练样本，同时保留高保真替代程序并利用接近成功的失败预测增强数据。它将测试时计算摊销到模型学习中。几何高保真样本未必具有唯一历史或完整设计意图，数据与测试划分仍需核验。

## 技术要点

- **输入**：图像

- **表示**：CAD程序

- **方法**：搜索 · 几何反馈 · 数据自举

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2603.27448)
- [原始来源 2](https://arxiv.org/abs/2603.27448v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
