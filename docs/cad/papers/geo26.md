---
id: cad-ref-geo26
title: AgentsCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 代理
  - 执行反馈
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2607.02448'
  - 'https://arxiv.org/abs/2607.02448v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# AgentsCAD


## 论文信息

- **全名**：AgentsCAD: Automated Design for Manufacturing of FDM Parts via Multi-Agent LLM Reasoning and Geometric Feature Recognition
- **作者**：Emmanuel George、Christopher Keefe、Peter Pak、Amir Barati Farimani
- **论文时间**：2026-07-02（arXiv首次提交）

## 任务定位

研究任务：[CAD编辑](/cad/tasks/editing)。

先识别FDM问题再对给定CAD提出和核验修改。

其他任务：[CAD理解、评估与规划](/cad/tasks/analysis)

## 方法与贡献

- 从B-Rep识别与FDM打印有关的几何问题，再用多代理提出和检查几何修改。它连接制造特征、设计建议和视图核验。当前案例展示的范围有限，应与大规模可制造性和泛化证据区分。

## 技术要点

- **输入**：已有CAD

- **表示**：B-Rep

- **方法**：代理 · 执行反馈

- **对象**：零件

- **要求**：制造 · 内容保持

## 关联资源与问题

问题：[I-H-03](/cad/issues/i-h-03)。

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2607.02448)
- [原始来源 2](https://arxiv.org/abs/2607.02448v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
