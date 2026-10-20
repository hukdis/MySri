---
id: cad-data-ds_skexgen
title: SkexGen预处理DeepCAD数据
category: cad
type: concept
tags:
  - 数据资源
  - JSON
  - PKL
prerequisites: []
related: []
sources:
  - 'https://raw.githubusercontent.com/samxuxiang/SkexGen/main/README.md'
  - 'https://raw.githubusercontent.com/samxuxiang/SkexGen/main/LICENSE'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# SkexGen预处理DeepCAD数据


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation)
- **格式**：JSON · PKL · CAD序列
- **规模**：DeepCAD衍生预处理版本；官方README未给出此包最终可执行样本总数
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/samxuxiang/SkexGen/main/README.md)
- [原始来源 2](https://raw.githubusercontent.com/samxuxiang/SkexGen/main/LICENSE)
- [原始来源 3](https://github.com/samxuxiang/SkexGen)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

仓库MIT；底层DeepCAD/Onshape条件仍需保留

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

继承原模型划分；train_deduplicate_s是去重训练文件

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**上游来源**

- DS_DeepCAD

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 优先获取作者cad_data.zip，保留train_deduplicate_s.pkl、val.pkl、test.pkl。
- 若自行生成，从DeepCAD原JSON及其划分执行官方convert.py，记录失败和参数。
- 需要变体编辑数据时继续使用HNC-CAD官方流程，不把未验证变体当作正确编辑。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 与DeepCAD同源，不是独立泛化测试。
- 部分原JSON不能生成有效实体；pickle格式需按可信官方发布版本在隔离环境中读取。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[SkexGen](/cad/papers/xu22) · [HNC-CAD](/cad/papers/xu23)

[返回数据与评测资源](/cad/resources)
