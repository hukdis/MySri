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
updated: '2026-10-20'
cadRecord: true
---
# UniBRep


## 论文信息

- **全名**：UniBRep: Learning Unified Geometry and Topology for Image-conditioned B-Rep Generation
- **作者**：Haiyang Ying、Allen Tu、Jiaye Wu、Tom Goldstein、Matthias Zwicker
- **论文时间**：2026-10-02（arXiv首次提交）

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

从图像及带特征网格恢复解析B-Rep。

## 方法与贡献

- 以预训练图像到三维模型生成带特征网格，再从表面区域恢复参数曲面、边界和连接。它用统一几何支架减轻直接预测拓扑和预设面数量带来的限制。输出是B-Rep，不能因此宣称已恢复原始特征历史。

## 技术要点

- **输入**：图像

- **表示**：B-Rep

- **方法**：几何拟合

- **对象**：零件

- **要求**：几何 · 拓扑

## 关联资源与问题

问题：[I-B-02](/cad/issues/i-b-02) · [I-B-03](/cad/issues/i-b-03)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2610.04092)
- [原始来源 2](https://arxiv.org/abs/2610.04092v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
