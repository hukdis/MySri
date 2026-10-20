---
id: cad-ref-zho23
title: CADParser
category: cad
type: paper
tags:
  - 论文资料记录
  - 监督学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.24963/ijcai.2023/200'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADParser


## 论文信息

- **全名**：CADParser: A Learning Approach of Sequence Modeling for B-Rep CAD
- **作者**：Shengdi Zhou、Tianyi Tang、Bin Zhou
- **论文时间**：2023-08（正式/机构年份记录）
- **正式发表记录**：2023-08；Proceedings of the Thirty-Second International Joint Conference on Artificial Intelligence

## 任务定位

研究任务：[CAD重建](/cad/tasks/reconstruction)。

由最终B-Rep恢复建模历史。

## 方法与贡献

- 把B-Rep编码为图并预测构造序列，尝试补回只有静态几何而缺失的建模过程。数据与任务扩展到旋转、倒角等更多操作。这里依据摘要理解贡献，额外操作的覆盖与重建协议仍需按原文检查。

## 技术要点

- **输入**：B-Rep

- **表示**：命令序列

- **方法**：监督学习

- **对象**：零件

- **要求**：构造历史

## 参考文献

- [原始来源 1](https://doi.org/10.24963/ijcai.2023/200)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
