---
id: cad-data-ds_f360_assembly
title: Fusion 360 Gallery · Assembly
category: cad
type: concept
tags:
  - 数据资源
  - JSON
  - STEP
prerequisites: []
related: []
sources:
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/docs/assembly.md
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/README.md
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/LICENSE.md
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Fusion 360 Gallery · Assembly

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_F360_Assembly · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD理解、评估与规划](/cad/tasks/analysis) · [CAD生成](/cad/tasks/generation)
- **格式**：JSON · STEP · SMT · OBJ
- **规模**：8,251个装配、154,468个零件
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/docs/assembly.md)
- [原始来源 2](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/README.md)
- [原始来源 3](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/LICENSE.md)
- [原始来源 4](https://github.com/AutodeskAILab/Fusion360GalleryDataset)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：按下载工具选择，未在本轮确认完整体积

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

Autodesk数据许可：仅非商业研究；不得整库再分发，修改子集受附加条件约束


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按数据许可处理公开子集；不要把全库打包进自己仓库


**官方划分**

使用官方装配级划分；跨装配复用零件需额外查重


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

- 先读assembly下载工具说明，按需取完整装配而非把所有零件摊平。
- 读取occurrences、transform与joint结构，验证局部/世界坐标和单位。
- 面向装配生成时保留层级、零件重复实例和约束，不把一个装配的零件拆进不同集合。


**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 完整装配与下面的joint-pair子集是不同任务和样本单位。
- 不能把此数据当作AutoMate原数据，两者论文为同期独立路线。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[JoinABLe](/cad/papers/wil21c)

[I-H-01](/cad/issues/i-h-01) · [I-H-07](/cad/issues/i-h-07)

[返回数据与评测资源](/cad/resources)
