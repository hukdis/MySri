---
id: cad-data-ds_cadrecode
title: CAD-Recode（v1 / v1.5）
category: cad
type: concept
tags:
  - 数据资源
  - Python CadQuery
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/filapro/cad-recode/raw/main/README.md'
  - 'https://huggingface.co/datasets/filapro/cad-recode-v1.5/raw/main/README.md'
  - 'https://raw.githubusercontent.com/filaPro/cad-recode/main/CHANGELOG.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CAD-Recode（v1 / v1.5）


## 任务、格式与版本

- **任务入口**：[CAD重建](/cad/tasks/reconstruction)
- **格式**：Python CadQuery
- **规模**：每版训练约100万、验证约1000；以数据卡约数记录，不把v1和v1.5合并计数
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：v1：2024-12 · v1.5：2025-03

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/filapro/cad-recode/raw/main/README.md)
- [原始来源 2](https://huggingface.co/datasets/filapro/cad-recode-v1.5/raw/main/README.md)
- [原始来源 3](https://raw.githubusercontent.com/filaPro/cad-recode/main/CHANGELOG.md)
- [原始来源 4](https://huggingface.co/datasets/filapro/cad-recode-v1.5)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

CC BY-NC 4.0

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

约1M训练/1k验证；论文DeepCAD/Fusion360/CC3D评测另行准备

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 先选v1或v1.5；从官方Hub取最少一个程序或小分片，记录revision。
- 用配套CadQuery环境执行并采样点云；保留输入采样与归一化参数。
- 复现时匹配模型与数据版：v1.5取消法线、用FPS，数据整数范围改为[-100,100]。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 发布的是程序，不应假定点云都已打包；需按官方示例生成。
- 百万合成程序不等于百万真实人类设计；跨数据泛化应另用独立评测。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CAD-Recode](/cad/cad-recode)

[I-A-01](/cad/issues/i-a-01) · [I-B-03](/cad/issues/i-b-03)

[返回数据与评测资源](/cad/resources)
