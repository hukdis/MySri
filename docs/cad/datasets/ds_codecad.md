---
id: cad-data-ds_codecad
title: CodeCAD（v2）
category: cad
type: concept
tags:
  - 数据资源
  - OpenSCAD
  - CSV
prerequisites: []
related: []
sources:
  - 'https://gitlab.lrz.de/ai-ad/codecad'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-20'
cadRecord: true
---
# CodeCAD（v2）


## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation)
- **格式**：OpenSCAD · CSV · JSON · PNG
- **规模**：v2为76,047模型、约1000万行代码；摘要9.5万余不作为当前v2数量
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：v1：2026-02-09 · v2：2026-08-08，76,047模型

## 官方入口与获取记录

- [原始来源 1](https://gitlab.lrz.de/ai-ad/codecad)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源

**数据许可**

逐模型许可写在info.json与dataset.csv的license字段，不能全库当成同一许可

**代码许可**

见官方仓库，代码与数据分开核查

**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款

**官方划分**

官方README没有固定训练/测试比例；采用模型/模板/来源分组并保存自定划分

**分组单位**

原始CAD模型/设计文档

**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查

**说明**

按原始模型标识保存来源，不把模态变体计作独立设计

## 最小使用方式

**使用步骤**

- 从官方master或v2标签获取，保存提交哈希，不使用错误的main分支路径。
- 先读dataset.csv，按license筛选后再取OpenSCAD程序、info.json和thumbnail.png。
- 同原程序或参数变体按组划分，检查外部include/use依赖，再做OpenSCAD编译和渲染。

**执行后端**

OpenSCAD，保留源文件依赖

**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志

## 已知限制

- 原作者描述与LLM增强描述是不同字段，不宜混当人工真值。
- 逐模型许可证不同，公开仓库不等于全部模型可按同一条件再分发。

## 样例检查范围

样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[CodeCAD · 人类编写OpenSCAD程序](/cad/papers/fre26)

[I-G-03](/cad/issues/i-g-03)

[返回数据与评测资源](/cad/resources)
