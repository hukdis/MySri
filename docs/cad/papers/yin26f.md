---
id: cad-ref-yin26f
title: UniBRep
category: cad
type: paper
tags:
  - 论文资料记录
  - 几何拟合
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2610.04092'
  - 'https://arxiv.org/abs/2610.04092v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# UniBRep

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Yin26f · 2026-10-02 · 方法研究

## 论文信息

- **全名**：UniBRep: Learning Unified Geometry and Topology for Image-conditioned B-Rep Generation
- **作者**：Haiyang Ying、Allen Tu、Jiaye Wu、Tom Goldstein、Matthias Zwicker
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD重建](/cad/tasks/reconstruction)。

从图像及带特征网格恢复解析B-Rep。



## 贡献简介

- 以预训练图像到三维模型生成带特征网格，再从表面区域恢复参数曲面、边界和连接。它用统一几何支架减轻直接预测拓扑和预设面数量带来的限制。输出是B-Rep，不能因此宣称已恢复原始特征历史。

## 独立标签

- **输入**：图像

- **表示**：B-Rep

- **方法**：几何拟合

- **对象**：零件

- **要求**：几何 · 拓扑

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-B-02](/cad/issues/i-b-02) · [I-B-03](/cad/issues/i-b-03)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2610.04092)
- [原始来源 2](https://arxiv.org/abs/2610.04092v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
