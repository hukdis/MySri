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
updated: '2026-10-19'
cadRecord: true
---
# GIFT

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Gia26 · 2026-03-28 · 方法研究

## 论文信息

- **全名**：GIFT: Bootstrapping Image-to-CAD Program Synthesis via Geometric Feedback
- **作者**：Giorgio Giannone、Anna Clare Doris、Amin Heyrani Nobari、Kai Xu、Akash Srivastava、Faez Ahmed
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

用几何反馈自举训练样本以改善图像到CAD恢复。



## 贡献简介

- 把几何反馈的推理搜索结果转成训练样本，同时保留高保真替代程序并利用接近成功的失败预测增强数据。它将测试时计算摊销到模型学习中。几何高保真样本未必具有唯一历史或完整设计意图，数据与测试划分仍需核验。

## 独立标签

- **输入**：图像

- **表示**：CAD程序

- **方法**：搜索 · 几何反馈 · 数据自举

- **对象**：零件

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2603.27448)
- [原始来源 2](https://arxiv.org/abs/2603.27448v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
