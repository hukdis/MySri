---
id: cad-data-ds_omnicad
title: Omni-CAD / CAD-MLLM
category: cad
type: concept
tags:
  - 数据资源
  - CAD JSON
  - 文本JSON
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/jingwei-xu-00/Omni-CAD/raw/main/README.md'
  - 'https://raw.githubusercontent.com/CAD-MLLM/CAD-MLLM/main/README.md'
  - 'https://arxiv.org/abs/2411.04954'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Omni-CAD / CAD-MLLM


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction)
- **格式**：CAD JSON · 文本JSON · 派生图像 · 派生点云
- **规模**：数据卡称约45万实例；实例、独立CAD模型与模态变体应分别统计
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/jingwei-xu-00/Omni-CAD/raw/main/README.md)
- [原始来源 2](https://raw.githubusercontent.com/CAD-MLLM/CAD-MLLM/main/README.md)
- [原始来源 3](https://arxiv.org/abs/2411.04954)
- [原始来源 4](https://huggingface.co/datasets/jingwei-xu-00/Omni-CAD)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

数据卡标MIT；保留ABC/Onshape上游来源说明

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

按官方处理流程与原始模型分组；不同模态必须使用同一划分

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**上游来源**

- DS_ABC

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 先取Omni-CAD.zip并核对json/与txt/的模型标识。
- 按官方流程从JSON导出几何，再生成pcd/img；检查缺失与失败。
- 用同一模型标识统一划分所有模态，不把生成的多视图当独立样本重分。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 下载包的示例目录只明确JSON和文本；图像/点云通常还需本地生成。
- 数据卡许可不自动消除上游第三方模型条件。
- 原文说明移除圆角/倒角操作后检查剩余拓扑；不要把保留模型来源误写成输出表示包含所有这些操作。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CAD-MLLM](/cad/cad-mllm)

[I-A-01](/cad/issues/i-a-01)

[返回数据与评测资源](/cad/resources)
