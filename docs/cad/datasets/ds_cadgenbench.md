---
id: cad-data-ds_cadgenbench
title: CADGenBench · 公开输入
category: cad
type: concept
tags:
  - 数据资源
  - STEP输入
  - 工程图
prerequisites: []
related: []
sources:
  - >-
    https://huggingface.co/datasets/HuggingAI4Engineering/cadgenbench-data/raw/main/README.md
  - 'https://raw.githubusercontent.com/huggingface/cadgenbench/main/README.md'
status: draft
reviewed: false
order: 60
created: '2026-10-19'
updated: '2026-10-19'
cadRecord: true
---
# CADGenBench · 公开输入

::: info 来源资料整理 · 待人工复核
依据用户提供的研究发展树第四版迁移。论文、资源与问题的来源记录不等于本站本次独立核验；AI 方法建议、验证阈值与原因解释不作为实验结果。
:::

> 资源记录 · DS_CADGenBench · 版本与访问状态沿用材料记录，不代表整库已下载或已执行几何验证。

## 任务、格式与版本

- **任务入口**：[CAD生成](/cad/tasks/generation) · [CAD重建](/cad/tasks/reconstruction)
- **格式**：STEP输入 · 工程图 · YAML · 编辑说明
- **规模**：81 fixtures：49生成、32编辑
- **年份依据**：本次核查年份；数据包首发日期未核实
- **版本**：

## 官方入口与获取记录

- [原始来源 1](https://huggingface.co/datasets/HuggingAI4Engineering/cadgenbench-data/raw/main/README.md)
- [原始来源 2](https://raw.githubusercontent.com/huggingface/cadgenbench/main/README.md)
- [原始来源 3](https://huggingface.co/datasets/HuggingAI4Engineering/cadgenbench-data)

- **记录状态**：公开入口
- **资料核查日期**：2026-10-15
- **核查范围**：官方说明/数据卡核对；具体样本与端点检查另列
- **存储与获取**：官方未给出可靠总大小；先查看文件列表再分批获取

公开入口与许可条件分开判断；本轮未下载完整数据集或进行训练

## 许可、划分与来源


**数据许可**

公开输入ODC-BY；ground truth仓库私有


**代码许可**

见官方仓库，代码与数据分开核查


**使用条件**

按此版本数据页和逐文件附带条件使用；本表为来源记录，不替代原条款


**官方划分**

单一评价集，无train/test划分；GT不公开


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

- 下载任务输入，先浏览任务页，识别generation或editing目录。
- 为每个fixture生成output.step；记录输入图纸/原STEP和修改要求。
- 按官方提交格式在隐藏真值榜单评测；本地只能检查合法性与输入协议，不能声称已算完整官方分数。


**执行后端**

任意能输出有效STEP的后端；完整评分依官方服务


**预期产物**

保留下载版本、文件清单、样本标识、划分及核查日志


## 已知限制

- 只有公开输入，不是可监督训练的完整目标集。
- 不把私有ground_truth.step假定为可本地取得，当前没有提交外部榜单或发布结果。

## 样例检查范围


样例文件或格式检查不等于 CAD 内核有效性检查，也不代表全部数据均可获取。

## 关联论文与问题

未单列论文



[返回数据与评测资源](/cad/resources)
