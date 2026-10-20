---
id: cad-ref-har26b
title: CAD关系与机器人装配规划
category: cad
type: paper
tags:
  - 论文资料记录
  - 图网络
  - 搜索
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.17263v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CAD关系与机器人装配规划


## 论文信息

- **全名**：CAD-Based Relation Learning and Geometric-Symbolic Planning for Robotic Assembly
- **作者**：Fabian Harlacher、Christian Friedrich
- **论文时间**：2026-09-15（arXiv首次提交）

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

由接触关系形成机器人拆装计划。

## 方法与贡献

- 从不完美CAD数据学习接触等关系，再转成装配图用于几何符号规划，并允许人修正不确定预测。它将关系识别、可行运动与顺序规划连接起来。输出重点是机器人拆装过程，不是新零件或原生装配历史生成。

## 技术要点

- **输入**：CAD

- **表示**：装配图

- **方法**：图网络 · 搜索

- **对象**：装配

- **要求**：装配 · 运动

## 关联资源与问题

问题：[I-H-07](/cad/issues/i-h-07)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.17263v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
