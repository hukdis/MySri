---
id: cad-data-ds_cadreview
title: CADReview
category: cad
type: concept
tags:
  - 数据资源
  - Parquet
  - OpenSCAD代码
prerequisites: []
related: []
sources:
  - 'https://raw.githubusercontent.com/Gary-code/CADReview/main/README.md'
  - 'https://huggingface.co/datasets/Garygedegege/CADReview/raw/main/README.md'
  - 'https://arxiv.org/abs/2505.22304'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADReview


## 任务、格式与版本

- **任务入口**：[CAD编辑](/cad/tasks/editing) · [CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：Parquet · OpenSCAD代码 · 图像
- **规模**：论文与仓库称2万余程序-图像对；Hub按train/test组织
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/Gary-code/CADReview/main/README.md)
- [原始来源 2](https://huggingface.co/datasets/Garygedegege/CADReview/raw/main/README.md)
- [原始来源 3](https://arxiv.org/abs/2505.22304)
- [原始来源 4](https://huggingface.co/datasets/Garygedegege/CADReview)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

本次数据卡未声明明确data license；不能把公开下载等同于任意再分发

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

Hub提供train/test；需核对同源正确程序/错误变体分组

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**上游来源**

- DS_CADTalk

**说明**

CADTalk是辅助学习数据来源之一，不表示整个CADReview只由CADTalk组成。

## 最小使用方式

**使用步骤**

- 先流式读取train的少量行，检查id、error_code、correct_code和image。
- 以源程序为组保留错误变体，防止一份正确程序的不同错误版本跨集合。
- 先运行语法与渲染检查，再评估几何修复与参考图对应；需要OpenSCAD执行环境。

**执行后端**

OpenSCAD；渲染/网格评测与B-Rep后端分开

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- OpenSCAD程序不等同于可直接编辑的B-Rep历史。
- 错误注入分布与真实用户错误不同；当前未核实独立数据许可。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CADReview / ReCAD](/cad/cadreview)

[返回数据与评测资源](/cad/resources)
