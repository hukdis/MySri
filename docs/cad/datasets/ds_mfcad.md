---
id: cad-data-ds_mfcad
title: MFCAD
category: cad
type: concept
tags:
  - 数据资源
  - STEP
  - face_truth标签
prerequisites: []
related: []
sources:
  - 'https://raw.githubusercontent.com/hducg/MFCAD/master/README.md'
  - 'https://raw.githubusercontent.com/hducg/MFCAD/master/LICENSE'
  - 'https://gitlab.com/qub_femg/machine-learning/mfcad2-dataset'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# MFCAD

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_MFCAD · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：STEP · face_truth标签
- **规模**：本轮未从原README确认总数，不套用第三方常见规模
- **年份依据**：未核实首发年份；仓库版权年份不作为发布年
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://raw.githubusercontent.com/hducg/MFCAD/master/README.md)
- [原始来源 2](https://raw.githubusercontent.com/hducg/MFCAD/master/LICENSE)
- [原始来源 3](https://gitlab.com/qub_femg/machine-learning/mfcad2-dataset)
- [原始来源 4](https://github.com/hducg/MFCAD)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

仓库MIT；数据文件另有附带声明时一并保留


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

本轮未核实固定官方划分，实验需保存按模型/生成模板分组的划分


**分组单位**

原始CAD模型/设计文档


**泄漏检查**

同一模型的不同文本、视图、噪声和派生版本应留在同一数据组；另做几何近重复检查


**上游来源**

未记录。


**说明**

按原始模型标识保存来源，不把模态变体计作独立设计


## 最小使用方式


**使用步骤**

- 获取dataset/step及对应.face_truth标签，先读取少量零件。
- 标签是pickled Python列表，使用可信来源与官方occ脚本核对面索引。
- 与MFCAD++比较时单独实现标签读取，不假定两者编码相同。


**执行后端**

pythonocc-core及作者occ脚本


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 面级加工特征不是带时间顺序的完整加工工艺。
- 需pythonocc环境和可靠的面索引映射；原README没有完整划分说明。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[Hierarchical CADNet · 加工特征识别](/cad/papers/col22)



[返回数据与评测资源](/cad/resources)
