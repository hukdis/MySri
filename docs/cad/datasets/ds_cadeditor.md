---
id: cad-data-ds_cadeditor
title: CAD-Editor编辑三元组
category: cad
type: concept
tags:
  - 数据资源
  - JSON
  - ZIP
prerequisites: []
related: []
sources:
  - 'https://raw.githubusercontent.com/microsoft/CAD-Editor/main/README.md'
  - 'https://huggingface.co/microsoft/CAD-Editor/raw/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CAD-Editor编辑三元组


## 任务、格式与版本

- **任务入口**：[CAD编辑](/cad/tasks/editing)
- **格式**：JSON · ZIP · 序列
- **规模**：官方提供processed.zip及完整合成流程；本轮未核实当前归档的逐划分条数
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/microsoft/CAD-Editor/main/README.md)
- [原始来源 2](https://huggingface.co/microsoft/CAD-Editor/raw/main/README.md)
- [原始来源 3](https://github.com/microsoft/CAD-Editor)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

仓库/模型卡MIT；编辑数据和上游几何的授权应分别保留

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

保留DeepCAD原训练/测试归属；变体、编辑前后模型必须在同一组

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**上游来源**

- DS_DeepCAD
- DS_SkexGen

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 优先检查data/processed.zip及其中train/test等JSON，不先重跑全部合成。
- 以原始模型、编辑指令、目标序列为最小三元组，保存DeepCAD ID和HNC-CAD变体关系。
- 先抽50条人工核对“指令是否对应变化、未要求区域是否保持”，再决定是否扩充合成。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 指令与模型变化由自动流程合成，不能假定天然无歧义。
- 数据和部分脚本依赖旧表示与后端；重建合成需要额外LLM调用，当前不自动付费执行。

## 样例检查范围

- cadeditor_processed：2026-10-15；endpoint_reachable；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CAD-Editor](/cad/cad-editor)

[I-C-01](/cad/issues/i-c-01)

[返回数据与评测资源](/cad/resources)
