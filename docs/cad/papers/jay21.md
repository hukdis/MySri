---
id: cad-ref-jay21
title: UV-Net
category: cad
type: paper
tags:
  - 论文资料记录
  - 表示学习
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR46437.2021.01153'
  - 'https://doi.org/10.1109/cvpr46437.2021.01153'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# UV-Net


## 论文信息

- **全名**：UV-Net: Learning from Boundary Representations
- **作者**：Pradeep Kumar Jayaraman、Aditya Sanghi、Joseph G. Lambourne、Karl D. D. Willis、Thomas Davies、Hooman Shayani、Nigel Morris
- **论文时间**：2021-06（正式/机构年份记录）
- **正式发表记录**：2021-06；2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)

## 任务定位

研究任务：[CAD理解、评估与规划](/cad/tasks/analysis)。

UV-Net的主要验收任务为理解和分割。

## 方法与贡献

- 同时编码B-Rep面上的参数域采样和面之间的邻接图，使曲面几何与拓扑共同参与学习。它为直接使用CAD边界结构而非只用网格提供表示方法。主要展示表示学习任务，不是恢复历史或LLM生成。

## 技术要点

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：表示学习

- **对象**：零件

- **要求**：识别 · 分割

## 相关研究

### R16 · 比较关系

[UV-Net](/cad/papers/jay21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe的B-Grid比较基线使用UV-Net网格采样，主模型不是UV-Net架构。

原文位置：JoinABLe §5.2；Appendix A.2.6。

## 关联资源与问题

问题：[I-F-02](/cad/issues/i-f-02)。

## 参考文献

- [原始来源 1](https://doi.org/10.1109/CVPR46437.2021.01153)
- [原始来源 2](https://doi.org/10.1109/cvpr46437.2021.01153)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
