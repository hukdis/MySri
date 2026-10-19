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
updated: '2026-10-19'
cadRecord: true
---
# UV-Net

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Jay21 · 2021-06 · 方法研究

## 论文信息

- **全名**：UV-Net: Learning from Boundary Representations
- **作者**：Pradeep Kumar Jayaraman、Aditya Sanghi、Joseph G. Lambourne、Karl D. D. Willis、Thomas Davies、Hooman Shayani、Nigel Morris
- **时间依据**：正式/机构年份记录
- **正式发表记录**：2021-06；2021 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD理解、评估与规划](/cad/tasks/analysis)。

UV-Net的主要验收任务为理解和分割。



## 贡献简介

- 同时编码B-Rep面上的参数域采样和面之间的邻接图，使曲面几何与拓扑共同参与学习。它为直接使用CAD边界结构而非只用网格提供表示方法。主要展示表示学习任务，不是恢复历史或LLM生成。

## 独立标签

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：表示学习

- **对象**：零件

- **要求**：识别 · 分割

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R16 · 比较关系

[UV-Net](/cad/papers/jay21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe的B-Grid比较基线使用UV-Net网格采样，主模型不是UV-Net架构。

证据定位（来源材料记录）：JoinABLe §5.2；Appendix A.2.6。

## 关联资源与问题

资源：未单列。

问题：[I-F-02](/cad/issues/i-f-02)。

## 原始来源

- [原始来源 1](https://doi.org/10.1109/CVPR46437.2021.01153)
- [原始来源 2](https://doi.org/10.1109/cvpr46437.2021.01153)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
