---
id: cad-ref-liu26c
title: Embodied CAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 工具调用
  - 约束求解
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2606.31252'
  - 'https://arxiv.org/abs/2606.31252v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Embodied CAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Liu26c · 2026-06-30 · 方法研究

## 论文信息

- **全名**：Embodied CAD: Solver-Grounded LLM Agents for Parametric B-Rep Assembly Modeling
- **作者**：Fumin Liu、Haoyu Zhou、Fei Hao、Lin Yang
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

通过类型化技能和求解器构建装配，主交付是新装配模型。



## 贡献简介

- 让LLM逐步选择分层CAD技能，并由确定性几何操作和求解器执行、反馈与评分。它结合类型化动作、参数解析和训练信号来约束长程装配。有效工具调用和完成整个装配任务的指标必须分开。

## 独立标签

- **输入**：文本

- **表示**：B-Rep

- **方法**：代理 · 工具调用 · 约束求解

- **对象**：装配

- **要求**：装配 · 约束

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-H-02](/cad/issues/i-h-02)。

## 原始来源

- [原始来源 1](https://doi.org/10.48550/arXiv.2606.31252)
- [原始来源 2](https://arxiv.org/abs/2606.31252v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
