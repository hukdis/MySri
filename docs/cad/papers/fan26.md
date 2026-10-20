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
updated: '2026-10-20'
cadRecord: true
---
# TraceCAD


## 论文信息

- **全名**：TraceCAD: Trace-Guided Repair for Agentic CAD Generation
- **作者**：Fengxiao Fan、Jingzhe Ni、Fan Sang、Xiaolong Yin、Yu Liu、Ruofeng Tong、Min Tang、Peng Du
- **论文时间**：2026-08-04（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

要求驱动生成及残差修复为主要流程，已有模型持续修改保留次入口。

其他任务：[CAD编辑](/cad/tasks/editing)

## 方法与贡献

- 把要求、建模步骤、错误证据和修复结果组织成持久状态，在依赖区域中搜索有限修改。它保存成功和失败修复经验来减少重复试错。可靠性需要同时看目标修复和未修改内容的回归，而非只看最终形状。

## 技术要点

- **输入**：文本 · 已有CAD

- **表示**：CAD程序

- **方法**：代理 · 执行反馈 · 记忆

- **对象**：零件

- **要求**：规格验证 · 内容保持

## 关联资源与问题

问题：[I-E-02](/cad/issues/i-e-02) · [I-E-03](/cad/issues/i-e-03)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2608.03062)
- [原始来源 2](https://arxiv.org/abs/2608.03062v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
