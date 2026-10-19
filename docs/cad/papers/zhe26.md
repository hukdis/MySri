---
id: cad-ref-zhe26
title: ReliCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 执行反馈
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.22325'
  - 'https://arxiv.org/abs/2609.22325v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# ReliCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Zhe26 · 2026-09-16 · 方法研究

## 论文信息

- **全名**：ReliCAD: From Uncertain LLM Generation to Reliable Parametric CAD Modeling
- **作者**：Peng Zheng、Xintong Dong、Chuanyang Li、Jiaxin Jing、Chuqi Han、Hailong Shen、Yanzhi Song、Zhouwang Yang
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

显式规格驱动可靠生成，运行核验为次用途。

其他任务：[CAD理解、评估与规划](/cad/tasks/analysis)

## 贡献简介

- 将自然语言需求转为显式规格、几何关系和特征依赖，再生成约束感知操作并由CAD内核执行。它用运行证据定位规格不一致并迭代修复。可靠性仍受规格提取、检测范围及后端支持的共同限制。

## 独立标签

- **输入**：文本

- **表示**：CAD程序 · 约束图

- **方法**：语言模型 · 执行反馈 · 约束求解

- **对象**：零件

- **要求**：规格验证 · 约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-A-01](/cad/issues/i-a-01) · [I-D-01](/cad/issues/i-d-01) · [I-D-02](/cad/issues/i-d-02)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2609.22325)
- [原始来源 2](https://arxiv.org/abs/2609.22325v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
