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
updated: '2026-10-20'
cadRecord: true
---
# ReliCAD


## 论文信息

- **全名**：ReliCAD: From Uncertain LLM Generation to Reliable Parametric CAD Modeling
- **作者**：Peng Zheng、Xintong Dong、Chuanyang Li、Jiaxin Jing、Chuqi Han、Hailong Shen、Yanzhi Song、Zhouwang Yang
- **论文时间**：2026-09-16（arXiv首次提交）

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

显式规格驱动可靠生成，运行核验为次用途。

其他任务：[CAD理解、评估与规划](/cad/tasks/analysis)

## 方法与贡献

- 将自然语言需求转为显式规格、几何关系和特征依赖，再生成约束感知操作并由CAD内核执行。它用运行证据定位规格不一致并迭代修复。可靠性仍受规格提取、检测范围及后端支持的共同限制。

## 技术要点

- **输入**：文本

- **表示**：CAD程序 · 约束图

- **方法**：语言模型 · 执行反馈 · 约束求解

- **对象**：零件

- **要求**：规格验证 · 约束

## 关联资源与问题

问题：[I-A-01](/cad/issues/i-a-01) · [I-D-01](/cad/issues/i-d-01) · [I-D-02](/cad/issues/i-d-02)。

## 参考文献

- [原始来源 1](https://arxiv.org/abs/2609.22325)
- [原始来源 2](https://arxiv.org/abs/2609.22325v1)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
