---
id: cad-data-ds_mfcadpp
title: MFCAD++
category: cad
type: concept
tags:
  - 数据资源
  - STEP内面标签
  - TXT
prerequisites: []
related: []
sources:
  - >-
    https://pure.qub.ac.uk/en/datasets/mfcad-dataset-dataset-for-paper-hierarchical-cadnet-learning-from/
  - 'https://gitlab.com/qub_femg/machine-learning/mfcad2-dataset'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# MFCAD++

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_MFCADpp · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD理解、评估与规划](/cad/tasks/analysis)
- **格式**：STEP内面标签 · TXT · HDF5图
- **规模**：59,665：训练41,766，验证8,950，测试8,949
- **年份依据**：关联论文年份；不自动等于数据包首次公开时间
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://pure.qub.ac.uk/en/datasets/mfcad-dataset-dataset-for-paper-hierarchical-cadnet-learning-from/)
- [原始来源 2](https://gitlab.com/qub_femg/machine-learning/mfcad2-dataset)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：QUB数据包约1.5GB

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

QUB官方数据记录标CC BY；未给定版号时不擅自补版本


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

官方70:15:15固定划分，分别41,766 / 8,950 / 8,949


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

- 从QUB机构库获取MFCAD_dataset.zip，不受GitLab偶发502影响。
- 按train/val/test目录及train.txt等划分；核对feature_labels.txt、STEP ADVANCED_FACE标签和HDF5图结构。
- 如需自建受控特征组合，用官方生成器main.py调整num_features、combo_range和num_samples，并保存随机种子与失败样本。


**执行后端**

pythonocc-core/官方生成器；HDF5图输入可单独读取


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 标签写入STEP的方式与MFCAD.face_truth不同。
- 生成器提示fillet/round可导致Python崩溃，应逐样本隔离并记录失败；识别任务不等于加工规划。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

[Hierarchical CADNet · 加工特征识别](/cad/papers/col22)

[I-F-02](/cad/issues/i-f-02) · [I-G-04](/cad/issues/i-g-04)

[返回数据与评测资源](/cad/resources)
