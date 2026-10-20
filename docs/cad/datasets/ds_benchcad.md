---
id: cad-data-ds_benchcad
title: BenchCAD（代码/问答/编辑）
category: cad
type: concept
tags:
  - 数据资源
  - Parquet
  - CadQuery
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/BenchCAD/BenchCAD/raw/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# BenchCAD（代码/问答/编辑）


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction) · [CAD编辑](/cad/tasks/editing) · [CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：Parquet · CadQuery · 图像 · QA · 编辑对
- **规模**：code_gen=17,900、QA=2,400、edit=748；合计21,048行但三者任务与单位不同
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/BenchCAD/BenchCAD/raw/main/README.md)
- [原始来源 2](https://huggingface.co/datasets/BenchCAD/BenchCAD)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：Hub当前总约963MB；先取所需配置

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

CC BY 4.0（数据卡）

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

配置名不是通用train/test；使用官方评测协议并对共享几何单独分组

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 指定配置及同名划分：code_gen/code_gen、QA/QA、edit-bench/edit_bench。
- 读取一条code_gen核对stem、family、code和4个视图+拼图，避免把拼图计为第五独立视角。
- 按family、template、原始stem处理泄漏；问答与编辑若共享代码库，应从训练端排除对应原模型。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 标题的Industry-Standard不能自动解释为已覆盖全部工业规范。
- Hub当前紧凑schema与论文描述的完整发布包不同，所需STEP/参数/操作轨迹应检查实际文件。

## 样例检查范围

- benchcad_code：2026-10-15；sample_loaded；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[BenchCAD](/cad/papers/zha26)

[I-D-02](/cad/issues/i-d-02) · [I-G-02](/cad/issues/i-g-02) · [I-G-03](/cad/issues/i-g-03) · [I-H-03](/cad/issues/i-h-03)

[返回数据与评测资源](/cad/resources)
