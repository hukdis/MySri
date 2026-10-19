---
id: cad-ref-fan26
title: TraceCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 执行反馈
  - 记忆
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2608.03062'
  - 'https://arxiv.org/abs/2608.03062v1'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# TraceCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Fan26 · 2026-08-04 · 方法研究

## 论文信息

- **全名**：TraceCAD: Trace-Guided Repair for Agentic CAD Generation
- **作者**：Fengxiao Fan、Jingzhe Ni、Fan Sang、Xiaolong Yin、Yu Liu、Ruofeng Tong、Min Tang、Peng Du
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

要求驱动生成及残差修复为主要流程，已有模型持续修改保留次入口。

其他任务：[CAD编辑](/cad/tasks/editing)

## 贡献简介

- 把要求、建模步骤、错误证据和修复结果组织成持久状态，在依赖区域中搜索有限修改。它保存成功和失败修复经验来减少重复试错。可靠性需要同时看目标修复和未修改内容的回归，而非只看最终形状。

## 独立标签

- **输入**：文本 · 已有CAD

- **表示**：CAD程序

- **方法**：代理 · 执行反馈 · 记忆

- **对象**：零件

- **要求**：规格验证 · 内容保持

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：[I-E-02](/cad/issues/i-e-02) · [I-E-03](/cad/issues/i-e-03)。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2608.03062)
- [原始来源 2](https://arxiv.org/abs/2608.03062v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
