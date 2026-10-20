---
id: cad-data-ds_text2cad
title: Text2CAD
category: cad
type: concept
tags:
  - 数据资源
  - CSV
  - JSON
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/SadilKhan/Text2CAD'
  - 'https://raw.githubusercontent.com/SadilKhan/Text2CAD/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# Text2CAD


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation)
- **格式**：CSV · JSON · CAD向量 · RGB · Depth
- **规模**：约17万CAD及多层文本；1.0与1.1的文本、图像和划分不同，实例数不等于模型数
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：Text2CAD 1.0（原NeurIPS论文） · Text2CAD 1.1（更新标注及筛选）

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/SadilKhan/Text2CAD)
- [原始来源 2](https://raw.githubusercontent.com/SadilKhan/Text2CAD/main/README.md)

- **记录状态**：需登录/同意条款
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：完整约605GB；cad_seq.zip约579MB，CSV约1.1/1.3GB，按版本与任务选择

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

CC BY-NC-SA 4.0，需在Hub同意条款

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

1.0原始划分；1.1 train_test_val.json另有简单体比例过滤；须与版本绑定

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

- 先在数据页登录并同意许可；锁定1.0复现论文或1.1开展新实验。
- 文本任务先取对应CSV、cad_seq.zip及该版本划分，不下载全部RGB/Depth。
- 按uid关联DeepCAD几何，同一uid的多层文本作为同一模型组；先抽50个配对查空值、文本与几何一致性。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 完整仓库约605GB；1.1 RGB约397GB；不宜默认整库下载。
- 文本由VLM/LLM辅助生成，可能有语义偏差；1.1筛选后的训练分布不能与1.0混报。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[Text2CAD](/cad/text2cad)

[I-A-01](/cad/issues/i-a-01) · [I-B-03](/cad/issues/i-b-03) · [I-G-03](/cad/issues/i-g-03)

[返回数据与评测资源](/cad/resources)
