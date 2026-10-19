---
id: cad-data-ds_cadbench
title: CADBench（DeCoDELab）
category: cad
type: concept
tags:
  - 数据资源
  - Parquet
  - STEP
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/DeCoDELab/CADBench/raw/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADBench（DeCoDELab）

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_CADBench · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD重建](/cad/tasks/reconstruction)
- **格式**：Parquet · STEP · STL · OBJ · GLB · 图像
- **规模**：18,000评测样本，6个benchmark families，每family约3,000
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/DeCoDELab/CADBench/raw/main/README.md)
- [原始来源 2](https://huggingface.co/datasets/DeCoDELab/CADBench)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：Hub约78.4GB，建议按family/小样本流式读取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

当前数据卡未见明确统一data license；需核对各来源数据的条件


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

六类family为评价分组，不是训练/验证划分；需排除上游训练几何


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

- DS_DeepCAD
- DS_ABC
- DS_F360_Reconstruction


**说明**

按原始模型标识保存来源，不把模态变体计作独立设计


## 最小使用方式


**使用步骤**

- 先选择一个benchmark family，使用streaming=True取少量样本，避免一次下载约78GB。
- 按实际字段读取step/stl及singleview/multiview/pbr，binary字段应保存为原始字节。
- 按论文六类指标评价几何、执行和程序紧凑性，不能只用成功渲染率。


**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 来自DeepCAD、Fusion360、ABC、MCB与Objaverse，存在上游交叉重叠。
- 与BenchCAD是不同论文和数据，名称不能互换；部分样本没有STEP或所有模态。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CADBench](/cad/papers/dor26)



[返回数据与评测资源](/cad/resources)
