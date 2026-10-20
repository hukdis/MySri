---
id: cad-ref-gua25
title: CAD-Coder · Guan
category: cad
type: paper
tags:
  - 论文资料记录
  - 语言模型
  - 强化学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.48550/arXiv.2505.19713'
  - 'https://arxiv.org/abs/2505.19713v3'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CAD-Coder · Guan


## 论文信息

- **全名**：CAD-Coder: Text-to-CAD Generation with Chain-of-Thought and Geometric Reward
- **作者**：Yandong Guan、Xilin Wang、Ximing Xing、Jing Zhang、Dong Xu、Qian Yu
- **论文时间**：2025-05-26（arXiv首次提交）
- **正式发表记录**：；Advances in Neural Information Processing Systems 38 (NeurIPS 2025), pp. 59765-59789

## 任务定位

研究任务：[CAD生成](/cad/tasks/generation)。

文本需求到程序，并用几何奖励训练。

## 方法与贡献

- 以CadQuery脚本表达文本到CAD任务，结合监督学习、几何奖励和规划式推理。它把程序执行和几何相似度纳入后训练信号。几何奖励能改善部分错误，但不能自动覆盖编辑保持或所有设计意图。

## 技术要点

- **输入**：文本

- **表示**：CadQuery

- **方法**：语言模型 · 强化学习

- **对象**：零件

- **要求**：几何

## 参考文献

- [原始来源 1](https://doi.org/10.48550/arXiv.2505.19713)
- [原始来源 2](https://arxiv.org/abs/2505.19713v3)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
