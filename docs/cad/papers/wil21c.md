---
id: cad-ref-wil21c
title: JoinABLe
category: cad
type: paper
tags:
  - 论文资料记录
  - 图网络
  - 搜索
prerequisites: []
related: []
sources:
  - 'https://doi.org/10.1109/CVPR52688.2022.01539'
  - 'https://doi.org/10.1109/cvpr52688.2022.01539'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# JoinABLe

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资料记录 · Wil21c · 2022-06 · 方法研究

## 论文信息

- **全名**：JoinABLe: Learning Bottom-up Assembly of Parametric CAD Joints
- **作者**：Karl D.D. Willis、Pradeep Kumar Jayaraman、Hang Chu、Yunsheng Tian、Yifei Li、Daniele Grandi、Aditya Sanghi、Linh Tran、Joseph G. Lambourne、Armando Solar-Lezama、Wojciech Matusik
- **时间依据**：正式/机构年份记录
- **正式发表记录**：2022-06；2022 IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)
- **版本说明**：未记录

## 研究交付与任务

主入口：[CAD理解、评估与规划](/cad/tasks/analysis)。

对给定零件推断关节轴与相对姿态，不生成新零件。



## 贡献简介

- 自动预测两零件的联合轴对应面或边，再搜索装配姿态，并建立带关节信息的Gallery装配数据。它减少对用户指定配合区域的依赖。AutoMate是同期对照，Gallery旧构造数据也不能直接当成本文新装配数据。

## 独立标签

- **输入**：B-Rep

- **表示**：B-Rep

- **方法**：图网络 · 搜索

- **对象**：装配

- **要求**：装配 · 实体引用

未标注仅表示资料未记录该属性。此页为资料卡片，尚无与既有九篇相同深度的 source 详读稿。

## 发展关系


### R15 · 独立路线

[AutoMate](/cad/papers/jon21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe称AutoMate为同期工作，比较用户指定区域的推荐与自动联合轴预测；没有方法或数据继承证据。

证据定位（来源材料记录）：JoinABLe §2，第3页；Appendix A.1.1。

### R16 · 比较关系

[UV-Net](/cad/papers/jay21) → [JoinABLe](/cad/papers/wil21c)

JoinABLe的B-Grid比较基线使用UV-Net网格采样，主模型不是UV-Net架构。

证据定位（来源材料记录）：JoinABLe §5.2；Appendix A.2.6。

## 关联资源与问题

资源：[Fusion 360 Gallery · Assembly](/cad/datasets/ds_f360_assembly) · [Fusion 360 Gallery · JoinABLe joint pairs](/cad/datasets/ds_f360_joints)。

问题：[I-H-01](/cad/issues/i-h-01)。

## 原始来源

- [原始来源 1](https://doi.org/10.1109/CVPR52688.2022.01539)
- [原始来源 2](https://doi.org/10.1109/cvpr52688.2022.01539)

[返回论文库](/cad/reading-navigation) · [研究发展树](/cad/)
