---
id: cad-data-ds_automate
title: AutoMate
category: cad
type: concept
tags:
  - 数据资源
  - STEP
  - Parasolid
prerequisites: []
related: []
sources:
  - 'https://datadryad.org/dataset/doi:10.5061/dryad.2547d7wvw'
  - 'https://datadryad.org/api/v2/datasets/doi%3A10.5061%2Fdryad.2547d7wvw'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# AutoMate

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_AutoMate · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：STEP · Parasolid · JSON · Parquet
- **规模**：Dryad 2023快照：451,967独立零件、255,211装配、1,292,016独立mates
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：2021论文 · Dryad快照2023-03-27；并列Zenodo记录

## 官方入口与获取记录

- [原始来源 1](https://datadryad.org/dataset/doi:10.5061/dryad.2547d7wvw)
- [原始来源 2](https://datadryad.org/api/v2/datasets/doi%3A10.5061%2Fdryad.2547d7wvw)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：完整34.93GB；先读元数据，按几何后端选择归档

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

Dryad当前记录标CC0-1.0；保留原始Onshape来源与模型归属


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

按官方README与论文协议核验，未从数据落地页确认固定比例


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

未记录。


**说明**

按原始模型标识保存来源，不把模态变体计作独立设计


## 最小使用方式


**使用步骤**

- 先取README、config_encodings.json和必要Parquet元数据。
- 采用STEP几何避免Parasolid商业内核依赖；按assembly/mate/part标识建立关联。
- 以装配为数据组并核对去重零件；使用论文mate预测协议，另记录是否使用用户指定区域。


**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 整库约34.93GB；Parasolid约20.49GB、STEP约13.21GB，可按后端选择。
- 独立于Fusion 360 Gallery，不能混用两个数据集的规模与划分。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[AutoMate](/cad/papers/jon21)

[I-H-01](/cad/issues/i-h-01)

[返回数据与评测资源](/cad/resources)
