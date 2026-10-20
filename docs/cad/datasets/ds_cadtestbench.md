---
id: cad-data-ds_cadtestbench
title: CADTestBench / CADTests
category: cad
type: concept
tags:
  - 数据资源
  - Parquet
  - 文本提示
prerequisites: []
related: []
sources:
  - >-
    https://huggingface.co/datasets/dimitrismallis/CADTestBench/raw/main/README.md
  - 'https://raw.githubusercontent.com/dimitrismallis/CADTestBench/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CADTestBench / CADTests


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：Parquet · 文本提示 · CadQuery测试代码
- **规模**：200个CAD程序；abstract/detailed各200提示，两个分区是同一批sample_id
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/dimitrismallis/CADTestBench/raw/main/README.md)
- [原始来源 2](https://raw.githubusercontent.com/dimitrismallis/CADTestBench/main/README.md)
- [原始来源 3](https://huggingface.co/datasets/dimitrismallis/CADTestBench)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

MIT（数据卡明确声明）

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

评测集，无官方独立训练划分；abstract/detailed是提示粒度

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 分别加载samples和cadtests配置，均可选abstract或detailed。
- 按(sample_id,partition)连接提示与测试；多个cadtest可归入一个requirement_id。
- 先人工查看测试，再用配套工具在生成的final_result上执行；汇报逐要求通过率和几何有效率。

**执行后端**

配套CADTestBench与CadQuery；本轮仅检查文件/代码，未执行几何测试

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 不是大规模训练集；abstract/detailed不是train/test。
- 若在测试要求上反复调参，不应再把同一要求集合当独立泛化验证。

## 样例检查范围

- cadtests_samples：2026-10-15；sample_loaded；几何执行：未执行。
- cadtests_checks：2026-10-15；sample_loaded；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CADTests](/cad/cadtests)

[I-D-02](/cad/issues/i-d-02) · [I-E-01](/cad/issues/i-e-01) · [I-G-01](/cad/issues/i-g-01)

[返回数据与评测资源](/cad/resources)
