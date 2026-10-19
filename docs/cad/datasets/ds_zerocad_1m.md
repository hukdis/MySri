---
id: cad-data-ds_zerocad_1m
title: Zero-to-CAD 1M
category: cad
type: concept
tags:
  - 数据资源
  - Parquet
  - CadQuery代码
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/ADSKAILab/Zero-To-CAD-1m/raw/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# Zero-to-CAD 1M

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_ZeroCAD_1M · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction)
- **格式**：Parquet · CadQuery代码 · STEP · STL · 多视图
- **规模**：名义1M，数据卡明确总数999,633
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/ADSKAILab/Zero-To-CAD-1m/raw/main/README.md)
- [原始来源 2](https://huggingface.co/datasets/ADSKAILab/Zero-To-CAD-1m)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

Apache 2.0


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

train=979,633，validation=10,000，test=10,000


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

未记录。


**说明**

100K由1M视觉特征聚类筛选，存在直接包含关系，需沿用原始模型归属


## 最小使用方式


**使用步骤**

- 先用streaming=True并指定split="train"，只取少量行，避免整库下载。
- 检查uuid、cadquery_file、step_file与图像模态；代码字段按str或bytes显式解码。
- 用同版CadQuery在隔离进程中重放少量可信样本，保存构建、导出和几何状态；先使用100K子集做原型。


**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 合成几何和代码不等于人类工程设计，不能只以构建率证明工程可用。
- 100K来自1M；两个版本之间不能直接做独立训练/泛化评测，必须按uuid去重并保留原始split。
- 检索嵌入和索引在1M仓库；卡片列出999,633嵌入行但999,632映射ID，使用前需核对映射，不默认两者齐全。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[Zero-to-CAD](/cad/papers/ata26)



[返回数据与评测资源](/cad/resources)
