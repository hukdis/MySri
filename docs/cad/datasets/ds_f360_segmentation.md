---
id: cad-data-ds_f360_segmentation
title: Fusion 360 Gallery · Segmentation
category: cad
type: concept
tags:
  - 数据资源
  - STEP
  - SMT
prerequisites: []
related: []
sources:
  - >-
    https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/docs/segmentation.md
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
# Fusion 360 Gallery · Segmentation


## 任务、格式与版本

- **任务入口**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：STEP · SMT · OBJ · 面标签 · 点云
- **规模**：35,680个零件；8类面标签
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/docs/segmentation.md)
- [原始来源 2](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/README.md)
- [原始来源 3](https://raw.githubusercontent.com/AutodeskAILab/Fusion360GalleryDataset/master/LICENSE.md)
- [原始来源 4](https://github.com/AutodeskAILab/Fusion360GalleryDataset)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：s2.0.1约3.1GB

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

Autodesk数据许可：仅非商业研究；不得整库再分发，修改子集受附加条件约束

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按数据许可处理公开子集；不要把全库打包进自己仓库

**官方划分**

按s2.0.1官方划分，保留每个原组件归属

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 取s2.0.1，读取官方面标签与固定划分。
- 先用STEP和标签做50模型配对；确认转换后面索引如何对应。
- 使用BRepNet官方处理链生成拓扑/几何输入，保存被过滤模型。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 面标签来自Extrude/Cut/Fillet/Chamfer/Revolve，不是完整特征树。
- STEP转换后的面排序不能未经检查当作SMT原索引。

## 样例检查范围

- fusion_segmentation_zip：2026-10-15；endpoint_reachable；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[BRepNet](/cad/papers/lam21)

[I-F-02](/cad/issues/i-f-02)

[返回数据与评测资源](/cad/resources)
