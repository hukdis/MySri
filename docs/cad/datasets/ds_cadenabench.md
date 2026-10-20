---
id: cad-data-ds_cadenabench
title: CADENA-Bench
category: cad
type: concept
tags:
  - 数据资源
  - Parquet
  - STL字节
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/kulibinai/cadena-bench/raw/main/README.md'
  - 'https://raw.githubusercontent.com/zhemdi/cadena/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADENA-Bench


## 任务、格式与版本

- **任务入口**：[CAD重建](/cad/tasks/reconstruction)
- **格式**：Parquet · STL字节 · 图像 · 文本
- **规模**：3,396个零件；原3,504评测集合移除108个与RL训练字节相同网格
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/kulibinai/cadena-bench/raw/main/README.md)
- [原始来源 2](https://raw.githubusercontent.com/zhemdi/cadena/main/README.md)
- [原始来源 3](https://huggingface.co/datasets/kulibinai/cadena-bench)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：Hub下载约6.4GB，解码数据约13GB；先避免完整单行二进制JSON预览

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

MIT（数据卡）

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

Hub仅train，但角色为去污染评测；与RL训练排除108个重复网格

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 从Hub指定split="train"读取，但把它按论文作为评测集保留。
- 按schema实际读取part_id、family、mesh、image、prompt；数据卡旧字段ref/ref_path不应假定存在。
- 按六类family单独统计；为失效实体保留invalid rate，按论文口径报告几何评价。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- Hub叫train不表示研究上是训练集；不要拿它调参后再当独立测试。
- tooling_and_gauges仅17例，不能据该列给稳定排名；单行mesh可很大。

## 样例检查范围

- cadena_mesh：2026-10-15；failed；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CADENA · 逐步重建与中间观察](/cad/papers/kab26)

[返回数据与评测资源](/cad/resources)
