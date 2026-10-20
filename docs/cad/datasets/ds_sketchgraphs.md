---
id: cad-data-ds_sketchgraphs
title: SketchGraphs
category: cad
type: concept
tags:
  - 数据资源
  - JSON.zst
  - NPY自定义序列
prerequisites: []
related: []
sources:
  - >-
    https://raw.githubusercontent.com/PrincetonLIPS/SketchGraphs/master/README.md
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# SketchGraphs


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD理解、评估与规划](/cad/tasks/analysis) · [CAD编辑](/cad/tasks/editing)
- **格式**：JSON.zst · NPY自定义序列
- **规模**：约1500万真实草图；过滤子集与原始全集不可混报
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/PrincetonLIPS/SketchGraphs/master/README.md)
- [原始来源 2](https://github.com/PrincetonLIPS/SketchGraphs)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

原创建者持草图版权，官方指向Onshape内容条款；代码MIT不代替数据条件

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

官方sg_t16_train.npy、validation.npy、test.npy；更严格的原设计文档去重需另核查

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 优先用sg_t16的train/validation/test过滤子集。
- 使用官方flat_array/序列接口读取自定义NPY，不把它当普通数值矩阵。
- 先查看50张草图的基元与约束；若研究约束满足，再接入实际几何求解器并保存求解失败原因。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 这是二维约束图，不是完整三维零件或建模历史。
- 原始128个zstd分片约43GB，sg_all.npy约15GB；通常无需先处理原始全集。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[SketchGraphs](/cad/papers/sef20) · [Vitruvion](/cad/papers/sef21) · [Design Alignment](/cad/papers/cas25)

[I-D-01](/cad/issues/i-d-01)

[返回数据与评测资源](/cad/resources)
