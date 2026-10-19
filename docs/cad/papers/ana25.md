---
id: cad-ref-ana25
title: CAD-RAG · 多模态检索与可编辑生成
category: cad
type: paper
tags:
  - 论文资料记录
  - 检索增强
  - 语言模型
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.24132/jwscg.2025-11'
  - 'http://wscg.zcu.cz/WSCG2025/papers/D11.pdf'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CAD-RAG · 多模态检索与可编辑生成

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Ana25 · 2025 · 方法研究

## 论文信息

- **全名**：CAD-RAG: A multi-modal retrieval augmented framework for user editable 3D CAD model generation
- **作者**：Ananthakrishnan A、Anush Bharathi、Dharanivendhan V、Ramanathan Muthuganapathy
- **时间依据**：官方论文年份；精确日期未核实
- **正式发表记录**：2025；Journal of WSCG 33(1–2), 99–110
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

检索服务于可编辑模型生成；检索和迭代修改为次任务。

其他任务：[CAD理解、评估与规划](/cad/tasks/analysis) · [CAD编辑](/cad/tasks/editing)

## 贡献简介

- 从设计复用出发，把草图或文本查询与已有CAD模型检索连接，再用于可编辑CAD命令序列生成。论文构建含手绘草图、图像、点云、文本及CAD序列的多模态资源，并通过检索增强框架支持用户迭代设计。检索命中、最终几何质量和编辑可控性是不同能力；论文公开承诺需与当前仓库实际开放情况分开核查。

## 独立标签

- **输入**：文本 · 草图

- **表示**：CAD程序

- **方法**：检索增强 · 语言模型

- **对象**：零件

- **要求**：几何 · 可编辑性

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-G-03](/cad/issues/i-g-03)。

## 原始来源

- [原始来源 1](https://doi.org/10.24132/jwscg.2025-11)
- [原始来源 2](http://wscg.zcu.cz/WSCG2025/papers/D11.pdf)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
