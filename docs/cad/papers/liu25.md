---
id: cad-ref-liu25
title: B-repLer
category: cad
type: paper
tags:
  - 论文资料记录
  - 潜空间生成
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1145/3799902.3811166'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# B-repLer


## 论文信息

- **全名**：B-repLer: Language-guided Editing of CAD Models
- **作者**：Yilin Liu、Niladri Shekhar Dutt、Changjian Li、Niloy J. Mitra
- **论文时间**：2026-07-19（正式/机构年份记录）
- **正式发表记录**：2026-07-19；Proceedings of the Special Interest Group on Computer Graphics and Interactive Techniques Conference Conference Papers

## 任务定位

研究任务：[CAD编辑](/cad/tasks/editing)。

直接编辑已有B-Rep，不要求原构造历史。

## 方法与贡献

- 在学习到的潜空间中直接连接语言与B-Rep编辑，并提供大规模配对编辑数据。它绕开必须提供建模历史的限制，支持更复杂曲面几何。得到可编辑边界形状不等于恢复原来的特征依赖树。

## 技术要点

- **输入**：文本 · 已有CAD

- **表示**：B-Rep

- **方法**：潜空间生成

- **对象**：零件

- **要求**：可编辑性 · 内容保持

## 关联资源与问题

问题：[I-C-02](/cad/issues/i-c-02) · [I-F-03](/cad/issues/i-f-03)。

## 参考文献

- [原始来源 1](https://doi.org/10.1145/3799902.3811166)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
