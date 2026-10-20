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
updated: '2026-10-20'
cadRecord: true
---
# Embodied CAD


## 论文信息

- **全名**：Embodied CAD: Solver-Grounded LLM Agents for Parametric B-Rep Assembly Modeling
- **作者**：Fumin Liu、Haoyu Zhou、Fei Hao、Lin Yang
- **论文时间**：2026-06-30（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

通过类型化技能和求解器构建装配，主交付是新装配模型。

## 方法与贡献

- 让LLM逐步选择分层CAD技能，并由确定性几何操作和求解器执行、反馈与评分。它结合类型化动作、参数解析和训练信号来约束长程装配。有效工具调用和完成整个装配任务的指标必须分开。

## 技术要点

- **输入**：文本

- **表示**：B-Rep

- **方法**：代理 · 工具调用 · 约束求解

- **对象**：装配

- **要求**：装配 · 约束

## 关联资源与问题

问题：[I-H-02](/cad/issues/i-h-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2606.31252)
- [原始来源 2](https://arxiv.org/abs/2606.31252v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
