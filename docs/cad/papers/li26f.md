---
id: cad-ref-li26f
title: VisCAD
category: cad
type: paper
tags:
  - 论文资料记录
  - 视觉语言模型
  - 监督微调
prerequisites: []
related: []
sources:
  - 'https://arxiv.org/abs/2609.03811v2'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# VisCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Li26f · 2026-09-03 · 方法研究

## 论文信息

- **全名**：VisCAD: A Foundation Model Suite with Multimodal Industrial CAD Intelligence
- **作者**：Guanlin Li、Zhichao Huang、Huimu Yu、Yichen Long、Hongsen Liu、Linxin Cai、Qiuhe Hong、Ziqi Liu、Luya Wang、Wenxiang Wu、Ning Zhang、Yuchen Wang
- **时间依据**：arXiv首次提交
- **正式发表记录**：未记录；未记录
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD生成](/cad/tasks/generation)。

多模态生成及装配框架为主，视觉恢复与验证为次用途。

其他任务：[CAD重建](/cad/tasks/reconstruction) · [CAD理解、评估与规划](/cad/tasks/analysis)

## 贡献简介

- 通过领域中训练和后训练构建多模态零件生成模型，并以专门执行框架支持复杂装配。它比较通用模型的输入覆盖与专门模型的CAD能力，并探索模型复用为验证器。模型能力、框架能力和验证器附加计算应分别评价。

## 独立标签

- **输入**：文本 · 图像

- **表示**：CAD程序

- **方法**：视觉语言模型 · 监督微调

- **对象**：零件 · 装配

- **要求**：几何

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系

当前材料没有为此记录单列发展关系；不代表不存在相关工作。

## 关联资源与问题

资源：未单列。

问题：未单列。

## 原始来源

- [原始来源 1](https://arxiv.org/abs/2609.03811v2)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
