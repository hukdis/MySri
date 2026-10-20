---
id: cad-data-ds_f360_joints
title: Fusion 360 Gallery · JoinABLe joint pairs
category: cad
type: concept
tags:
  - 数据资源
  - JSON关节
  - STEP
prerequisites: []
related: []
sources:
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/docs/assembly_joint.md
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/README.md
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/LICENSE.md
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Fusion 360 Gallery · JoinABLe joint pairs


## 任务、格式与版本

- **任务入口**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：JSON关节 · STEP · SMT · OBJ · 图JSON
- **规模**：19,156 joint sets、32,148 joints、23,029不同零件
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/docs/assembly_joint.md)
- [原始来源 2](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/README.md)
- [原始来源 3](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/LICENSE.md)
- [原始来源 4](https://github.com/AutodeskAILab/Fusion360GalleryDataset)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：参见官方joint下载表，不与完整Assembly大小混用

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

Autodesk数据许可：仅非商业研究；不得整库再分发，修改子集受附加条件约束

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按数据许可处理公开子集；不要把全库打包进自己仓库

**官方划分**

优先JoinABLe官方split，补查重复零件跨集合情况

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 下载官方joint独立包并把joint_set视为一个样本。
- 按body_one/body_two关联部件；读取geometry_or_origin实体、轴线和transform。
- 先复用提供的JoinABLe图特征，再考虑自己提取；检查cm/rad及原生实体索引。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- STEP不是SMT原生面索引的无损替代；必须核对映射。
- 这里只含局部零件对，不覆盖完整装配规划或全部工程约束。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[JoinABLe](/cad/papers/wil21c)

[I-H-01](/cad/issues/i-h-01)

[返回数据与评测资源](/cad/resources)
