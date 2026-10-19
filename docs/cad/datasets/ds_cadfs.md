---
id: cad-data-ds_cadfs
title: CADFS
category: cad
type: concept
tags:
  - 数据资源
  - FeatureScript
  - JSONL
prerequisites: []
related: []
sources:
  - 'https://huggingface.co/datasets/VladPyatov/CADFS'
  - 'https://raw.githubusercontent.com/VladPyatov/CADFS/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADFS

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_CADFS · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction)
- **格式**：FeatureScript · JSONL · STEP · STL · 图像 · 文本
- **规模**：论文约45万；官方去重unique_models.json为382,609模型，训练/测试子集另按配置统计
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/VladPyatov/CADFS)
- [原始来源 2](https://raw.githubusercontent.com/VladPyatov/CADFS/main/README.md)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：数据页总约90.5GB；官方test_data提供最小评测包

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

数据卡CC BY 4.0；来自ABC等上游部分仍保留原始来源记录


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

stage1/stage2与text/image配置分开；CADFS评测9,347，DeepCAD评测7,278，CADParser评测6,764，均按原ID检查交叉重叠


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

- DS_ABC
- DS_DeepCAD


**说明**

按原始模型标识保存来源，不把模态变体计作独立设计


## 最小使用方式


**使用步骤**

- 不要直接无配置load_dataset整库；数据页当前存在train/test字段不匹配的CastError。
- 先下载某个test_data的JSON与对应ZIP，或按文件显式加载某个train_data JSONL；保留cad_file_id。
- 区分full precision和reduced precision；检查编译差异，FeatureScript执行需按官方Onshape/配套流程配置，而非本地CadQuery。


**执行后端**

FeatureScript/Onshape与官方工具；STEP观察可用本地几何内核


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 舍入到两位小数可能改变编译成功与几何；两个精度版本不可混作相同真值。
- FeatureScript后端与账号/API配置会增加复现成本；本次没有上传数据或调用付费后端。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CADFS](/cad/papers/pya26)



[返回数据与评测资源](/cad/resources)
