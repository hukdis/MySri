---
id: cad-data-ds_abc
title: ABC
category: cad
type: concept
tags:
  - 数据资源
  - STEP
  - Parasolid
prerequisites: []
related: []
sources:
  - 'https://deep-geometry.github.io/abc-dataset/'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# ABC


## 任务、格式与版本

- **任务入口**：[CAD重建](/cad/tasks/reconstruction) · [CAD理解、评估与规划](/cad/tasks/analysis) · [CAD生成](/cad/tasks/generation)
- **格式**：STEP · Parasolid · STL · OBJ · YAML · FeatureScript
- **规模**：约100万模型；部分新增格式约75万模型，不能默认每个模型所有模态齐全
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：v00；格式覆盖不同

## 官方入口与获取记录

- [原始来源 1](https://deep-geometry.github.io/abc-dataset/)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

模型版权归原创建者，官方指向Onshape内容条款

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

通用全库不是统一任务划分；法线评测另有固定训练/测试集

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 先下载官方单模型STEP和meta样例，核对标识、单位及几何读取。
- 仅按任务选择step/obj/feat/ofs分块；官方每块1万模型，使用MD5与大小清单。
- 做图像/点云任务时从同一几何生成并保留相机、采样参数；使用FeatureScript时另核验每个模型的历史可用性。

**执行后端**

先检查文件与配对，再按官方环境准备CAD执行后端

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 最终B-Rep不能自动恢复唯一的原始建模历史；官方也提供ofs FeatureScript，应逐模型检查。
- features的索引从0起、OBJ从1起；模态缺失和曲面处理失败需记录。

## 样例检查范围

- abc_step：2026-10-15；STEP header/data sections present; kernel validity not tested；几何执行：未执行。
- abc_meta：2026-10-15；sample_loaded；几何执行：未执行。

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[ABC](/cad/papers/koc18)

[I-B-02](/cad/issues/i-b-02) · [I-C-02](/cad/issues/i-c-02) · [I-F-02](/cad/issues/i-f-02) · [I-F-03](/cad/issues/i-f-03) · [I-H-06](/cad/issues/i-h-06)

[返回数据与评测资源](/cad/resources)
